import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type ResearchProjectsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['projects'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function ResearchProjectsSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: ResearchProjectsSectionProps) {
  return (
    <div>
      {profile.projects.map((project, index) => {
        const cardKey = `projects-${index}`;
        const summary = [project.title, project.year].filter(Boolean).join(' · ') || 'Add project details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={project.title || `Project ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Project Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input className="form-input" value={project.title} onChange={(event) => onUpdate(index, 'title', event.target.value)} placeholder="Research project title…" />
              </div>
              <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={project.description} onChange={(event) => onUpdate(index, 'description', event.target.value)} placeholder="Brief project summary…" style={{ minHeight: 80 }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Year <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={project.year} onChange={(event) => onUpdate(index, 'year', event.target.value)} placeholder="2022-2023" /></div>
                <div className="form-group"><label className="form-label">Project URL <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" type="url" value={project.url} onChange={(event) => onUpdate(index, 'url', event.target.value)} placeholder="https://…" /></div>
              </div>
              <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Project</button>
            </div>
          </ProfileBuilderSectionCard>
        );
      })}
      <button className="btn btn-secondary" onClick={onAdd} type="button"><Plus size={14} /> Add Project</button>
    </div>
  );
}
