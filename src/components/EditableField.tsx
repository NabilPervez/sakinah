import { useEffect, useState } from 'react';

/**
 * One field, its own Save / Edit (Nabil, 2026-11-15: "Allow buttons for save and edit for every field").
 * Saved → shows the text with an Edit button. Editing → input with Save (and Cancel if there was a value).
 */
export default function EditableField({ id, label, value, placeholder, multiline, onSave }: {
  id: string; label: React.ReactNode; value: string; placeholder?: string; multiline?: boolean;
  onSave: (v: string) => Promise<void> | void;
}) {
  const [editing, setEditing] = useState(!value);
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); setEditing(!value); }, [value]);

  const save = async () => { await onSave(draft.trim()); setEditing(false); };

  return (
    <div className="ef">
      <label htmlFor={id}>{label}</label>
      {editing ? (
        <>
          {multiline
            ? <textarea id={id} className="qp-input qp-textarea" value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} />
            : <input id={id} className="qp-input" value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && draft.trim() && save()} />}
          <div className="ef-actions">
            <button className="qp-btn qp-btn-primary" onClick={save} disabled={!draft.trim()}>Save</button>
            {value && <button className="qp-btn qp-btn-ghost" onClick={() => { setDraft(value); setEditing(false); }}>Cancel</button>}
          </div>
        </>
      ) : (
        <div className="ef-saved">
          <span className="material-symbols-outlined ef-tick" aria-hidden="true">check_circle</span>
          <p>{value}</p>
          <button className="qp-btn qp-btn-ghost ef-edit" onClick={() => setEditing(true)} aria-label="Edit">Edit</button>
        </div>
      )}
    </div>
  );
}
