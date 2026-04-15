import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Save, X, ChevronDown, ChevronUp, Briefcase, TrendingUp } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ProfEmploymentEntry = {
  id: string;
  // 4.1 Basic
  employeeId: string;
  designation: string;
  department: string;
  institutionName: string;
  affiliatedUniversity: string;
  institutionType: string;
  natureOfAppointment: string;
  dateOfJoining: string;
  dateOfConfirmation: string;
  payBand: string;
  bankAccountDetails: string;
  pfNumber: string;
  serviceBookNumber: string;
  // 4.2 First promotion
  dateOfFirstPromotion: string;
  natureOfFirstAppointment: string;
  firstPayBand: string;
  // 4.3 Second promotion
  dateOfSecondPromotion: string;
  natureOfSecondAppointment: string;
  secondPayBand: string;
  // 4.4 Third promotion
  dateOfThirdPromotion: string;
  natureOfThirdAppointment: string;
  thirdPayBand: string;
};

type Props = {
  entries: ProfEmploymentEntry[];
  onAdd: (entry: ProfEmploymentEntry) => void;
  onUpdate: (id: string, patch: Partial<ProfEmploymentEntry>) => void;
  onRemove: (id: string) => void;
  onSave: () => void;
};

// ── Static Options ─────────────────────────────────────────────────────────────

const DESIGNATION_OPTIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor',
  'Senior Professor', 'Lecturer', 'Reader', 'HOD', 'Principal', 'Director', 'Other',
];

const APPOINTMENT_OPTIONS = [
  'Regular', 'Contract', 'Guest', 'Adjunct', 'Visiting',
  'Assistant Professor', 'Associate Professor', 'Professor', 'Senior Professor',
];

const INSTITUTION_TYPES = [
  'Government', 'Aided', 'Private', 'Deemed', 'Central University', 'Autonomous',
];

const DEPARTMENTS = [
  'Botany', 'Chemistry', 'Commerce', 'Computer Science', 'Economics', 'Education',
  'English', 'Environmental Science', 'Geography', 'History', 'Law', 'Management',
  'Mathematics', 'Microbiology', 'Philosophy', 'Physical Education', 'Physics',
  'Political Science', 'Psychology', 'Sociology', 'Zoology', 'Other',
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const EMPTY_ENTRY = (): ProfEmploymentEntry => ({
  id: uid(),
  employeeId: '',
  designation: '',
  department: '',
  institutionName: '',
  affiliatedUniversity: '',
  institutionType: '',
  natureOfAppointment: '',
  dateOfJoining: '',
  dateOfConfirmation: '',
  payBand: '',
  bankAccountDetails: '',
  pfNumber: '',
  serviceBookNumber: '',
  dateOfFirstPromotion: '',
  natureOfFirstAppointment: '',
  firstPayBand: '',
  dateOfSecondPromotion: '',
  natureOfSecondAppointment: '',
  secondPayBand: '',
  dateOfThirdPromotion: '',
  natureOfThirdAppointment: '',
  thirdPayBand: '',
});

// ── Field Components ───────────────────────────────────────────────────────────

function FormField({
  label, value, onChange, type = 'text', placeholder = '', required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        className="form-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({
  label, value, options, onChange, placeholder = 'Select…', required = false,
}: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}
      </label>
      <select className="form-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Preview Row ────────────────────────────────────────────────────────────────

function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', lineHeight: 1.6 }}>
      <span style={{ color: 'var(--color-text-muted)', minWidth: 180, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: 'var(--color-text)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

// ── Inline Add Form ────────────────────────────────────────────────────────────

function AddEmploymentForm({
  onConfirm,
  onCancel,
}: {
  onConfirm: (entry: ProfEmploymentEntry) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<ProfEmploymentEntry>(EMPTY_ENTRY());
  const set = (patch: Partial<ProfEmploymentEntry>) => setDraft((d) => ({ ...d, ...patch }));

  const canConfirm = draft.designation.trim() && draft.institutionName.trim();

  return (
    <div
      style={{
        border: '2px solid var(--color-primary)',
        borderRadius: 12,
        padding: '1.5rem',
        background: 'var(--color-surface)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        animation: 'fadeSlideIn 0.2s ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Briefcase size={16} color="var(--color-primary)" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>New Employment Entry</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Fill in the basic details below</div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          style={{ padding: '0.3rem 0.5rem', color: 'var(--color-text-muted)' }}
          title="Cancel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Basic Details Grid */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', marginBottom: '0.85rem' }}>
          Basic Details
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <FormField label="Employee ID / Staff Code" value={draft.employeeId} onChange={(v) => set({ employeeId: v })} placeholder="e.g. EMP-1234" />
          <SelectField label="Designation" value={draft.designation} options={DESIGNATION_OPTIONS} onChange={(v) => set({ designation: v })} required />
          <SelectField label="Department" value={draft.department} options={DEPARTMENTS} onChange={(v) => set({ department: v })} />
          <FormField label="College / Institution Name" value={draft.institutionName} onChange={(v) => set({ institutionName: v })} placeholder="Institution name" required />
          <FormField label="University Affiliated to" value={draft.affiliatedUniversity} onChange={(v) => set({ affiliatedUniversity: v })} placeholder="Affiliation university" />
          <SelectField label="Type of Institution" value={draft.institutionType} options={INSTITUTION_TYPES} onChange={(v) => set({ institutionType: v })} />
          <SelectField label="Nature of Appointment" value={draft.natureOfAppointment} options={APPOINTMENT_OPTIONS} onChange={(v) => set({ natureOfAppointment: v })} />
          <FormField label="Date of Joining" value={draft.dateOfJoining} onChange={(v) => set({ dateOfJoining: v })} type="date" />
          <FormField label="Date of Confirmation / Regularization" value={draft.dateOfConfirmation} onChange={(v) => set({ dateOfConfirmation: v })} type="date" />
          <FormField label="Pay Band / Pay Scale / CTC" value={draft.payBand} onChange={(v) => set({ payBand: v })} placeholder="e.g. PB-3, 7th CPC Level 10" />
          <FormField label="Bank Account Details (salary)" value={draft.bankAccountDetails} onChange={(v) => set({ bankAccountDetails: v })} placeholder="Account no. / IFSC" />
          <FormField label="Provident Fund (PF) Number" value={draft.pfNumber} onChange={(v) => set({ pfNumber: v })} placeholder="PF number" />
          <FormField label="Service Book Number" value={draft.serviceBookNumber} onChange={(v) => set({ serviceBookNumber: v })} placeholder="Service book no." />
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)' }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { if (canConfirm) onConfirm(draft); }}
          disabled={!canConfirm}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: canConfirm ? 1 : 0.5 }}
        >
          <Save size={14} /> Add Employment
        </button>
      </div>
    </div>
  );
}

// ── Promotion Slot (inline inside card) ───────────────────────────────────────

type PromotionSlotProps = {
  title: string;
  ordinal: 'first' | 'second' | 'third';
  dateValue: string;
  natureValue: string;
  payBandValue: string;
  onSave: (date: string, nature: string, pay: string) => void;
  onRemove: () => void;
};

function PromotionSlot({ title, dateValue, natureValue, payBandValue, onSave, onRemove }: PromotionSlotProps) {
  const hasSaved = !!(dateValue || natureValue || payBandValue);
  const [editing, setEditing] = useState(!hasSaved);
  const [date, setDate] = useState(dateValue);
  const [nature, setNature] = useState(natureValue);
  const [pay, setPay] = useState(payBandValue);

  useEffect(() => {
    setDate(dateValue); setNature(natureValue); setPay(payBandValue);
  }, [dateValue, natureValue, payBandValue]);

  const handleSave = () => {
    onSave(date, nature, pay);
    setEditing(false);
  };

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 8,
      overflow: 'hidden',
      background: 'var(--color-bg)',
    }}>
      {/* Slot header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.65rem 1rem',
        background: 'var(--color-surface)',
        borderBottom: editing ? '1px solid var(--color-border)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={14} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</span>
          {hasSaved && !editing && (
            <span style={{
              fontSize: '0.7rem', padding: '0.1rem 0.5rem',
              background: 'var(--color-primary-light)', color: 'var(--color-primary)',
              borderRadius: 99, fontWeight: 600,
            }}>Saved</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {hasSaved && !editing && (
            <button type="button" className="btn btn-ghost"
              onClick={() => setEditing(true)}
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Pencil size={11} /> Edit
            </button>
          )}
          <button type="button" className="btn btn-ghost"
            onClick={onRemove}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.4rem', color: 'var(--color-danger)' }}
            title="Remove promotion">
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      {/* Body */}
      {editing ? (
        <div style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <FormField label="Date of Promotion" value={date} onChange={setDate} type="date" />
            <SelectField label="Nature of Appointment after Promotion" value={nature} options={APPOINTMENT_OPTIONS} onChange={setNature} />
            <FormField label="New Pay Band / Pay Scale" value={pay} onChange={setPay} placeholder="e.g. PB-3, ₹15,600–39,100" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {hasSaved && (
              <button type="button" className="btn btn-ghost"
                onClick={() => { setDate(dateValue); setNature(natureValue); setPay(payBandValue); setEditing(false); }}
                style={{ fontSize: '0.8125rem' }}>
                Cancel
              </button>
            )}
            <button type="button" className="btn btn-primary"
              onClick={handleSave}
              disabled={!date && !nature && !pay}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', opacity: (!date && !nature && !pay) ? 0.5 : 1 }}>
              <Save size={13} /> Save Promotion
            </button>
          </div>
        </div>
      ) : hasSaved ? (
        <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <PreviewRow label="Date" value={date} />
          <PreviewRow label="Nature of Appointment" value={nature} />
          <PreviewRow label="Pay Band" value={pay} />
        </div>
      ) : null}
    </div>
  );
}

// ── Entry Card ─────────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  onUpdate,
  onRemove,
  onSave,
}: {
  entry: ProfEmploymentEntry;
  onUpdate: (patch: Partial<ProfEmploymentEntry>) => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [draft, setDraft] = useState<ProfEmploymentEntry>(entry);
  // Which promotion slots are shown: 0 = none, 1 = first, 2 = first+second, 3 = all
  const [promoSlotsVisible, setPromoSlotsVisible] = useState<number>(() => {
    if (entry.dateOfThirdPromotion || entry.thirdPayBand) return 3;
    if (entry.dateOfSecondPromotion || entry.secondPayBand) return 2;
    if (entry.dateOfFirstPromotion || entry.firstPayBand) return 1;
    return 0;
  });

  useEffect(() => { setDraft(entry); }, [entry]);

  const set = (patch: Partial<ProfEmploymentEntry>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
    onSave();
  };

  const handleDiscard = () => {
    setDraft(entry);
    setEditing(false);
  };

  const firstPromoFilled = !!(entry.dateOfFirstPromotion || entry.firstPayBand);
  const secondPromoFilled = !!(entry.dateOfSecondPromotion || entry.secondPayBand);

  // Summary line
  const summaryParts = [
    entry.designation,
    entry.department,
    entry.institutionName,
    entry.dateOfJoining ? `Joined ${entry.dateOfJoining}` : '',
  ].filter(Boolean);
  const summary = summaryParts.join(' · ') || 'Click to view details';

  return (
    <div
      className="card"
      style={{
        padding: '1rem 1.25rem',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
      }}
    >
      {/* ── Card Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Left: icon + title + summary */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.15rem 0' }}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'var(--color-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Briefcase size={17} color="var(--color-primary)" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {entry.designation || entry.institutionName || 'Employment Entry'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {summary}
            </div>
          </div>
          <div style={{ flexShrink: 0, color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </button>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
          {!editing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setEditing(true); setExpanded(true); }}
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

      {/* ── Expanded Body ── */}
      {expanded && (
        <div style={{ marginTop: '0.85rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.85rem' }}>
          {!editing ? (
            // ── Preview mode ──
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <PreviewRow label="Employee ID / Staff Code" value={entry.employeeId} />
              <PreviewRow label="Designation" value={entry.designation} />
              <PreviewRow label="Department" value={entry.department} />
              <PreviewRow label="Institution Name" value={entry.institutionName} />
              <PreviewRow label="University Affiliated to" value={entry.affiliatedUniversity} />
              <PreviewRow label="Type of Institution" value={entry.institutionType} />
              <PreviewRow label="Nature of Appointment" value={entry.natureOfAppointment} />
              <PreviewRow label="Date of Joining" value={entry.dateOfJoining} />
              <PreviewRow label="Date of Confirmation" value={entry.dateOfConfirmation} />
              <PreviewRow label="Pay Band / Pay Scale / CTC" value={entry.payBand} />
              <PreviewRow label="Bank Account Details" value={entry.bankAccountDetails} />
              <PreviewRow label="PF Number" value={entry.pfNumber} />
              <PreviewRow label="Service Book Number" value={entry.serviceBookNumber} />

              {/* ── Promotion Details ── */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
                    Promotion Details
                  </p>
                  {promoSlotsVisible === 0 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setPromoSlotsVisible(1)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', padding: '0.3rem 0.7rem' }}
                    >
                      <TrendingUp size={13} /> Add Promotion Details
                    </button>
                  )}
                </div>

                {promoSlotsVisible === 0 && (
                  <div style={{
                    padding: '1rem',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 8,
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.8125rem',
                  }}>
                    No promotions recorded. Click <strong>Add Promotion Details</strong> to add one.
                  </div>
                )}

                {promoSlotsVisible >= 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <PromotionSlot
                      title="1st Promotion"
                      ordinal="first"
                      dateValue={entry.dateOfFirstPromotion}
                      natureValue={entry.natureOfFirstAppointment}
                      payBandValue={entry.firstPayBand}
                      onSave={(date, nature, pay) => {
                        onUpdate({ dateOfFirstPromotion: date, natureOfFirstAppointment: nature, firstPayBand: pay });
                        onSave();
                      }}
                      onRemove={() => {
                        onUpdate({ dateOfFirstPromotion: '', natureOfFirstAppointment: '', firstPayBand: '' });
                        onSave();
                        setPromoSlotsVisible(0);
                      }}
                    />

                    {/* Add 2nd promotion CTA — shown only after 1st is filled */}
                    {promoSlotsVisible === 1 && firstPromoFilled && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setPromoSlotsVisible(2)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-primary)', alignSelf: 'flex-start', padding: '0.3rem 0.5rem' }}
                      >
                        <Plus size={13} /> Add 2nd Promotion
                      </button>
                    )}

                    {promoSlotsVisible >= 2 && (
                      <PromotionSlot
                        title="2nd Promotion"
                        ordinal="second"
                        dateValue={entry.dateOfSecondPromotion}
                        natureValue={entry.natureOfSecondAppointment}
                        payBandValue={entry.secondPayBand}
                        onSave={(date, nature, pay) => {
                          onUpdate({ dateOfSecondPromotion: date, natureOfSecondAppointment: nature, secondPayBand: pay });
                          onSave();
                        }}
                        onRemove={() => {
                          onUpdate({ dateOfSecondPromotion: '', natureOfSecondAppointment: '', secondPayBand: '' });
                          onSave();
                          setPromoSlotsVisible(1);
                        }}
                      />
                    )}

                    {/* Add 3rd promotion CTA — shown only after 2nd is filled */}
                    {promoSlotsVisible === 2 && secondPromoFilled && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setPromoSlotsVisible(3)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-primary)', alignSelf: 'flex-start', padding: '0.3rem 0.5rem' }}
                      >
                        <Plus size={13} /> Add 3rd Promotion
                      </button>
                    )}

                    {promoSlotsVisible >= 3 && (
                      <PromotionSlot
                        title="3rd Promotion"
                        ordinal="third"
                        dateValue={entry.dateOfThirdPromotion}
                        natureValue={entry.natureOfThirdAppointment}
                        payBandValue={entry.thirdPayBand}
                        onSave={(date, nature, pay) => {
                          onUpdate({ dateOfThirdPromotion: date, natureOfThirdAppointment: nature, thirdPayBand: pay });
                          onSave();
                        }}
                        onRemove={() => {
                          onUpdate({ dateOfThirdPromotion: '', natureOfThirdAppointment: '', thirdPayBand: '' });
                          onSave();
                          setPromoSlotsVisible(2);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ── Edit mode (basic details only) ──
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Section 4.1 — Basic Details */}
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Basic Details
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <FormField label="Employee ID / Staff Code" value={draft.employeeId} onChange={(v) => set({ employeeId: v })} placeholder="e.g. EMP-1234" />
                  <SelectField label="Designation" value={draft.designation} options={DESIGNATION_OPTIONS} onChange={(v) => set({ designation: v })} required />
                  <SelectField label="Department" value={draft.department} options={DEPARTMENTS} onChange={(v) => set({ department: v })} />
                  <FormField label="College / Institution Name" value={draft.institutionName} onChange={(v) => set({ institutionName: v })} placeholder="Institution name" required />
                  <FormField label="University Affiliated to" value={draft.affiliatedUniversity} onChange={(v) => set({ affiliatedUniversity: v })} placeholder="Affiliation university" />
                  <SelectField label="Type of Institution" value={draft.institutionType} options={INSTITUTION_TYPES} onChange={(v) => set({ institutionType: v })} />
                  <SelectField label="Nature of Appointment" value={draft.natureOfAppointment} options={APPOINTMENT_OPTIONS} onChange={(v) => set({ natureOfAppointment: v })} />
                  <FormField label="Date of Joining" value={draft.dateOfJoining} onChange={(v) => set({ dateOfJoining: v })} type="date" />
                  <FormField label="Date of Confirmation / Regularization" value={draft.dateOfConfirmation} onChange={(v) => set({ dateOfConfirmation: v })} type="date" />
                  <FormField label="Pay Band / Pay Scale / CTC" value={draft.payBand} onChange={(v) => set({ payBand: v })} placeholder="e.g. PB-3, 7th CPC Level 10" />
                  <FormField label="Bank Account Details (salary)" value={draft.bankAccountDetails} onChange={(v) => set({ bankAccountDetails: v })} placeholder="Account no. / IFSC" />
                  <FormField label="Provident Fund (PF) Number" value={draft.pfNumber} onChange={(v) => set({ pfNumber: v })} placeholder="PF number" />
                  <FormField label="Service Book Number" value={draft.serviceBookNumber} onChange={(v) => set({ serviceBookNumber: v })} placeholder="Service book no." />
                </div>
              </div>

              {/* Bottom Save / Remove */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '0.85rem', borderTop: '1px solid var(--color-border)',
              }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onRemove}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }}
                >
                  <Trash2 size={14} /> Remove
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem' }}
                >
                  <Save size={14} /> Save Entry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────

export default function ProfessionalEmploymentDetailsSection({
  entries,
  onAdd,
  onUpdate,
  onRemove,
  onSave,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleConfirmAdd = (entry: ProfEmploymentEntry) => {
    onAdd(entry);
    setShowAddForm(false);
    onSave();
  };

  return (
    <div>
      {/* Section Title + Add Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-primary)' }}>
          Professional / Employment Details
        </h3>
        {!showAddForm && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Employment
          </button>
        )}
      </div>

      {/* Inline Add Form */}
      {showAddForm && (
        <div style={{ marginBottom: '1rem' }}>
          <AddEmploymentForm
            onConfirm={handleConfirmAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !showAddForm && (
        <div style={{
          padding: '2.5rem',
          border: '1px dashed var(--color-border)',
          borderRadius: 10,
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}>
          No employment details added yet.<br />
          Click <strong>Add Employment</strong> to get started.
        </div>
      )}

      {/* Entry Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            onUpdate={(patch) => onUpdate(entry.id, patch)}
            onRemove={() => onRemove(entry.id)}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  );
}