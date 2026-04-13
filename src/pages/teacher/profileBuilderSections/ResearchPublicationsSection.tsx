import { Plus, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type ResearchPublicationsSectionProps = {
  profile: Profile;
  onAdd: (type?: Profile['publications'][number]['publicationType']) => void;
  onUpdate: (index: number, field: keyof Profile['publications'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function ResearchPublicationsSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: ResearchPublicationsSectionProps) {
  const PUBLICATION_TYPES = [
    'Journal Articles',
    'Book Chapters',
    'Books Authored / Edited',
    'Conference Papers'
  ] as const;

  const renderPublicationForm = (publication: Profile['publications'][number], index: number) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label">Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
          <input className="form-input" value={publication.title} onChange={(event) => onUpdate(index, 'title', event.target.value)} placeholder="Enter title…" />
        </div>
        <div className="form-group">
          <label className="form-label">Authors List (comma-separated)</label>
          <input className="form-input" value={publication.authors} onChange={(event) => onUpdate(index, 'authors', event.target.value)} placeholder="e.g. John Doe, Jane Smith…" />
        </div>

        {/* Journal-Specific Fields */}
        {publication.publicationType === 'Journal Articles' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Journal Name</label>
                <input className="form-input" value={publication.journal} onChange={(event) => onUpdate(index, 'journal', event.target.value)} placeholder="Nature, Science..." />
              </div>
              <div className="form-group">
                <label className="form-label">ISSN</label>
                <input className="form-input" value={publication.issn} onChange={(event) => onUpdate(index, 'issn', event.target.value)} placeholder="e.g. 1234-5678" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Impact Factor</label>
                <input className="form-input" value={publication.impactFactor} onChange={(event) => onUpdate(index, 'impactFactor', event.target.value)} placeholder="e.g. 4.5" />
              </div>
              <div className="form-group">
                <label className="form-label">Indexed In (comma-separated)</label>
                <input className="form-input" value={publication.indexedIn} onChange={(event) => onUpdate(index, 'indexedIn', event.target.value)} placeholder="Scopus, Web of Science..." />
              </div>
            </div>
          </>
        )}

        {/* Book-Specific Fields */}
        {(publication.publicationType === 'Book Chapters' || publication.publicationType === 'Books Authored / Edited') && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">{publication.publicationType === 'Book Chapters' ? 'Book Title' : 'Series Title (if any)'}</label>
                <input className="form-input" value={publication.bookTitle} onChange={(event) => onUpdate(index, 'bookTitle', event.target.value)} placeholder="Enter book title…" />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input className="form-input" value={publication.isbn} onChange={(event) => onUpdate(index, 'isbn', event.target.value)} placeholder="e.g. 978-3-16-148410-0" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Publisher</label>
                <input className="form-input" value={publication.publisher} onChange={(event) => onUpdate(index, 'publisher', event.target.value)} placeholder="e.g. Springer, Wiley..." />
              </div>
              <div className="form-group">
                <label className="form-label">Editors</label>
                <input className="form-input" value={publication.editors} onChange={(event) => onUpdate(index, 'editors', event.target.value)} placeholder="Enter editors…" />
              </div>
            </div>
          </>
        )}

        {/* Conference-Specific Fields */}
        {publication.publicationType === 'Conference Papers' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Conference Name</label>
                <input className="form-input" value={publication.conferenceName} onChange={(event) => onUpdate(index, 'conferenceName', event.target.value)} placeholder="e.g. ICML 2023..." />
              </div>
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input className="form-input" value={publication.venueDate} onChange={(event) => onUpdate(index, 'venueDate', event.target.value)} placeholder="e.g. Honolulu, Hawaii..." />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Organized By</label>
                <input className="form-input" value={publication.organizedBy} onChange={(event) => onUpdate(index, 'organizedBy', event.target.value)} placeholder="e.g. ACM, IEEE..." />
              </div>
              <div className="form-group">
                <label className="form-label">National / International</label>
                <select
                  className="form-input"
                  value={publication.nationalInternational}
                  onChange={(event) => onUpdate(index, 'nationalInternational', event.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group"><label className="form-label">Year <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.year} onChange={(event) => onUpdate(index, 'year', event.target.value)} placeholder="2023" /></div>
          <div className="form-group"><label className="form-label">Month</label><input className="form-input" value={publication.month} onChange={(event) => onUpdate(index, 'month', event.target.value)} placeholder="June" /></div>
          <div className="form-group"><label className="form-label">DOI <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.doi} onChange={(event) => onUpdate(index, 'doi', event.target.value)} placeholder="10.1000/xyz123" /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group"><label className="form-label">Volume</label><input className="form-input" value={publication.volume} onChange={(event) => onUpdate(index, 'volume', event.target.value)} placeholder="Vol 12" /></div>
          <div className="form-group"><label className="form-label">Issue</label><input className="form-input" value={publication.issue} onChange={(event) => onUpdate(index, 'issue', event.target.value)} placeholder="Issue 4" /></div>
          <div className="form-group"><label className="form-label">Page Numbers</label><input className="form-input" value={publication.pages} onChange={(event) => onUpdate(index, 'pages', event.target.value)} placeholder="e.g. 123-145" /></div>
        </div>

        <div className="form-group">
          <label className="form-label">Publication URL <span style={{ color: 'var(--color-danger)' }}>*</span></label>
          <input className="form-input" type="url" value={publication.url} onChange={(event) => onUpdate(index, 'url', event.target.value)} placeholder="https://…" />
        </div>
        <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Publication</button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {PUBLICATION_TYPES.map((type) => {
        const typePubs = profile.publications
          .map((p, i) => ({ ...p, originalIndex: i }))
          .filter((p) => p.publicationType === type);

        return (
          <div key={type} className="publication-type-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--color-primary-light)' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)' }}>{type}</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onAdd(type)}
                type="button"
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem' }}
              >
                <Plus size={14} /> Add {type.slice(0, -1)}
              </button>
            </div>

            {typePubs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                No {type.toLowerCase()} added yet.
              </div>
            ) : (
              <div className="space-y-4" style={{ marginBottom: '1.5rem' }}>
                {typePubs.map((publication) => {
                  const cardKey = `publications-${publication.originalIndex}`;
                  const summary = [
                    publication.title,
                    publication.year,
                    publication.journal || publication.bookTitle || publication.conferenceName
                  ].filter(Boolean).join(' · ') || 'Add details';

                  return (
                    <ProfileBuilderSectionCard
                      key={cardKey}
                      title={publication.title || `Publication ${publication.originalIndex + 1}`}
                      summary={summary}
                      expanded={isExpanded(cardKey)}
                      onToggle={() => onToggle(cardKey)}
                    >
                      {renderPublicationForm(publication, publication.originalIndex)}
                    </ProfileBuilderSectionCard>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
