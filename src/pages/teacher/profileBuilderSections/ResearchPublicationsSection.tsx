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

const FormField = ({ 
  label, 
  required = false, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode 
}) => (
  <div className="form-group">
    <label className="form-label">
      {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
    </label>
    {children}
  </div>
);

const GridRow = ({ children, columns = 2 }: { children: React.ReactNode; columns?: number }) => (
  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '0.75rem' }}>
    {children}
  </div>
);

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Basic Information */}
              <FormField label="Paper Title / Name" required>
                <input 
                  className="form-input" 
                  value={publication.title} 
                  onChange={(event) => onUpdate(index, 'title', event.target.value)} 
                  placeholder="Enter paper title…" 
                />
              </FormField>

              <FormField label="Authors List (comma-separated)">
                <input 
                  className="form-input" 
                  value={publication.authors} 
                  onChange={(event) => onUpdate(index, 'authors', event.target.value)} 
                  placeholder="e.g. John Doe, Jane Smith…" 
                />
              </FormField>

              {/* Publication Venue */}
              <GridRow>
                <FormField label="Journal / Conference Name">
                  <input 
                    className="form-input" 
                    value={publication.journal} 
                    onChange={(event) => onUpdate(index, 'journal', event.target.value)} 
                    placeholder="Nature, ICML…" 
                  />
                </FormField>
                <FormField label="Organisation / Publisher">
                  <input 
                    className="form-input" 
                    value={publication.organisation} 
                    onChange={(event) => onUpdate(index, 'organisation', event.target.value)} 
                    placeholder="e.g. IEEE, Springer…" 
                  />
                </FormField>
              </GridRow>

              {/* Publication Details */}
              <GridRow columns={3}>
                <FormField label="Year of Publication" required>
                  <input 
                    className="form-input" 
                    value={publication.year} 
                    onChange={(event) => onUpdate(index, 'year', event.target.value)} 
                    placeholder="2023" 
                  />
                </FormField>
                <FormField label="Month (Optional)">
                  <input 
                    className="form-input" 
                    value={publication.month} 
                    onChange={(event) => onUpdate(index, 'month', event.target.value)} 
                    placeholder="June" 
                  />
                </FormField>
                <FormField label="DOI" required>
                  <input 
                    className="form-input" 
                    value={publication.doi} 
                    onChange={(event) => onUpdate(index, 'doi', event.target.value)} 
                    placeholder="10.1000/xyz123" 
                  />
                </FormField>
              </GridRow>

              {/* Additional Details */}
              <GridRow columns={3}>
                <FormField label="Volume (Optional)">
                  <input 
                    className="form-input" 
                    value={publication.volume} 
                    onChange={(event) => onUpdate(index, 'volume', event.target.value)} 
                    placeholder="Vol 12" 
                  />
                </FormField>
                <FormField label="Issue (Optional)">
                  <input 
                    className="form-input" 
                    value={publication.issue} 
                    onChange={(event) => onUpdate(index, 'issue', event.target.value)} 
                    placeholder="Issue 4" 
                  />
                </FormField>
                <FormField label="Page Numbers (Optional)">
                  <input 
                    className="form-input" 
                    value={publication.pages} 
                    onChange={(event) => onUpdate(index, 'pages', event.target.value)} 
                    placeholder="e.g. 123-145" 
                  />
                </FormField>
              </GridRow>

              {/* Publication URL */}
              <FormField label="Publication URL" required>
                <input 
                  className="form-input" 
                  type="url" 
                  value={publication.url} 
                  onChange={(event) => onUpdate(index, 'url', event.target.value)} 
                  placeholder="https://…" 
                />
              </FormField>

              {/* Remove Button */}
              <button 
                className="btn btn-ghost" 
                style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} 
                onClick={() => onRemove(index)} 
                type="button"
              >
                <Trash2 size={13} /> Remove Publication
              </button>
            </div>
          </ProfileBuilderSectionCard>
        );
      })}
      
      <button className="btn btn-secondary" onClick={onAdd} type="button">
        <Plus size={14} /> Add Publication
      </button>
    </div>
  );
}
