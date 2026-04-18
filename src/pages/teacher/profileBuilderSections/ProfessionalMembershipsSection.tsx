import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile, ProfessionalMembership } from './profileBuilderTypes';

type ProfessionalMembershipsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof ProfessionalMembership, value: string) => void;
  onRemove: (index: number) => void;
  onSave: () => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function ProfessionalMembershipsSection({ profile, onAdd, onUpdate, onRemove, onSave, isExpanded, onToggle }: ProfessionalMembershipsSectionProps) {
  const [editingOriginalIndex, setEditingOriginalIndex] = useState<number | null>(null);
  const [draftMembership, setDraftMembership] = useState<ProfessionalMembership | null>(null);

  const createMembershipDraft = (membership?: ProfessionalMembership): ProfessionalMembership => ({
    bodyName: membership?.bodyName || '',
    membershipType: membership?.membershipType || '',
    membershipId: membership?.membershipId || '',
    yearOfJoining: membership?.yearOfJoining || '',
  });

  const sortedMemberships = (profile.professionalMemberships || [])
    .map((membership, originalIndex) => ({ membership, originalIndex }))
    .sort((a, b) => {
      const aYear = Number.parseInt(a.membership.yearOfJoining || '', 10);
      const bYear = Number.parseInt(b.membership.yearOfJoining || '', 10);
      const safeAYear = Number.isNaN(aYear) ? Number.NEGATIVE_INFINITY : aYear;
      const safeBYear = Number.isNaN(bYear) ? Number.NEGATIVE_INFINITY : bYear;
      return safeBYear - safeAYear;
    });

  const startEditMembership = (originalIndex: number) => {
    const cardKey = `professionalMemberships-${originalIndex}`;
    setEditingOriginalIndex(originalIndex);
    setDraftMembership(createMembershipDraft((profile.professionalMemberships || [])[originalIndex]));

    if (!isExpanded(cardKey)) {
      onToggle(cardKey);
    }
  };

  const cancelEditMembership = () => {
    setEditingOriginalIndex(null);
    setDraftMembership(null);
  };

  const updateDraftMembership = (field: keyof ProfessionalMembership, value: string) => {
    setDraftMembership((current) => {
      if (!current) {
        return current;
      }
      return { ...current, [field]: value };
    });
  };

  const saveMembership = (originalIndex: number) => {
    if (!draftMembership) {
      return;
    }

    onUpdate(originalIndex, 'bodyName', draftMembership.bodyName || '');
    onUpdate(originalIndex, 'membershipType', draftMembership.membershipType || '');
    onUpdate(originalIndex, 'membershipId', draftMembership.membershipId || '');
    onUpdate(originalIndex, 'yearOfJoining', draftMembership.yearOfJoining || '');
    onSave();

    setEditingOriginalIndex(null);
    setDraftMembership(null);
  };

  const handleAddMembership = () => {
    const nextIndex = (profile.professionalMemberships || []).length;
    onAdd();
    setEditingOriginalIndex(nextIndex);
    setDraftMembership(createMembershipDraft());
  };

  const renderDetailValue = (value: string, fallback = 'Not provided') => (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
      {value || fallback}
    </p>
  );

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Professional Memberships</h3>
          <button className="btn btn-secondary" onClick={handleAddMembership} type="button">
            <Plus size={14} /> Add Professional Membership
          </button>
        </div>
        
        {(!profile.professionalMemberships || profile.professionalMemberships.length === 0) && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            No professional memberships added yet. Click "Add Professional Membership" to begin.
          </div>
        )}
        
        {sortedMemberships.map(({ membership, originalIndex }, index) => {
          const cardKey = `professionalMemberships-${originalIndex}`;
          const summary = [membership.bodyName, membership.membershipType, membership.yearOfJoining].filter(Boolean).join(' · ') || 'Add membership details';
          const isEditing = editingOriginalIndex === originalIndex;
          const viewMembership = isEditing && draftMembership ? draftMembership : membership;

          return (
            <ProfileBuilderSectionCard
              key={cardKey}
              title={`Membership ${index + 1}`}
              summary={summary}
              expanded={isExpanded(cardKey)}
              onToggle={() => onToggle(cardKey)}
              actions={(
                <>
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" type="button" onClick={() => saveMembership(originalIndex)} style={{ fontSize: '0.8125rem' }}>
                        <Save size={13} /> Save
                      </button>
                      <button className="btn btn-ghost" type="button" onClick={cancelEditMembership} style={{ fontSize: '0.8125rem' }}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-secondary" type="button" onClick={() => startEditMembership(originalIndex)} style={{ fontSize: '0.8125rem' }}>
                      <Pencil size={13} /> Edit
                    </button>
                  )}
                </>
              )}
            >
              {isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Professional Body / Association Name *</label>
                    <input className="form-input" value={viewMembership.bodyName} onChange={(event) => updateDraftMembership('bodyName', event.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Membership Type (Life / Annual) *</label>
                    <select className="form-input" value={viewMembership.membershipType} onChange={(event) => updateDraftMembership('membershipType', event.target.value)}>
                      <option value="">Select Type</option>
                      <option value="Life">Life</option>
                      <option value="Annual">Annual</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Membership ID</label>
                    <input className="form-input" value={viewMembership.membershipId} onChange={(event) => updateDraftMembership('membershipId', event.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year of Joining</label>
                    <input className="form-input" type="number" min="1900" max="2099" value={viewMembership.yearOfJoining} onChange={(event) => updateDraftMembership('yearOfJoining', event.target.value)} placeholder="e.g. 2020" />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Professional Body / Association Name
                    </p>
                    {renderDetailValue(viewMembership.bodyName, 'No association name added yet')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Membership Type
                      </p>
                      {renderDetailValue(viewMembership.membershipType)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Membership ID
                      </p>
                      {renderDetailValue(viewMembership.membershipId)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Year of Joining
                      </p>
                      {renderDetailValue(viewMembership.yearOfJoining)}
                    </div>
                  </div>
                </div>
              )}

              <button className="btn btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => onRemove(originalIndex)} type="button">
                <Trash2 size={13} /> Remove Membership
              </button>
            </ProfileBuilderSectionCard>
          );
        })}
      </div>
    </div>
  );
}
