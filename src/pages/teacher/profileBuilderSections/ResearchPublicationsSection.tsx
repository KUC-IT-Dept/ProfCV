import { useState } from 'react';
import { Plus, Trash2, ChevronDown, Search, FileText, Link, CheckCircle, Edit, Save, Trash } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile, Publication } from './profileBuilderTypes';

type ResearchPublicationsSectionProps = {
  profile: Profile;
  onAdd: (payload: Profile['publications'][number]['publicationType'] | Profile['publications'][number]) => void;
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

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [addingData, setAddingData] = useState<Partial<Profile['publications'][number]>>({});

  const handleUpdate = (index: number, field: keyof Profile['publications'][number], value: string) => {
    if (index === -1) {
      setAddingData(prev => ({ ...prev, [field]: value } as any));
    } else {
      onUpdate(index, field, value);
    }
  };

  // Beta feature states mapping for indices
  const [aiLink, setAiLink] = useState<{ [key: number]: string }>({});
  const [aiLoading, setAiLoading] = useState<{ [key: number]: boolean }>({});
  const [aiSuccess, setAiSuccess] = useState<{ [key: number]: boolean }>({});

  const handleAiAutofill = (index: number) => {
    const link = aiLink[index];
    if (!link) return;
    setAiLoading(prev => ({ ...prev, [index]: true }));
    
    // Simulate AI fetch
    setTimeout(() => {
      setAiLoading(prev => ({ ...prev, [index]: false }));
      setAiSuccess(prev => ({ ...prev, [index]: true }));
      handleUpdate(index, 'title', 'Attentiveness and Engagement in Deep Learning');
      handleUpdate(index, 'authors', 'John Doe, Alan Turing');
      handleUpdate(index, 'year', '2024');
      handleUpdate(index, 'url', link);
      
      setTimeout(() => {
        setAiSuccess(prev => ({ ...prev, [index]: false }));
      }, 3000);
    }, 1500);
  };

  const renderReadOnlyView = (publication: Profile['publications'][number]) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
        <div><strong>Title:</strong> {publication.title || '-'}</div>
        <div><strong>Authors:</strong> {publication.authors || '-'}</div>
        <div><strong>Type:</strong> <span style={{ padding: '0.1rem 0.5rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>{publication.publicationType}</span></div>
        <div><strong>Year:</strong> {publication.year || '-'}</div>
        
        {publication.publicationType === 'Journal Articles' && (
          <>
            <div><strong>Journal Name:</strong> {publication.journal || '-'}</div>
            <div><strong>ISSN:</strong> {publication.issn || '-'} <span><strong>Impact Factor:</strong> {publication.impactFactor || '-'}</span></div>
          </>
        )}
        
        {(publication.publicationType === 'Book Chapters' || publication.publicationType === 'Books Authored / Edited') && (
          <>
            <div><strong>{publication.publicationType === 'Book Chapters' ? 'Book Title' : 'Series Title'}:</strong> {publication.bookTitle || '-'}</div>
            <div><strong>Publisher:</strong> {publication.publisher || '-'}</div>
            <div><strong>ISBN:</strong> {publication.isbn || '-'}</div>
          </>
        )}

        {publication.publicationType === 'Conference Papers' && (
          <>
            <div><strong>Conference Name:</strong> {publication.conferenceName || '-'}</div>
            <div><strong>Venue:</strong> {publication.venueDate || '-'}</div>
            <div><strong>Level:</strong> {publication.nationalInternational || '-'}</div>
          </>
        )}

        <div><strong>DOI:</strong> {publication.doi || '-'}</div>
        {publication.url && <div><strong>URL:</strong> <a href={publication.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{publication.url}</a></div>}
      </div>
    );
  };

  const renderPublicationForm = (publication: Profile['publications'][number], index: number) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {/* Beta AI feature */}
        <div style={{ padding: '1rem', background: 'var(--color-bg)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            <Link size={16} /> Beta AI Autofill 
            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: '12px' }}>New</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Paste a link or DOI to automatically fill the form.</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              className="form-input" 
              placeholder="e.g. https://doi.org/10.1000/xyz123" 
              value={aiLink[index] || ''} 
              onChange={(e) => setAiLink(prev => ({ ...prev, [index]: e.target.value }))}
              style={{ flex: 1 }}
            />
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={() => handleAiAutofill(index)}
              disabled={aiLoading[index]}
            >
              {aiLoading[index] ? 'Fetching...' : aiSuccess[index] ? <CheckCircle size={16} /> : 'Autofill'}
            </button>
          </div>
        </div>

        <div style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>OR FILL MANUALLY</div>

        <div className="form-group">
          <label className="form-label">Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
          <input className="form-input" value={publication.title || ''} onChange={(event) => handleUpdate(index, 'title', event.target.value)} placeholder="Enter title…" />
        </div>
        <div className="form-group">
          <label className="form-label">Authors List (comma-separated)</label>
          <input className="form-input" value={publication.authors || ''} onChange={(event) => handleUpdate(index, 'authors', event.target.value)} placeholder="e.g. John Doe, Jane Smith…" />
        </div>

        {/* Journal-Specific Fields */}
        {publication.publicationType === 'Journal Articles' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Journal Name</label>
                <input className="form-input" value={publication.journal || ''} onChange={(event) => handleUpdate(index, 'journal', event.target.value)} placeholder="Nature, Science..." />
              </div>
              <div className="form-group">
                <label className="form-label">ISSN</label>
                <input className="form-input" value={publication.issn || ''} onChange={(event) => handleUpdate(index, 'issn', event.target.value)} placeholder="e.g. 1234-5678" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Impact Factor</label>
                <input className="form-input" value={publication.impactFactor || ''} onChange={(event) => handleUpdate(index, 'impactFactor', event.target.value)} placeholder="e.g. 4.5" />
              </div>
              <div className="form-group">
                <label className="form-label">Indexed In (comma-separated)</label>
                <input className="form-input" value={publication.indexedIn || ''} onChange={(event) => handleUpdate(index, 'indexedIn', event.target.value)} placeholder="Scopus, Web of Science..." />
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
                <input className="form-input" value={publication.bookTitle || ''} onChange={(event) => handleUpdate(index, 'bookTitle', event.target.value)} placeholder="Enter book title…" />
              </div>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input className="form-input" value={publication.isbn || ''} onChange={(event) => handleUpdate(index, 'isbn', event.target.value)} placeholder="e.g. 978-3-16-148410-0" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Publisher</label>
                <input className="form-input" value={publication.publisher || ''} onChange={(event) => handleUpdate(index, 'publisher', event.target.value)} placeholder="e.g. Springer, Wiley..." />
              </div>
              <div className="form-group">
                <label className="form-label">Editors</label>
                <input className="form-input" value={publication.editors || ''} onChange={(event) => handleUpdate(index, 'editors', event.target.value)} placeholder="Enter editors…" />
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
                <input className="form-input" value={publication.conferenceName || ''} onChange={(event) => handleUpdate(index, 'conferenceName', event.target.value)} placeholder="e.g. ICML 2023..." />
              </div>
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input className="form-input" value={publication.venueDate || ''} onChange={(event) => handleUpdate(index, 'venueDate', event.target.value)} placeholder="e.g. Honolulu, Hawaii..." />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Organized By</label>
                <input className="form-input" value={publication.organizedBy || ''} onChange={(event) => handleUpdate(index, 'organizedBy', event.target.value)} placeholder="e.g. ACM, IEEE..." />
              </div>
              <div className="form-group">
                <label className="form-label">National / International</label>
                <select
                  className="form-input"
                  value={publication.nationalInternational || ''}
                  onChange={(event) => handleUpdate(index, 'nationalInternational', event.target.value)}
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
          <div className="form-group"><label className="form-label">Year <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.year || ''} onChange={(event) => handleUpdate(index, 'year', event.target.value)} placeholder="2023" /></div>
          <div className="form-group"><label className="form-label">Month</label><input className="form-input" value={publication.month || ''} onChange={(event) => handleUpdate(index, 'month', event.target.value)} placeholder="June" /></div>
          <div className="form-group"><label className="form-label">DOI <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={publication.doi || ''} onChange={(event) => handleUpdate(index, 'doi', event.target.value)} placeholder="10.1000/xyz123" /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group"><label className="form-label">Volume</label><input className="form-input" value={publication.volume || ''} onChange={(event) => handleUpdate(index, 'volume', event.target.value)} placeholder="Vol 12" /></div>
          <div className="form-group"><label className="form-label">Issue</label><input className="form-input" value={publication.issue || ''} onChange={(event) => handleUpdate(index, 'issue', event.target.value)} placeholder="Issue 4" /></div>
          <div className="form-group"><label className="form-label">Page Numbers</label><input className="form-input" value={publication.pages || ''} onChange={(event) => handleUpdate(index, 'pages', event.target.value)} placeholder="e.g. 123-145" /></div>
        </div>

        <div className="form-group">
          <label className="form-label">Publication URL <span style={{ color: 'var(--color-danger)' }}>*</span></label>
          <input className="form-input" type="url" value={publication.url || ''} onChange={(event) => handleUpdate(index, 'url', event.target.value)} placeholder="https://…" />
        </div>
      </div>
    );
  };

  const filteredPublications = profile.publications
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter(p => {
      if (!searchQuery) return true;
      const lowerQuery = searchQuery.toLowerCase();
      return (
        p.title?.toLowerCase().includes(lowerQuery) ||
        p.authors?.toLowerCase().includes(lowerQuery) ||
        p.journal?.toLowerCase().includes(lowerQuery) ||
        p.bookTitle?.toLowerCase().includes(lowerQuery) ||
        p.conferenceName?.toLowerCase().includes(lowerQuery) ||
        p.publicationType?.toLowerCase().includes(lowerQuery)
      );
    });

  const handleAddNew = (type: Profile['publications'][number]['publicationType']) => {
    setShowDropdown(false);
    setIsAdding(true);
    setAddingData({
      publicationType: type,
      title: '',
      authors: '',
      journal: '',
      organisation: '',
      year: '',
      volume: '',
      issue: '',
      month: '',
      pages: '',
      doi: '',
      url: ''
    });
  };

  return (
    <div className="space-y-6">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search publications..." 
            className="form-input" 
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 20 }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowDropdown(!showDropdown)}
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Publication <ChevronDown size={14} />
          </button>
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              minWidth: '200px',
              padding: '0.5rem 0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {PUBLICATION_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => handleAddNew(type)}
                  type="button"
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    width: '100%'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <ProfileBuilderSectionCard
          title={addingData.title || `New ${addingData.publicationType}`}
          summary="Add details and click Add to save"
          expanded={true}
          onToggle={() => {}}
          actions={
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem', color: 'var(--color-danger)' }} onClick={() => setIsAdding(false)} type="button">
                <Trash size={14} /> <span style={{ fontSize: '0.8rem' }}>Cancel</span>
              </button>
              <button className="btn " style={{ padding: '0.4rem 0.6rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }} onClick={() => {
                onAdd(addingData as Profile['publications'][number]);
                setIsAdding(false);
              }} type="button">
                <Save size={14} /> <span style={{ fontSize: '0.8rem' }}>Add</span>
              </button>
            </div>
          }
        >
          {renderPublicationForm(addingData as any, -1)}
        </ProfileBuilderSectionCard>
      )}

      {filteredPublications.length === 0 && !isAdding ? (
        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          {searchQuery ? 'No publications found matching your search.' : 'No publications added yet.'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPublications.map((publication) => {
            const cardKey = `publications-${publication.originalIndex}`;
            const summary = [
              publication.publicationType,
              publication.year,
              publication.journal || publication.bookTitle || publication.conferenceName
            ].filter(Boolean).join(' · ');

            const isEditing = editingIndex === publication.originalIndex;

            const actions = isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem', color: 'var(--color-danger)' }} onClick={() => onRemove(publication.originalIndex)} type="button">
                  <Trash size={14} /> <span style={{ fontSize: '0.8rem' }}>Delete</span>
                </button>
                <button className="btn " style={{ padding: '0.4rem 0.6rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }} onClick={() => setEditingIndex(null)} type="button">
                  <Save size={14} /> <span style={{ fontSize: '0.8rem' }}>Save</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem', color: 'var(--color-danger)' }} onClick={(e) => { e.stopPropagation(); onRemove(publication.originalIndex); }} type="button">
                  <Trash size={14} />
                </button>
                <button className="btn btn-ghost" style={{ padding: '0.4rem 0.6rem' }} onClick={(e) => { 
                  e.stopPropagation(); 
                  setEditingIndex(publication.originalIndex); 
                  if (!isExpanded(cardKey)) onToggle(cardKey);
                }} type="button">
                  <Edit size={14} /> <span style={{ fontSize: '0.8rem' }}>Edit</span>
                </button>
              </div>
            );

            return (
              <ProfileBuilderSectionCard
                key={cardKey}
                title={publication.title || `Untitled ${publication.publicationType}`}
                summary={summary}
                expanded={isExpanded(cardKey)}
                onToggle={() => {
                  onToggle(cardKey);
                  if (isExpanded(cardKey) && editingIndex === publication.originalIndex) {
                    setEditingIndex(null); // Close edit mode if collapsing
                  }
                }}
                actions={actions}
              >
                {isEditing ? renderPublicationForm(publication, publication.originalIndex) : renderReadOnlyView(publication)}
              </ProfileBuilderSectionCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
