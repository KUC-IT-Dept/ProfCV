import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Pencil, Save, X } from 'lucide-react';
import FileField from '../../../components/FileField';
import SelectField from '../../../components/SelectField';
import { Profile } from './profileBuilderTypes';

type EducationalQualificationsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['qualifications'][number], value: string) => void;
  onRemove: (index: number) => void;
  onUploadCertificate: (index: number, field: string, file: File) => void;
  onSave: () => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

const YEAR_OPTIONS = Array.from({ length: 100 }, (_, index) => `${new Date().getFullYear() - index}`);
const DIVISION_OPTIONS = ['First', 'Second', 'Third', 'Pass'];
const MODE_OPTIONS = ['regular', 'distance'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Germany', 'France', 'Australia', 'Other'];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const CERTIFICATE_MAPPING: Record<string, { label: string; field: string }> = {
  '10th': { label: '10th Certificate', field: 'tenthcertificate' },
  '12th': { label: '12th Certificate', field: 'twelfthcertificate' },
  'Undergraduate': { label: 'Graduation Certificate', field: 'ugcertificate' },
  'Postgraduate': { label: 'Post-Graduation Certificate', field: 'pgcertificate' },
  'M.Phil.': { label: 'M.Phil. Certificate', field: 'mphilcertificate' },
  'Ph.D.': { label: 'Ph.D. Certificate', field: 'phdcertificate' },
};

const SINGLE_ENTRY_LEVELS = ['10th', '12th'];

// Preview row helper
function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', lineHeight: 1.5 }}>
      <span style={{ color: 'var(--color-text-muted)', minWidth: 140, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: 'var(--color-text)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export default function EducationalQualificationsSection({
  profile,
  onAdd,
  onUpdate,
  onRemove,
  onUploadCertificate,
  onSave,
  isExpanded,
  onToggle,
}: EducationalQualificationsSectionProps) {
  // Track which cards are in "edit mode"
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());

  const setEditing = (index: number, editing: boolean) => {
    setEditingIndices((prev) => {
      const next = new Set(prev);
      if (editing) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  // Qualification levels already used
  const usedLevels = profile.qualifications.map(
    (q) => q.educationlevel || q.degree
  );

  const handleAdd = () => {
    const nextIndex = profile.qualifications.length;
    onAdd();
    // New items start in edit mode
    setEditingIndices((prev) => new Set([...prev, nextIndex]));
  };

  const handleSave = (index: number) => {
    setEditing(index, false);
    onSave();
  };

  return (
    <div className="space-y-4">
      {/* ── Add button at top ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>Educational Qualifications</h3>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          Add Qualification
        </button>
      </div>

      {profile.qualifications.length === 0 && (
        <div style={{
          padding: '2rem',
          border: '1px dashed var(--color-border)',
          borderRadius: '8px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
        }}>
          No qualifications added yet. Click <strong>Add Qualification</strong> above to get started.
        </div>
      )}

      {profile.qualifications.map((qualification, index) => {
        const cardKey = `qualifications-${index}`;
        const qualificationType = qualification.educationlevel || qualification.degree || '';
        const isEditMode = editingIndices.has(index);
        const certInfo = CERTIFICATE_MAPPING[qualificationType];

        const summary = [
          qualificationType,
          qualification.specialisation,
          qualification.institution,
          qualification.yearofpassing,
        ].filter(Boolean).join(' · ') || 'No details added yet';

        // Build filtered options: disable 10th/12th if already used by another entry
        const qualTypeOptions = ['10th', '12th', 'Undergraduate', 'Postgraduate', 'M.Phil.', 'Ph.D.', 'Other'].filter(
          (opt) => {
            if (!SINGLE_ENTRY_LEVELS.includes(opt)) return true;
            // Allow if this card is already of that type (editing its own entry)
            if (qualificationType === opt) return true;
            // Disallow if another card already uses it
            return !usedLevels.some((l, i) => i !== index && l === opt);
          }
        );

        return (
          <div
            key={cardKey}
            className="card"
            style={{ padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)', borderRadius: '8px' }}
          >
            {/* ── Card Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => onToggle(cardKey)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0.25rem 0',
                }}
              >
                <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text)' }}>
                  {qualificationType || `Qualification ${index + 1}`}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                  {summary}
                </span>
              </button>

              {/* Action buttons shown in header */}
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexShrink: 0 }}>
                {!isEditMode && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      if (!isExpanded(cardKey)) onToggle(cardKey);
                      setEditing(index, true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.7rem' }}
                    title="Edit this qualification"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                )}
                {isEditMode && (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleSave(index)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.7rem' }}
                      title="Save changes"
                    >
                      <Save size={13} /> Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setEditing(index, false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.5rem', color: 'var(--color-text-muted)' }}
                      title="Discard changes"
                    >
                      <X size={13} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => onRemove(index)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8125rem', padding: '0.35rem 0.5rem', color: 'var(--color-danger)' }}
                  title="Remove this qualification"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* ── Expanded Body ── */}
            {isExpanded(cardKey) && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                {/* PREVIEW MODE */}
                {!isEditMode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <PreviewRow label="Qualification Type" value={qualificationType} />
                    <PreviewRow label="Specialisation" value={qualification.specialisation} />
                    <PreviewRow label="Institution / University" value={qualification.institution} />
                    <PreviewRow label="Board / University" value={qualification.university} />
                    <PreviewRow label="Year of Passing" value={qualification.yearofpassing} />
                    <PreviewRow label="Percentage / CGPA" value={qualification.cgpa} />
                    <PreviewRow label="Division" value={qualification.division} />
                    <PreviewRow label="Mode" value={qualification.mode} />
                    <PreviewRow label="Country" value={qualification.country} />
                    <PreviewRow label="State / Province" value={qualification.state} />
                    {certInfo && qualification[certInfo.field] && (
                      <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', alignItems: 'center', marginTop: '0.25rem' }}>
                        <CheckCircle size={14} color="#059669" />
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL || ''}${qualification[certInfo.field]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}
                        >
                          View {certInfo.label}
                        </a>
                      </div>
                    )}
                    {!qualificationType && !qualification.institution && (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', margin: 0 }}>
                        No details added. Click <strong>Edit</strong> to fill in qualification details.
                      </p>
                    )}
                  </div>
                )}

                {/* EDIT MODE */}
                {isEditMode && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <SelectField
                        label="Qualification type"
                        options={qualTypeOptions}
                        value={qualificationType}
                        onChange={(value) => {
                          onUpdate(index, 'educationlevel', value);
                          onUpdate(index, 'degree', value);
                        }}
                        placeholder="Select education level"
                      />

                      <div className="form-group">
                        <label className="form-label">Specialisation</label>
                        <input
                          className="form-input"
                          value={qualification.specialisation}
                          onChange={(e) => onUpdate(index, 'specialisation', e.target.value)}
                          placeholder="e.g. Computer Science"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Institution/University Name</label>
                        <input
                          className="form-input"
                          value={qualification.institution}
                          onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                          placeholder="Institution name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Board/University</label>
                        <input
                          className="form-input"
                          value={qualification.university}
                          onChange={(e) => onUpdate(index, 'university', e.target.value)}
                          placeholder="University name"
                        />
                      </div>

                      <SelectField label="Year of Passing" options={YEAR_OPTIONS} value={qualification.yearofpassing} onChange={(value) => onUpdate(index, 'yearofpassing', value)} placeholder="Select year" />
                      <div className="form-group"><label className="form-label">Percentage/CGPA</label><input className="form-input" value={qualification.cgpa} onChange={(e) => onUpdate(index, 'cgpa', e.target.value)} placeholder="9.38" /></div>
                      <SelectField label="Division" options={DIVISION_OPTIONS} value={qualification.division} onChange={(value) => onUpdate(index, 'division', value)} placeholder="Select division" />
                      <SelectField label="Mode" options={MODE_OPTIONS} value={qualification.mode} onChange={(value) => onUpdate(index, 'mode', value)} placeholder="Select mode" />
                      <SelectField label="Country" options={COUNTRY_OPTIONS} value={qualification.country} onChange={(value) => onUpdate(index, 'country', value)} placeholder="Select country" />
                      <div className="form-group">
                        <label className="form-label">State / Province</label>
                        {qualification.country === 'India' ? (
                          <SelectField
                            label="State / Province"
                            options={INDIAN_STATES}
                            value={qualification.state}
                            onChange={(value) => onUpdate(index, 'state', value)}
                            placeholder="Select State"
                          />
                        ) : (
                          <input
                            className="form-input"
                            value={qualification.state}
                            onChange={(e) => onUpdate(index, 'state', e.target.value)}
                            placeholder="State of institution"
                          />
                        )}
                      </div>
                    </div>

                    {/* Certificate Upload */}
                    <div style={{ marginTop: '1.25rem' }}>
                      {certInfo ? (
                        <div className="space-y-2">
                          <FileField
                            label={`Upload ${certInfo.label}`}
                            name={`${certInfo.field}file`}
                            selectedFile={qualification[certInfo.field] ? ({ name: qualification[certInfo.field].split('/').pop() } as any) : null}
                            onFileSelect={(_, file) => onUploadCertificate(index, certInfo.field, file)}
                          />
                          {qualification[certInfo.field] && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', marginTop: '0.25rem', color: '#059669' }}>
                              <CheckCircle size={14} />
                              <a
                                href={`${import.meta.env.VITE_API_BASE_URL || ''}${qualification[certInfo.field]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}
                              >
                                View uploaded certificate
                              </a>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
                          Please select a valid Qualification Type to enable certificate upload.
                        </div>
                      )}
                    </div>


                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

    </div>
  );
}