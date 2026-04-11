import { Plus, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile, ProfessionalMembership } from './profileBuilderTypes';

type ProfessionalMembershipsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof ProfessionalMembership, value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function ProfessionalMembershipsSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: ProfessionalMembershipsSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Professional Memberships</h3>
        </div>
        
        {(!profile.professionalMemberships || profile.professionalMemberships.length === 0) && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            No professional memberships added yet. Click "Add Professional Membership" to begin.
          </div>
        )}
        
        {(profile.professionalMemberships || []).map((membership, index) => {
          const cardKey = `professionalMemberships-${index}`;
          const summary = [membership.bodyName, membership.membershipType, membership.yearOfJoining].filter(Boolean).join(' · ') || 'Add membership details';

          return (
            <ProfileBuilderSectionCard
              key={cardKey}
              title={membership.bodyName || `Membership ${index + 1}`}
              summary={summary}
              expanded={isExpanded(cardKey)}
              onToggle={() => onToggle(cardKey)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Professional Body / Association Name *</label>
                  <input className="form-input" value={membership.bodyName} onChange={(event) => onUpdate(index, 'bodyName', event.target.value)} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Membership Type (Life / Annual) *</label>
                  <select className="form-input" value={membership.membershipType} onChange={(event) => onUpdate(index, 'membershipType', event.target.value)}>
                    <option value="">Select Type</option>
                    <option value="Life">Life</option>
                    <option value="Annual">Annual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Membership ID</label>
                  <input className="form-input" value={membership.membershipId} onChange={(event) => onUpdate(index, 'membershipId', event.target.value)} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Year of Joining</label>
                  <input className="form-input" type="number" min="1900" max="2099" value={membership.yearOfJoining} onChange={(event) => onUpdate(index, 'yearOfJoining', event.target.value)} placeholder="e.g. 2020" />
                </div>
              </div>
              
              <button className="btn btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => onRemove(index)} type="button">
                <Trash2 size={13} /> Remove Membership
              </button>
            </ProfileBuilderSectionCard>
          );
        })}
        
        <button className="btn btn-secondary" onClick={onAdd} type="button" style={{ alignSelf: 'flex-start' }}>
          <Plus size={14} /> Add Professional Membership
        </button>
      </div>
    </div>
  );
}
