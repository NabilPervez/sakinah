import { db } from './db';

/** localStorage keys owned by Serenity (zustand persist stores). */
const LS_KEYS = ['serenity-v2-preferences', 'serenity-v2-reminders'];
const FORMAT = 'serenity-v2-backup';

export interface Backup {
  format: typeof FORMAT;
  version: 1;
  exportedAt: string;
  tables: Record<string, unknown[]>;
  settings: Record<string, string | null>;
}

export async function tableCounts(): Promise<{ name: string; count: number }[]> {
  return Promise.all(db.tables.map(async (t) => ({ name: t.name, count: await t.count() })));
}

export async function buildBackup(): Promise<Backup> {
  const tables: Record<string, unknown[]> = {};
  for (const t of db.tables) tables[t.name] = await t.toArray();
  const settings: Record<string, string | null> = {};
  LS_KEYS.forEach((k) => { settings[k] = localStorage.getItem(k); });
  return { format: FORMAT, version: 1, exportedAt: new Date().toISOString(), tables, settings };
}

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export async function exportJSON() {
  download(`serenity-backup-${stamp()}.json`, JSON.stringify(await buildBackup(), null, 2), 'application/json');
}

/** One CSV per table would be many files; this flattens everything into a single long CSV. */
export async function exportCSV() {
  const b = await buildBackup();
  const esc = (v: unknown) => {
    const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = ['table,date,field,value'];
  for (const [name, rows] of Object.entries(b.tables)) {
    for (const row of rows as Record<string, unknown>[]) {
      const date = (row.date ?? row.weekStart ?? '') as string;
      for (const [k, v] of Object.entries(row)) if (k !== 'id') lines.push([name, date, k, v].map(esc).join(','));
    }
  }
  download(`serenity-data-${stamp()}.csv`, lines.join('\n'), 'text/csv');
}

/** Restores a backup. mode 'replace' wipes first; 'merge' adds/overwrites by id. */
export async function importBackup(file: File, mode: 'replace' | 'merge'): Promise<number> {
  const b = JSON.parse(await file.text()) as Backup;
  if (b?.format !== FORMAT || !b.tables) throw new Error('This file isn’t a Serenity backup.');
  let n = 0;
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) {
      const rows = b.tables[t.name];
      if (mode === 'replace') await t.clear();
      if (Array.isArray(rows) && rows.length) { await t.bulkPut(rows); n += rows.length; }
    }
  });
  Object.entries(b.settings ?? {}).forEach(([k, v]) => { if (LS_KEYS.includes(k) && v) localStorage.setItem(k, v); });
  return n;
}

export async function clearAllData() {
  await db.transaction('rw', db.tables, async () => { for (const t of db.tables) await t.clear(); });
  LS_KEYS.forEach((k) => localStorage.removeItem(k));
}

export async function storageEstimate(): Promise<{ used: number; persisted: boolean } | null> {
  if (!navigator.storage?.estimate) return null;
  const e = await navigator.storage.estimate();
  const persisted = (await navigator.storage.persisted?.()) ?? false;
  return { used: e.usage ?? 0, persisted };
}

/** Asks the browser not to evict Serenity's data under storage pressure. */
export async function requestPersistence(): Promise<boolean> {
  return (await navigator.storage?.persist?.()) ?? false;
}
