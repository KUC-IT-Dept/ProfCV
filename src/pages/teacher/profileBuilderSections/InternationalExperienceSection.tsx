import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type Props = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['internationalExperiences'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

type ExperienceDraft = {
  countryVisited: string;
  purpose: string;
  institutionName: string;
  duration: string;
  fundingSource: string;
};

const EXP_FIELDS: Array<keyof ExperienceDraft> = [
  'countryVisited',
  'purpose',
  'institutionName',
  'duration',
  'fundingSource',
];

const createExperienceDraft = (exp?: any): ExperienceDraft => {
  const expData = (exp || {}) as Record<string, string>;

  return {
    countryVisited: expData.countryVisited || '',
    purpose: expData.purpose || '',
    institutionName: expData.institutionName || '',
    duration: expData.duration || '',
    fundingSource: expData.fundingSource || '',
  };
};

export default function InternationalExperienceSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: Props) {
  const experiences = profile.internationalExperiences || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftExperience, setDraftExperience] = useState<ExperienceDraft | null>(null);

  const startEditExperience = (index: number) => {
    const cardKey = `internationalExperiences-${index}`;

    setEditingIndex(index);
    setDraftExperience(createExperienceDraft(experiences[index]));

    if (!isExpanded(cardKey)) {
      onToggle(cardKey);
    }
  };

  const cancelEditExperience = () => {
    setEditingIndex(null);
    setDraftExperience(null);
  };

  const updateDraftExperience = (field: keyof ExperienceDraft, value: string) => {
    setDraftExperience((current) => {
      if (!current) {
        return current;
      }
      return { ...current, [field]: value };
    });
  };

  const saveExperience = (index: number) => {
    if (!draftExperience) {
      return;
    }

    EXP_FIELDS.forEach((field) => {
      onUpdate(index, field as keyof Profile['internationalExperiences'][number], draftExperience[field]);
    });

    setEditingIndex(null);
    setDraftExperience(null);
  };

  const handleAddExperience = () => {
    const nextIndex = experiences.length;

    onAdd();
    setEditingIndex(nextIndex);
    setDraftExperience(createExperienceDraft());
  };

  const handleRemoveExperience = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftExperience(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    onRemove(index);
  };

  const renderDetailValue = (value: string, fallback = 'Not provided') => (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
      {value || fallback}
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>International Experience</h3>
        <button className="btn btn-secondary" onClick={handleAddExperience} type="button"><Plus size={14} /> Add International Experience</button>
      </div>

      {experiences.length === 0 && (
        <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          No international experiences added yet.
        </div>
      )}

      {experiences.map((exp: any, index: number) => {
        const cardKey = `internationalExperiences-${index}`;
        const isEditing = editingIndex === index;
        const viewExperience = isEditing && draftExperience ? draftExperience : createExperienceDraft(exp);

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={exp.countryVisited || `Experience ${index + 1}`}
            summary=""
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
            actions={(
              <>
                {isEditing ? (
                  <>
                    <button className="btn btn-secondary" type="button" onClick={() => saveExperience(index)}>
                      <Save size={14} />
                      Save
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={cancelEditExperience}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" type="button" onClick={() => startEditExperience(index)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

                <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => handleRemoveExperience(index)} type="button">
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          >
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Country Visited <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <input className="form-input" value={viewExperience.countryVisited} onChange={(event) => updateDraftExperience('countryVisited', event.target.value)} placeholder="Country name..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Purpose</label>
                  <select className="form-select" value={viewExperience.purpose} onChange={(event) => updateDraftExperience('purpose', event.target.value)}>
                    <option value="">Select Purpose</option>
                    <option value="Conference">Conference</option>
                    <option value="Research">Research</option>
                    <option value="Collaboration">Collaboration</option>
                    <option value="Teaching">Teaching</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Institution Name</label>
                  <input className="form-input" value={viewExperience.institutionName} onChange={(event) => updateDraftExperience('institutionName', event.target.value)} placeholder="Name of the institution..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input className="form-input" value={viewExperience.duration} onChange={(event) => updateDraftExperience('duration', event.target.value)} placeholder="e.g. 2 weeks, 1 month, etc." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Funding Source</label>
                    <input className="form-input" value={viewExperience.fundingSource} onChange={(event) => updateDraftExperience('fundingSource', event.target.value)} placeholder="e.g. Self, University, Grant..." />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Country Visited
                  </p>
                  {renderDetailValue(viewExperience.countryVisited, 'No country added yet')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Purpose
                    </p>
                    {renderDetailValue(viewExperience.purpose)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Institution Name
                    </p>
                    {renderDetailValue(viewExperience.institutionName)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Duration
                    </p>
                    {renderDetailValue(viewExperience.duration)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Funding Source
                    </p>
                    {renderDetailValue(viewExperience.fundingSource)}
                  </div>
                </div>
              </div>
            )}
          </ProfileBuilderSectionCard>
        );
      })}
    </div>
  );
}
