import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Trash2, Pencil, Save, X, Search, ChevronDown } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export type ExamType = 'net' | 'set' | 'gate' | 'jrf' | 'other';

export type EntranceTestEntry = {
  id: string;
  examType: ExamType;
  // NET
  subject?: string;
  year?: string;
  certificateNo?: string;
  // SET
  state?: string;
  // GATE
  score?: string;
  // JRF
  agency?: string;
  // Other
  examName?: string;
  details?: string;
};

type Props = {
  entries: EntranceTestEntry[];
  onAdd: (entry: EntranceTestEntry) => void;
  onUpdate: (id: string, patch: Partial<EntranceTestEntry>) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
};

// ── Static Data ──────────────────────────────────────────────────────────────

const EXAM_OPTIONS: { value: ExamType; label: string; description: string }[] = [
  { value: 'net', label: 'NET', description: 'National Eligibility Test' },
  { value: 'set', label: 'SET / SLET', description: 'State Eligibility Test' },
  { value: 'gate', label: 'GATE', description: 'Graduate Aptitude Test in Engg.' },
  { value: 'jrf', label: 'JRF', description: 'Junior Research Fellowship' },
  { value: 'other', label: 'Other', description: 'Any other competitive exam' },
];

const EXAM_LABEL: Record<ExamType, string> = {
  net: 'NET',
  set: 'SET / SLET',
  gate: 'GATE',
  jrf: 'JRF',
  other: 'Other',
};

const NET_SET_SUBJECTS = [
  'Commerce',
  'Computer Science & Applications',
  'Economics',
  'Education',
  'English',
  'Environmental Sciences',
  'Geography',
  'Hindi',
  'History',
  'Law',
  'Library & Information Science',
  'Management',
  'Mathematics',
  'Philosophy',
  'Physical Education',
  'Physics',
  'Political Science',
  'Psychology',
  'Sanskrit',
  'Social Work',
  'Sociology',
  'Tourism Administration & Management',
  'Urdu',
  'Women Studies',
];

const YEAR_OPTIONS = Array.from({ length: 40 }, (_, i) => `${new Date().getFullYear() - i}`);

const JRF_AGENCIES = ['UGC', 'CSIR', 'ICMR', 'DBT', 'ICAR', 'DST', 'DRDO', 'Other'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Searchable Select ─────────────────────────────────────────────────────────

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search or select…',
  allowCustom = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  allowCustom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const handleSelect = (opt: string) => {
    onChange(opt);
    setQuery('');
    setOpen(false);
  };

  const handleCustom = () => {
    if (query.trim()) {
      onChange(query.trim());
      setQuery('');
      setOpen(false);
    }
  };

  return (
    <div className="form-group" ref={wrapRef} style={{ position: 'relative' }}>
      <label className="form-label">{label}</label>
      <div
        className="form-input"
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          gap: '0.4rem',
          padding: '0 0.75rem',
          height: 38,
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ flex: 1, fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} color="var(--color-text-muted)" style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 200,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            marginTop: 4,
            overflow: 'hidden',
          }}
        >
          {/* Search Box */}
          <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={13} color="var(--color-text-muted)" />
            <input
              autoFocus
              className="form-input"
              style={{ border: 'none', background: 'transparent', padding: '0.15rem 0', fontSize: '0.8125rem', flex: 1 }}
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (filtered.length > 0) handleSelect(filtered[0]);
                  else if (allowCustom) handleCustom();
                }
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filtered.length === 0 && !allowCustom && (
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>No matches found.</div>
            )}
            {filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  background: value === opt ? 'var(--color-primary-light)' : 'transparent',
                  color: value === opt ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: value === opt ? 600 : 400,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)'; }}
                onMouseLeave={(e) => { if (value !== opt) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {opt}
              </div>
            ))}
            {allowCustom && query.trim() && !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) && (
              <div
                onClick={handleCustom}
                style={{
                  padding: '0.55rem 1rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                  fontStyle: 'italic',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                + Add "{query.trim()}" as custom
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Preview Row ───────────────────────────────────────────────────────────────

function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', lineHeight: 1.6 }}>
      <span style={{ color: 'var(--color-text-muted)', minWidth: 130, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

// ── Entry Preview Card ────────────────────────────────────────────────────────

function EntryCard({
  entry,
  onUpdate,
  onRemove,
  onSave,
}: {
  entry: EntranceTestEntry;
  onUpdate: (patch: Partial<EntranceTestEntry>) => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EntranceTestEntry>(entry);

  // Keep draft in sync when entry changes externally (e.g. on load)
  useEffect(() => { setDraft(entry); }, [entry]);

  const set = (patch: Partial<EntranceTestEntry>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
    onSave();
  };

  const handleDiscard = () => {
    setDraft(entry);
    setEditing(false);
  };

  const examLabel = EXAM_LABEL[entry.examType];

  /* ── summary line ── */
  const summaryParts: string[] = [];
  if (entry.examType === 'net' || entry.examType === 'set') {
    if (entry.subject) summaryParts.push(entry.subject);
    if (entry.year) summaryParts.push(entry.year);
    if (entry.examType === 'set' && entry.state) summaryParts.push(entry.state);
    if (entry.examType === 'net' && entry.certificateNo) summaryParts.push(`Cert# ${entry.certificateNo}`);
  } else if (entry.examType === 'gate') {
    if (entry.score) summaryParts.push(`Score: ${entry.score}`);
    if (entry.year) summaryParts.push(entry.year);
  } else if (entry.examType === 'jrf') {
    if (entry.agency) summaryParts.push(entry.agency);
    if (entry.year) summaryParts.push(entry.year);
  } else {
    if (entry.examName) summaryParts.push(entry.examName);
    if (entry.year) summaryParts.push(entry.year);
  }
  const summary = summaryParts.join(' · ') || 'No details yet';

  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.25rem',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-primary)',
              background: 'var(--color-primary-light)',
              padding: '0.15rem 0.55rem',
              borderRadius: 20,
            }}>
              {examLabel}
            </span>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{summary}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          {!editing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditing(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.7rem' }}
            >
              <Pencil size={13} /> Edit
            </button>
          )}
          {editing && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.7rem' }}
              >
                <Save size={13} /> Save
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleDiscard}
                style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.5rem', color: 'var(--color-text-muted)' }}
              >
                <X size={13} />
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onRemove}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.5rem', color: 'var(--color-danger)' }}
            title="Remove"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
        {!editing ? (
          /* Preview mode */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {(entry.examType === 'net' || entry.examType === 'set') && (
              <>
                <PreviewRow label="Subject" value={entry.subject} />
                <PreviewRow label="Year" value={entry.year} />
                {entry.examType === 'net' && <PreviewRow label="Certificate No." value={entry.certificateNo} />}
                {entry.examType === 'set' && <PreviewRow label="State" value={entry.state} />}
              </>
            )}
            {entry.examType === 'gate' && (
              <>
                <PreviewRow label="Score / Percentile" value={entry.score} />
                <PreviewRow label="Year" value={entry.year} />
              </>
            )}
            {entry.examType === 'jrf' && (
              <>
                <PreviewRow label="Agency" value={entry.agency} />
                <PreviewRow label="Year" value={entry.year} />
              </>
            )}
            {entry.examType === 'other' && (
              <>
                <PreviewRow label="Exam Name" value={entry.examName} />
                <PreviewRow label="Year" value={entry.year} />
                <PreviewRow label="Details" value={entry.details} />
              </>
            )}
            {summaryParts.length === 0 && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0 }}>
                No details added. Click <strong>Edit</strong> to fill in the details.
              </p>
            )}
          </div>
        ) : (
          /* Edit mode */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {(draft.examType === 'net' || draft.examType === 'set') && (
              <>
                <SearchableSelect
                  label="Subject"
                  options={NET_SET_SUBJECTS}
                  value={draft.subject || ''}
                  onChange={(v) => set({ subject: v })}
                  allowCustom
                />
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {draft.examType === 'net' && (
                  <div className="form-group">
                    <label className="form-label">Certificate No.</label>
                    <input className="form-input" value={draft.certificateNo || ''} onChange={(e) => set({ certificateNo: e.target.value })} placeholder="e.g. NET/2021/001234" />
                  </div>
                )}
                {draft.examType === 'set' && (
                  <SearchableSelect
                    label="State"
                    options={INDIAN_STATES}
                    value={draft.state || ''}
                    onChange={(v) => set({ state: v })}
                  />
                )}
              </>
            )}

            {draft.examType === 'gate' && (
              <>
                <div className="form-group">
                  <label className="form-label">Score / Percentile</label>
                  <input className="form-input" value={draft.score || ''} onChange={(e) => set({ score: e.target.value })} placeholder="e.g. 725 / 98.5 percentile" />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </>
            )}

            {draft.examType === 'jrf' && (
              <>
                <SearchableSelect
                  label="Agency (UGC / CSIR / ICMR…)"
                  options={JRF_AGENCIES}
                  value={draft.agency || ''}
                  onChange={(v) => set({ agency: v })}
                  allowCustom
                />
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </>
            )}

            {draft.examType === 'other' && (
              <>
                <div className="form-group">
                  <label className="form-label">Exam Name</label>
                  <input className="form-input" value={draft.examName || ''} onChange={(e) => set({ examName: e.target.value })} placeholder="e.g. GRE, CAT, IELTS…" />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                    <option value="">Select year</option>
                    {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Details / Score</label>
                  <input className="form-input" value={draft.details || ''} onChange={(e) => set({ details: e.target.value })} placeholder="Score, rank, or brief description" />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Entry Modal ───────────────────────────────────────────────────────────

function AddEntryModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (entry: EntranceTestEntry) => void;
}) {
  const [step, setStep] = useState<'type' | 'fields'>('type');
  const [examType, setExamType] = useState<ExamType | null>(null);
  const [draft, setDraft] = useState<Partial<EntranceTestEntry>>({});

  const set = (patch: Partial<EntranceTestEntry>) => setDraft((d) => ({ ...d, ...patch }));

  const handleTypeSelect = (type: ExamType) => {
    setExamType(type);
    setDraft({ examType: type });
    setStep('fields');
  };

  const handleAdd = () => {
    if (!examType) return;
    onAdd({ id: uid(), examType, ...draft } as EntranceTestEntry);
    onClose();
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,15,30,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500, padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="card"
        style={{ width: '100%', maxWidth: 520, padding: '1.75rem', position: 'relative' }}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.0625rem', margin: 0 }}>
              {step === 'type' ? 'Select Exam Type' : `Add ${EXAM_LABEL[examType!]} Entry`}
            </h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              {step === 'type' ? 'Choose the type of entrance or eligibility test.' : 'Fill in the details below.'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            style={{ padding: '0.35rem', color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Type picker */}
        {step === 'type' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {EXAM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleTypeSelect(opt.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  background: 'var(--color-bg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)'; }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 8,
                  background: 'var(--color-primary-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>{opt.label.split(' ')[0]}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Fields */}
        {step === 'fields' && examType && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {(examType === 'net' || examType === 'set') && (
                <>
                  <SearchableSelect
                    label="Subject"
                    options={NET_SET_SUBJECTS}
                    value={draft.subject || ''}
                    onChange={(v) => set({ subject: v })}
                    allowCustom
                  />
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  {examType === 'net' && (
                    <div className="form-group">
                      <label className="form-label">Certificate No.</label>
                      <input className="form-input" value={draft.certificateNo || ''} onChange={(e) => set({ certificateNo: e.target.value })} placeholder="e.g. NET/2021/001234" />
                    </div>
                  )}
                  {examType === 'set' && (
                    <SearchableSelect
                      label="State"
                      options={INDIAN_STATES}
                      value={draft.state || ''}
                      onChange={(v) => set({ state: v })}
                    />
                  )}
                </>
              )}

              {examType === 'gate' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Score / Percentile</label>
                    <input className="form-input" value={draft.score || ''} onChange={(e) => set({ score: e.target.value })} placeholder="e.g. 725 / 98.5 percentile" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </>
              )}

              {examType === 'jrf' && (
                <>
                  <SearchableSelect
                    label="Agency (UGC / CSIR / ICMR…)"
                    options={JRF_AGENCIES}
                    value={draft.agency || ''}
                    onChange={(v) => set({ agency: v })}
                    allowCustom
                  />
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </>
              )}

              {examType === 'other' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Exam Name</label>
                    <input className="form-input" value={draft.examName || ''} onChange={(e) => set({ examName: e.target.value })} placeholder="e.g. GRE, CAT, IELTS…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <select className="form-input" value={draft.year || ''} onChange={(e) => set({ year: e.target.value })}>
                      <option value="">Select year</option>
                      {YEAR_OPTIONS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Details / Score</label>
                    <input className="form-input" value={draft.details || ''} onChange={(e) => set({ details: e.target.value })} placeholder="Score, rank, or brief description" />
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep('type')}
                style={{ fontSize: '0.8125rem' }}
              >
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAdd}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}
              >
                <Plus size={15} /> Add Entry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

export default function EntranceEligibilityTestsSection({
  entries,
  onAdd,
  onUpdate,
  onRemove,
  onSave,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return entries;
    return entries.filter((e) => {
      const parts = [
        EXAM_LABEL[e.examType],
        e.subject,
        e.year,
        e.certificateNo,
        e.state,
        e.score,
        e.agency,
        e.examName,
        e.details,
      ].filter(Boolean).join(' ').toLowerCase();
      return parts.includes(q);
    });
  }, [entries, search]);

  return (
    <div>
      {/* Section Title */}
      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--color-primary)' }}>
        Entrance / Eligibility Tests
      </h3>

      {/* Toolbar: Search + Add button */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', pointerEvents: 'none' }} />
          <input
            className="form-input"
            style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
            placeholder="Search entries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Add Data button */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}
        >
          <Plus size={16} /> Add Data
        </button>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div style={{
          padding: '2.5rem',
          border: '1px dashed var(--color-border)',
          borderRadius: 10,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}>
          No entrance or eligibility tests added yet.<br />
          Click <strong>Add Data</strong> above to get started.
        </div>
      )}

      {/* No search results */}
      {entries.length > 0 && filtered.length === 0 && (
        <div style={{
          padding: '1.5rem',
          border: '1px dashed var(--color-border)',
          borderRadius: 10,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}>
          No entries match "<strong>{search}</strong>".
        </div>
      )}

      {/* Entry Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onUpdate={(patch) => onUpdate(entry.id, patch)}
            onRemove={() => onRemove(entry.id)}
            onSave={onSave}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <AddEntryModal
          onClose={() => setShowModal(false)}
          onAdd={(entry) => {
            onAdd(entry);
            onSave();
          }}
        />
      )}
    </div>
  );
}
