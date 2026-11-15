import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import { Toast } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { applyUpdate, checkForUpdate } from '../utils/appUpdate';
import { useAppStore } from '../store/useAppStore';
import { tableCounts, exportJSON, exportCSV, importBackup, clearAllData, storageEstimate, requestPersistence } from '../data/backup';

const LABELS: Record<string, string> = {
  checklistDays: 'Routine days', checkIns: 'Emotional check-ins', reframes: 'Guided reframes', efforts: 'Effort ledger nights',
  pillarWeeks: 'Friday pillars', practiceSessions: 'Practice sessions', distractionResets: 'Back-to-it resets',
  judgments: 'Judgments noticed', quickReframes: 'Quick reframes', gratitudes: 'Gratitude nights',
};
const fmtBytes = (b: number) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);

export default function SettingsPage() {
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const { toast, showToast } = useToast();
  const [counts, setCounts] = useState<{ name: string; count: number }[]>([]);
  const [storage, setStorage] = useState<{ used: number; persisted: boolean } | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [confirm, setConfirm] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => { tableCounts().then(setCounts); storageEstimate().then(setStorage); };
  useEffect(refresh, []);

  const total = counts.reduce((n, c) => n + c.count, 0);

  const onImport = async (f?: File) => {
    if (!f) return;
    try {
      const n = await importBackup(f, mode);
      showToast(`Restored ${n} entries — reloading`);
      setTimeout(() => window.location.reload(), 1200);
    } catch (e) {
      showToast((e as Error).message || 'Import failed');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const wipe = async () => {
    await clearAllData();
    showToast('All data deleted');
    setTimeout(() => window.location.assign('/today'), 1000);
  };

  const [upd, setUpd] = useState<'idle' | 'checking' | 'ready' | 'latest'>('idle');
  const onCheck = async () => { setUpd('checking'); setUpd((await checkForUpdate()) ? 'ready' : 'latest'); };

  return (
    <>
      <Toast message={toast.message} show={toast.show} />
      <TopBar title="Settings" icon="settings" />
      <div className="page-content rem-page">
        {/* ── Your data ── */}
        <section className="card rem-section">
          <h3 className="rem-h">App version</h3>
          <p className="rem-sub" style={{ marginBottom: 12 }}>
            {upd === 'ready' ? 'A new version is ready.' : upd === 'latest' ? 'You’re on the latest version.' : upd === 'checking' ? 'Checking…' : 'Get the newest version of Sakinah.'}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {upd === 'ready'
              ? <button className="btn-primary" onClick={applyUpdate}>Update now</button>
              : <button className="btn-ghost" onClick={onCheck} disabled={upd === 'checking'}>Check for updates</button>}
            <button className="btn-ghost" onClick={applyUpdate}>Reload app</button>
          </div>
        </section>

        <section className="card rem-section">
          <h3 className="rem-h">Your data</h3>
          <p className="rem-sub" style={{ marginBottom: 10 }}>
            Everything lives on this device only. {total} entries{storage ? ` · ${fmtBytes(storage.used)} used` : ''}.
          </p>
          <div className="st-counts">
            {counts.filter((c) => LABELS[c.name]).map((c) => (
              <div key={c.name} className="st-count"><span>{LABELS[c.name]}</span><strong>{c.count}</strong></div>
            ))}
          </div>
          {storage && (
            <div className="rem-row" style={{ marginTop: 8 }}>
              <div>
                <div className="rem-label">Protect from cleanup</div>
                <div className="rem-sub">{storage.persisted ? 'On — your browser won’t clear Sakinah’s data to free space.' : 'Ask the browser to never auto-clear your data.'}</div>
              </div>
              {!storage.persisted && (
                <button className="btn-ghost" onClick={async () => { const ok = await requestPersistence(); showToast(ok ? 'Protected ✓' : 'Browser declined — install the app to Home Screen and try again'); refresh(); }}>Protect</button>
              )}
            </div>
          )}
        </section>

        {/* ── Backup ── */}
        <section className="card rem-section">
          <h3 className="rem-h">Back up &amp; move</h3>
          <p className="rem-sub" style={{ marginBottom: 12 }}>Export a backup to keep safe or to restore on a new phone.</p>
          <div className="st-btns">
            <button className="btn-primary" onClick={() => exportJSON().then(() => showToast('Backup downloaded'))}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span> Export backup (.json)
            </button>
            <button className="btn-ghost" onClick={() => exportCSV().then(() => showToast('CSV downloaded'))}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>table_view</span> Export for spreadsheets (.csv)
            </button>
          </div>

          <div className="rem-add">
            <div className="rem-label">Restore from backup</div>
            <div className="rem-seg" role="radiogroup" aria-label="Restore mode">
              <button role="radio" aria-checked={mode === 'merge'} className={mode === 'merge' ? 'on' : ''} onClick={() => setMode('merge')}>Merge</button>
              <button role="radio" aria-checked={mode === 'replace'} className={mode === 'replace' ? 'on' : ''} onClick={() => setMode('replace')}>Replace all</button>
            </div>
            <p className="rem-sub">{mode === 'merge' ? 'Adds the backup to what’s here.' : 'Deletes what’s here first, then restores the backup.'}</p>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onImport(e.target.files?.[0])} />
            <button className="btn-ghost" onClick={() => fileRef.current?.click()}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>upload</span> Choose backup file
            </button>
          </div>
        </section>

        {/* ── Getting started ── */}
        <section className="card rem-section">
          <h3 className="rem-h">Getting started</h3>
          <div className="rem-row">
            <div><div className="rem-label">Replay the welcome tour</div><div className="rem-sub">Walk through the app, routine times and notifications again.</div></div>
            <button className="btn-ghost" onClick={() => setOnboarded(false)}>Start</button>
          </div>
          <Link to="/reminders" className="rem-row st-link">
            <div><div className="rem-label">Notifications &amp; reminders</div><div className="rem-sub">Check-in times, sounds, alarms.</div></div>
            <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </section>

        {/* ── Danger ── */}
        <section className="card rem-section st-danger">
          <h3 className="rem-h">Delete everything</h3>
          <p className="rem-sub" style={{ marginBottom: 10 }}>Permanently erases all entries and settings on this device. Export a backup first. Type <strong>DELETE</strong> to confirm.</p>
          <div className="rem-row-inline">
            <input className="rem-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="DELETE" aria-label="Type DELETE to confirm" />
            <button className="st-delete" disabled={confirm !== 'DELETE'} onClick={wipe}>Delete all data</button>
          </div>
        </section>

        <p className="rem-note" style={{ textAlign: 'center' }}>Sakinah v{__APP_VERSION__} · built {__BUILD_DATE__}</p>
      </div>
    </>
  );
}
