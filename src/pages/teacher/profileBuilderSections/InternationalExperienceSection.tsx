import { Plus, Trash2 } from 'lucide-react';
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

export default function InternationalExperienceSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: Props) {
  return (
    <div>
      {profile.internationalExperiences.map((exp, index) => {
        const cardKey = `internationalExperiences-${index}`;
        const summary = [exp.countryVisited, exp.institutionName, exp.duration].filter(Boolean).join(' · ') || 'Add international experience details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={exp.countryVisited || `Experience ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Country Visited <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input className="form-input" value={exp.countryVisited} onChange={(event) => onUpdate(index, 'countryVisited', event.target.value)} placeholder="Country name..." />
              </div>
              <div className="form-group">
                <label className="form-label">Purpose</label>
                <select className="form-select" value={exp.purpose} onChange={(event) => onUpdate(index, 'purpose', event.target.value)}>
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
                <input className="form-input" value={exp.institutionName} onChange={(event) => onUpdate(index, 'institutionName', event.target.value)} placeholder="Name of the institution..." />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input className="form-input" value={exp.duration} onChange={(event) => onUpdate(index, 'duration', event.target.value)} placeholder="e.g. 2 weeks, 1 month, etc." />
              </div>
              <div className="form-group">
                <label className="form-label">Funding Source</label>
                <input className="form-input" value={exp.fundingSource} onChange={(event) => onUpdate(index, 'fundingSource', event.target.value)} placeholder="e.g. Self, University, Grant..." />
              </div>
              <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Experience</button>
            </div>
          </ProfileBuilderSectionCard>
        );
      })}

      <button className="btn btn-secondary" onClick={onAdd} type="button"><Plus size={14} /> Add International Experience</button>
    </div>
  );
}
