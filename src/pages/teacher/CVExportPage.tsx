import React, { useEffect, useState, useRef } from 'react';
import { Printer } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CVExport.module.css';
import { useReactToPrint } from 'react-to-print';

type Profile = any;

const TEMPLATES = [
  { value: 'classic', label: 'Classic Academic' },
  { value: 'modern', label: 'Modern Professional' },
  { value: 'compact', label: 'Compact Summary' },
];

// ── Shared CV content (rendered in preview + hidden print wrapper) ────────────
function CVContent({
  user, profile, selectedSections,
}: {
  user: any;
  profile: any;
  selectedSections: Record<string, boolean>;
}) {
  // Simple fallback to prevent blank page
  return (
    <div style={{ padding: '2rem' }}>
      {/* Header with Profile Picture */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '2px solid #1D4ED8', paddingBottom: '1rem' }}>
        {selectedSections.photo && (
          <div style={{ marginRight: '1.5rem', flexShrink: 0 }}>
            {(user?.photo || profile?.photo) ? (
              <img 
                src={
                  (user?.photo || profile?.photo)?.startsWith('http') 
                    ? (user?.photo || profile?.photo)
                    : `http://localhost:5000${user?.photo || profile?.photo}`
                } 
                alt="Profile" 
                onLoad={() => console.log('Image loaded successfully')}
                onError={(e) => {
                  console.log('Image failed to load:', e);
                  console.log('Image src was:', user?.photo || profile?.photo);
                  e.currentTarget.style.display = 'none';
                }}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '3px solid #E5E7EB'
                }}
              />
            ) : (
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  border: '3px solid #E5E7EB',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '2rem'
                }}
              >
                {(user?.name || 'Name').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.625rem', color: '#0F172A', marginBottom: '0.5rem' }}>
            {user?.name || 'Name'}
          </h1>
          <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>
            {user?.email || 'email@example.com'} · {user?.department || 'Department'}
          </div>
          
          {/* Personal Info Fields */}
          {selectedSections.phoneNumber && (user?.phoneNumber || profile?.phoneNumber) && (
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.25rem' }}>
              <strong>Phone:</strong> {user?.phoneNumber || profile?.phoneNumber}
            </div>
          )}
          
          {selectedSections.address && (user?.address || profile?.address) && (
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.25rem' }}>
              <strong>Address:</strong> {user?.address || profile?.address}
            </div>
          )}
          
          {selectedSections.dob && (user?.dob || profile?.dob) && (
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.25rem' }}>
              <strong>Date of Birth:</strong> {new Date(user?.dob || profile?.dob).toLocaleDateString()}
            </div>
          )}
          
          {selectedSections.gender && (user?.gender || profile?.gender) && (
            <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.25rem' }}>
              <strong>Gender:</strong> {user?.gender || profile?.gender}
            </div>
          )}
        </div>
      </div>

      {/* Biography Section */}
      {selectedSections.bio && profile?.bio && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Biography</h2>
          <p style={{ color: '#0F172A', lineHeight: 1.7 }}>
            {profile.bio}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Qualification</h2>
        {profile?.qualifications && Array.isArray(profile.qualifications) && profile.qualifications.length > 0 ? (
          profile.qualifications.map((q: any, i: number) => (
            <div key={i} style={{ marginBottom: '0.5rem', paddingLeft: '0.75rem', borderLeft: '2px solid #BFDBFE' }}>
              <strong>{q?.degree || 'Degree'}</strong> - {q?.institution || 'Institution'}
              {q?.year && <span style={{ color: '#64748B' }}> · {q.year}</span>}
            </div>
          ))
        ) : (
          <p style={{ color: '#64748B' }}>No qualification information available.</p>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', color: '#1D4ED8', borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '0.5rem' }}>Research & Publications</h2>
        {profile?.publications && Array.isArray(profile.publications) && profile.publications.length > 0 ? (
          profile.publications.map((p: any, i: number) => (
            <div key={i} style={{ marginBottom: '0.5rem', paddingLeft: '0.75rem', borderLeft: '2px solid #BFDBFE' }}>
              <strong>{p?.title || 'Title'}</strong>
              {p?.journal && <span style={{ color: '#64748B' }}> - {p.journal}</span>}
              {p?.year && <span style={{ color: '#64748B' }}> ({p.year})</span>}
            </div>
          ))
        ) : (
          <p style={{ color: '#64748B' }}>No publications information available.</p>
        )}
      </div>

          </div>
  );
}

export default function CVExportPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedSections, setSelectedSections] = useState<Record<string, boolean>>({
    photo: true,
    phoneNumber: true,
    address: true,
    dob: true,
    gender: true,
    bio: true,
    qualifications: true,
    entranceTests: true,
    professionalDetails: true,
    workExperiences: true,
    publications: true,
    awards: true,
    projects: true,
    researchSupervision: true,
    academicResponsibilities: true,
    professionalMemberships: true,
    trainingAndFdp: true,
    onlineCertification: true,
    internationalExperiences: true,
    documents: true,
    customDetails: true,
  });
  const [template, setTemplate] = useState('classic');
  const [error, setError] = useState<string | null>(null);
  const showPreview = true;

  // Print reference for react-to-print
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get('/profile/me').then((r) => setProfile(r.data)).catch((err) => {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data');
    });
  }, []);

  // Error boundary fallback
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
        <h2>Error Loading CV Export</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  const toggleSection = (key: string) =>
    setSelectedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // use react-to-print hook
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: user?.name ? `${user.name}_CV_Export` : 'CV_Export',
  });

  const getTemplateStyles = (): React.CSSProperties => {
    if (template === 'modern') return { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 14 };
    if (template === 'compact') return { fontFamily: "'Inter', system-ui, sans-serif", fontSize: 12, lineHeight: 1.4 };
    return { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 14 };
  };

  try {
    return (
      <div>
        <div className="page-header no-print">
          <h1>CV Export</h1>
          <p>Select sections and a template, then print or save as PDF.</p>
        </div>

        <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* Controls Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>Select Sections</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {/* Personal Info Sub-sections */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Personal Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '0.5rem' }}>
                    {[
                      { key: 'photo', label: 'Profile Photo' },
                      { key: 'phoneNumber', label: 'Phone Number' },
                      { key: 'address', label: 'Address' },
                      { key: 'dob', label: 'Date of Birth' },
                      { key: 'gender', label: 'Gender' },
                      { key: 'bio', label: 'Biography' },
                    ].map((s) => (
                      <label key={s.key} className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedSections[s.key]}
                          onChange={() => toggleSection(s.key)}
                          id={`section-${s.key}`}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Sections */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Academic & Professional</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '0.5rem' }}>
                    {[
                      { key: 'qualifications', label: 'Qualification' },
                      { key: 'entranceTests', label: 'Entrance / Eligibility Test' },
                      { key: 'professionalDetails', label: 'Professional Details' },
                      { key: 'workExperiences', label: 'Work Experience' },
                      { key: 'publications', label: 'Research & Publications' },
                      { key: 'awards', label: 'Awards & Honours' },
                      { key: 'projects', label: 'Research Projects' },
                      { key: 'researchSupervision', label: 'Research Supervision' },
                      { key: 'academicResponsibilities', label: 'Academics Responsibility' },
                    ].map((s) => (
                      <label key={s.key} className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedSections[s.key]}
                          onChange={() => toggleSection(s.key)}
                          id={`section-${s.key}`}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Development & Experience</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '0.5rem' }}>
                    {[
                      { key: 'professionalMemberships', label: 'Professional Membership' },
                      { key: 'trainingAndFdp', label: 'Training, FDP & Workshops' },
                      { key: 'onlineCertification', label: 'Online Certification' },
                      { key: 'internationalExperiences', label: 'International Experience' },
                    ].map((s) => (
                      <label key={s.key} className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedSections[s.key]}
                          onChange={() => toggleSection(s.key)}
                          id={`section-${s.key}`}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Additional</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '0.5rem' }}>
                    {[
                      { key: 'documents', label: 'Documents Upload' },
                      { key: 'customDetails', label: 'Custom Section' },
                    ].map((s) => (
                      <label key={s.key} className="checkbox-label" style={{ fontSize: '0.8125rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedSections[s.key]}
                          onChange={() => toggleSection(s.key)}
                          id={`section-${s.key}`}
                        />
                        <span>{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
              <button className="btn btn-primary" onClick={handlePrint} id="print-cv-btn">
                <Printer size={15} /> Print / Save PDF
              </button>
            </div>
          </div>

          {/* Screen preview (conditional) */}
          <div>
            {profile && showPreview && (
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>CV Preview - {TEMPLATES.find(t => t.value === template)?.label}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>What you see is what will print</span>
                </div>
                <div style={{ padding: '2rem', ...getTemplateStyles() }}>
                  <CVContent user={user} profile={profile} selectedSections={selectedSections} />
                </div>
              </div>
            )}

            {showPreview && !profile && (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
                <p style={{ marginTop: '1rem' }}>Loading profile data...</p>
              </div>
            )}
          </div>
        </div>

        {/* React-to-print target - Hidden via parent style so ref is clean */}
        {profile && (
          <div style={{ display: 'none' }}>
            <div ref={printRef} id="cv-export-wrapper" style={{ padding: '2cm', background: '#fff', ...getTemplateStyles() }}>
              <CVContent user={user} profile={profile} selectedSections={selectedSections} />
            </div>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('CV Export rendering error:', err);
    setError('Rendering error occurred');
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
        <h2>Rendering Error</h2>
        <p>An error occurred while rendering the CV Export page.</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}
