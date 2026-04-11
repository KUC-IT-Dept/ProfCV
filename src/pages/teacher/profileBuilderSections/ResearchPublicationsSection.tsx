import { Plus, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type ResearchPublicationsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['publications'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function ResearchPublicationsSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: ResearchPublicationsSectionProps) {
  return (
    <div>
      {profile.publications.map((publication, index) => {
        const cardKey = `publications-${index}`;
        const summary = [publication.title, publication.year, publication.journal].filter(Boolean).join(' · ') || 'Add publication details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={publication.title || `Publication ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Paper Title / Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input className="form-input" value={publication.title} onChange={(event) => onUpdate(index, 'title', event.target.value)} placeholder="Enter paper title…" />
              </div>
              <div className="form-group">
                <label className="form-label">Authors List (comma-separated)</label>
                <input className="form-input" value={publication.authors} onChange={(event) => onUpdate(index, 'authors', event.target.value)} placeholder="e.g. John Doe, Jane Smith…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Journal / Conference Name</label><input className="form-input" value={publication.journal} onChange={(event) => onUpdate(index, 'journal', event.target.value)} placeholder="Nature, ICML…" /></div>
                <div className="form-group"><label className="form-label">Organisation / Publisher</label><input className="form-input" value={publication.organisation} onChange={(event) => onUpdate(index, 'organisation', event.target.value)} placeholder="e.g. IEEE, Springer…" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Year of Publication <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.year} onChange={(event) => onUpdate(index, 'year', event.target.value)} placeholder="2023" /></div>
                <div className="form-group"><label className="form-label">Month (Optional)</label><input className="form-input" value={publication.month} onChange={(event) => onUpdate(index, 'month', event.target.value)} placeholder="June" /></div>
                <div className="form-group"><label className="form-label">DOI <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.doi} onChange={(event) => onUpdate(index, 'doi', event.target.value)} placeholder="10.1000/xyz123" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Volume (Optional)</label><input className="form-input" value={publication.volume} onChange={(event) => onUpdate(index, 'volume', event.target.value)} placeholder="Vol 12" /></div>
                <div className="form-group"><label className="form-label">Issue (Optional)</label><input className="form-input" value={publication.issue} onChange={(event) => onUpdate(index, 'issue', event.target.value)} placeholder="Issue 4" /></div>
                <div className="form-group"><label className="form-label">Page Numbers (Optional)</label><input className="form-input" value={publication.pages} onChange={(event) => onUpdate(index, 'pages', event.target.value)} placeholder="e.g. 123-145" /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Publication URL <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input className="form-input" type="url" value={publication.url} onChange={(event) => onUpdate(index, 'url', event.target.value)} placeholder="https://…" />
              </div>
              <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Publication</button>
            </div>
          </ProfileBuilderSectionCard>
        );
      })}
      <button className="btn btn-secondary" onClick={onAdd} type="button"><Plus size={14} /> Add Publication</button>
    </div>
  );
}
