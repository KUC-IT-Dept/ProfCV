import React, { useEffect, useState } from 'react';
import { Printer, Eye } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CVExport.module.css';

type Profile = any;

const TEMPLATES = [
  { value: 'classic', label: 'Classic Academic' },
  { value: 'modern', label: 'Modern Professional' },
  { value: 'compact', label: 'Compact Summary' },
];

const SECTIONS = [
  { key: 'bio', label: 'Biography / Headline' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'publications', label: 'Publications' },
  { key: 'projects', label: 'Research Projects' },
  { key: 'subjects', label: 'Subjects Taught' },
  { key: 'customDetails', label: 'Custom Sections' },
  { key: 'media', label: 'Media & Attachments' },
];

// ── Shared CV content (rendered in preview + hidden print wrapper) ────────────
function CVContent({
  user, profile, selectedSections,
}: {
  user: any;
  profile: any;
  selectedSections: Record<string, boolean>;
}) {
  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid #1D4ED8', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.625rem', color: '#0F172A', marginBottom: '0.25rem' }}>{user?.name}</h1>
        {selectedSections.bio && profile.headline && (
          <div className="cv-meta" style={{ color: '#64748B', fontSize: '0.9rem' }}>{profile.headline}</div>
        )}
        <div className="cv-meta" style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.25rem' }}>
          {user?.email} · {user?.department}
        </div>
      </div>

      {selectedSections.bio && profile.bio && (
        <div className="cv-section">
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Biography</h2>
          <p style={{ color: '#0F172A', lineHeight: 1.7 }}>{profile.bio}</p>
        </div>
      )}

      {selectedSections.qualifications && profile.qualifications?.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Qualifications</h2>
          {profile.qualifications.map((q: any, i: number) => (
            <div key={i} className="cv-entry" style={{ marginBottom: '0.5rem', paddingLeft: '0.75rem', borderLeft: '2px solid #BFDBFE' }}>
              <strong>{q.degree}</strong> — {q.institution}
              {q.year && <span style={{ color: '#64748B' }}> · {q.year}</span>}
              {q.grade && <span style={{ color: '#64748B' }}> · {q.grade}</span>}
            </div>
          ))}
        </div>
      )}

      {selectedSections.publications && profile.publications?.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Publications</h2>
          {profile.publications.map((p: any, i: number) => (
            <div key={i} className="cv-entry" style={{ marginBottom: '0.5rem', paddingLeft: '0.75rem', borderLeft: '2px solid #BFDBFE' }}>
              <strong>{p.title}</strong>
              {p.journal && <span style={{ color: '#64748B' }}> — {p.journal}</span>}
              {p.year && <span style={{ color: '#64748B' }}> ({p.year})</span>}
              {p.doi && <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>DOI: {p.doi}</div>}
            </div>
          ))}
        </div>
      )}

      {selectedSections.projects && profile.projects?.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Research Projects</h2>
          {profile.projects.map((p: any, i: number) => (
            <div key={i} className="cv-entry" style={{ marginBottom: '0.5rem', paddingLeft: '0.75rem', borderLeft: '2px solid #BFDBFE' }}>
              <strong>{p.title}</strong>{p.year && <span style={{ color: '#64748B' }}> ({p.year})</span>}
              {p.description && <div style={{ fontSize: '0.875rem', color: '#374151', marginTop: '2px' }}>{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      {selectedSections.subjects && profile.subjects?.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Subjects Taught</h2>
          <p style={{ color: '#0F172A' }}>{profile.subjects.join(' · ')}</p>
        </div>
      )}

      {selectedSections.customDetails && profile.customDetails?.map((c: any, i: number) => (
        <div key={i} className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>{c.sectionTitle}</h2>
          <p style={{ color: '#0F172A', whiteSpace: 'pre-wrap' }}>{c.content}</p>
        </div>
      ))}

      {selectedSections.media && profile.media?.attachments?.length > 0 && (
        <div className="cv-section" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Attachments</h2>
          {profile.media.attachments.map((a: any, i: number) => (
            <div key={i} style={{ fontSize: '0.875rem', color: '#64748B' }}>📄 {a.name} ({a.sizeKB} KB)</div>
          ))}
        </div>
      )}
    </>
  );
}

export default function CVExportPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.key, true]))
  );
  const [template, setTemplate] = useState('classic');
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    api.get('/profile/me').then((r) => setProfile(r.data)).catch(() => { });
  }, []);

  const toggleSection = (key: string) =>
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePrint = () => {
    window.print();
  };

  const getTemplateStyles = (): React.CSSProperties => {
    if (template === 'modern') return { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14 };
    if (template === 'compact') return { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, lineHeight: 1.4 };
    return { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 14 };
  };

  return (
    <div>
      <div className="page-header">
        <h1>CV Export</h1>
        <p>Select sections and a template, then print or save as PDF.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>Select Sections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {SECTIONS.map((s) => (
                <label key={s.key} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSections[s.key]}
                    onChange={() => toggleSection(s.key)}
                    id={`section-${s.key}`}
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Visual Template</h3>
            <select
              className="form-select"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              id="template-select"
            >
              {TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {/* <button className="btn btn-secondary" onClick={() => setShowPreview(showPreview)} id="preview-btn">
              <Eye size={15} /> {showPreview ? 'Hide' : 'Show'} Preview
            </button> */}
            <button className="btn btn-primary" onClick={handlePrint} id="print-cv-btn">
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
        </div>

        {/* ── Always-in-DOM CV wrapper (hidden on screen, visible on print) ── */}
        {profile && (
          <>
            {/* Screen preview (conditional) */}
            {showPreview && (
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>CV Preview — {TEMPLATES.find(t => t.value === template)?.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>What you see is what will print</span>
                </div>
                <div style={{ padding: '2rem', ...getTemplateStyles() }}>
                  <CVContent user={user} profile={profile} selectedSections={selectedSections} />
                </div>
              </div>
            )}

            {/* Hidden print target — always in DOM so window.print() captures it */}
            <div id="cv-export-wrapper" style={{ display: 'none', ...getTemplateStyles() }}>
              <CVContent user={user} profile={profile} selectedSections={selectedSections} />
            </div>
          </>
        )}

        {showPreview && !profile && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p style={{ marginTop: '1rem' }}>Loading profile data…</p>
          </div>
        )}
      </div>
    </div>
  );
}
