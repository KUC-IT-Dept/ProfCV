import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus, Trash2, Upload, Link, Save, CheckCircle, AlertCircle,
  Share2, Copy, Check, Eye, EyeOff, ExternalLink,
} from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';

type Profile = {
  name: string; bio: string; headline: string; subjects: string[];
  qualifications: Qualification[];
  publications: Publication[];
  projects: Project[];
  customDetails: CustomDetail[];
  interests: string[];
  media: { attachments: Attachment[]; videoEmbeds: string[] };
  visibility: Visibility;
};

type Visibility = {
  bio: boolean; qualifications: boolean; publications: boolean;
  projects: boolean; subjects: boolean; customDetails: boolean; media: boolean; interests: boolean;
};

type Qualification = { degree: string; institution: string; year: string; grade: string };
type Publication = { title: string; journal: string; year: string; doi: string; url: string };
type Project = { title: string; description: string; year: string; url: string };
type CustomDetail = { sectionTitle: string; content: string };
type Attachment = { name: string; url: string; fileType: string; sizeKB: number };

const EMPTY_PROFILE: Profile = {
  name: '', bio: '', headline: '', subjects: [],
  qualifications: [], publications: [], projects: [],
  customDetails: [], interests: [],
  media: { attachments: [], videoEmbeds: [] },
  visibility: {
    bio: true, qualifications: true, publications: true,
    projects: true, subjects: true, customDetails: true, media: false, interests: true,
  },
};

const VISIBILITY_SECTIONS = [
  { key: 'bio', label: 'Biography & Headline' },
  { key: 'subjects', label: 'Subjects Taught' },
  { key: 'interests', label: 'Interests' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'publications', label: 'Publications' },
  { key: 'projects', label: 'Research Projects' },
  { key: 'customDetails', label: 'Custom Sections' },
  { key: 'media', label: 'Attachments & Media' },
] as const;


// ── Interests Tab Component ────────────────────────────────────────────────────
const DEFAULT_INTERESTS = ['AI', 'ML', 'IoT', 'MERN', 'HCI', 'Embedded Systems', 'Strategic Logic', 'Inclusive Design'];

function InterestsTab({ interests, onAddInterest, onRemoveInterest }: { interests: string[]; onAddInterest: (interest: string) => void; onRemoveInterest: (index: number) => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customValue, setCustomValue] = useState('');

  const filteredInterests = DEFAULT_INTERESTS.filter(
    (interest) =>
      interest.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !interests.includes(interest)
  );

  const handleAddDefault = (interest: string) => {
    onAddInterest(interest);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleAddCustom = () => {
    if (customValue.trim() && !interests.includes(customValue.trim())) {
      onAddInterest(customValue.trim());
      setCustomValue('');
      setShowDropdown(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => setShowDropdown(!showDropdown)} type="button" style={{ flexShrink: 0 }}>
            <Plus size={14} /> Add
          </button>
        </div>

        {showDropdown && (
          <div style={{ position: 'absolute', top: '3.2rem', left: 0, right: 0, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', zIndex: 10, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '0.75rem' }}>
              {filteredInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleAddDefault(interest)}
                  type="button"
                  style={{ display: 'block', width: '100%', padding: '0.625rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: 'var(--color-text)', borderRadius: 'var(--radius-sm)', transition: 'background-color 0.15s' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  {interest}
                </button>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                  Custom Interest
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter custom interest..."
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                    className="form-input"
                    style={{ flex: 1, fontSize: '0.8125rem', padding: '0.5rem 0.625rem' }}
                  />
                  <button className="btn btn-primary" onClick={handleAddCustom} type="button" style={{ flexShrink: 0, padding: '0.5rem 0.75rem' }}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {interests.length > 0 && (
        <div>
          <label className="form-label">Added Interests</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {interests.map((interest, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '99px', fontSize: '0.8125rem', fontWeight: 500 }}>
                {interest}
                <button onClick={() => onRemoveInterest(i)} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Share Modal ────────────────────────────────────────────────────────────────
function ShareModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const publicUrl = `${window.location.origin}/p/${userId}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 520, padding: '1.75rem' }} role="dialog" aria-modal="true">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div className="stat-card-icon" style={{ width: 38, height: 38 }}><Share2 size={17} /></div>
          <div>
            <h2 style={{ fontSize: '1rem' }}>Share Public Profile</h2>
            <p style={{ fontSize: '0.8125rem', margin: 0 }}>Anyone with this link can view your public profile</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            className="form-input"
            readOnly
            value={publicUrl}
            style={{ flex: 1, fontSize: '0.8125rem', background: 'var(--color-bg)' }}
          />
          <button className="btn btn-primary" onClick={copy} style={{ flexShrink: 0 }} id="copy-link-btn">
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>

        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', textDecoration: 'none' }}
        >
          <ExternalLink size={14} /> Open in New Tab
        </a>

        <div className="alert alert-info" style={{ fontSize: '0.8125rem' }}>
          Control what's visible via <strong>Visibility Settings</strong> in the sidebar below.
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Visibility Settings Panel ──────────────────────────────────────────────────
function VisibilityPanel({
  visibility, onToggle, saving,
}: {
  visibility: Visibility;
  onToggle: (key: keyof Visibility) => void;
  saving: boolean;
}) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Eye size={16} color="var(--color-primary)" />
        <h3 style={{ fontSize: '0.9375rem' }}>Visibility Settings</h3>
        {saving && <span className="spinner" style={{ width: 14, height: 14, marginLeft: 'auto' }} />}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Choose which sections appear on your public profile link.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {VISIBILITY_SECTIONS.map((s) => {
          const isOn = visibility[s.key as keyof Visibility];
          return (
            <label key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', background: isOn ? 'var(--color-primary-light)' : 'var(--color-bg)', border: `1px solid ${isOn ? '#BFDBFE' : 'var(--color-border)'}`, transition: 'all 0.15s', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)' }}>{s.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                {isOn ? <Eye size={13} color="var(--color-primary)" /> : <EyeOff size={13} color="var(--color-text-light)" />}
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => onToggle(s.key as keyof Visibility)}
                  id={`vis-${s.key}`}
                />
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfileBuilderPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [visSaving, setVisSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'qualifications' | 'publications' | 'projects' | 'custom' | 'media'>('basic');

  useEffect(() => {
    api.get('/profile/me').then((r) => {
      const p = r.data;
      setProfile({
        name: p.user?.name || '', bio: p.bio || '', headline: p.headline || '', subjects: p.subjects || [],
        qualifications: p.qualifications || [], publications: p.publications || [],
        projects: p.projects || [], customDetails: p.customDetails || [], interests: p.interests || [],
        media: p.media || { attachments: [], videoEmbeds: [] },
        visibility: p.visibility || EMPTY_PROFILE.visibility,
      });
    }).catch(() => {});
  }, []);

  const save = useCallback(async () => {
    setSaveStatus('saving');
    try {
      await api.put('/profile/me', profile);
      // Update AuthContext if name has changed
      if (profile.name && profile.name !== user?.name) {
        updateUser({ name: profile.name });
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch { setSaveStatus('error'); }
  }, [profile, user, updateUser]);

  const set = (key: keyof Profile, val: any) => setProfile((p) => ({ ...p, [key]: val }));

  const toggleVisibility = async (key: keyof Visibility) => {
    const newVis = { ...profile.visibility, [key]: !profile.visibility[key] };
    setProfile((p) => ({ ...p, visibility: newVis }));
    setVisSaving(true);
    try {
      await api.patch('/profile/me/visibility', { [key]: newVis[key] });
    } catch { /* silent */ }
    setVisSaving(false);
  };

  const addQual = () => set('qualifications', [...profile.qualifications, { degree: '', institution: '', year: '', grade: '' }]);
  const updateQual = (i: number, f: keyof Qualification, v: string) => {
    const q = [...profile.qualifications]; q[i] = { ...q[i], [f]: v }; set('qualifications', q);
  };
  const removeQual = (i: number) => set('qualifications', profile.qualifications.filter((_, idx) => idx !== i));

  const addPub = () => set('publications', [...profile.publications, { title: '', journal: '', year: '', doi: '', url: '' }]);
  const updatePub = (i: number, f: keyof Publication, v: string) => {
    const arr = [...profile.publications]; arr[i] = { ...arr[i], [f]: v }; set('publications', arr);
  };
  const removePub = (i: number) => set('publications', profile.publications.filter((_, idx) => idx !== i));

  const addProj = () => set('projects', [...profile.projects, { title: '', description: '', year: '', url: '' }]);
  const updateProj = (i: number, f: keyof Project, v: string) => {
    const arr = [...profile.projects]; arr[i] = { ...arr[i], [f]: v }; set('projects', arr);
  };
  const removeProj = (i: number) => set('projects', profile.projects.filter((_, idx) => idx !== i));

  const addCustom = () => set('customDetails', [...profile.customDetails, { sectionTitle: '', content: '' }]);
  const updateCustom = (i: number, f: keyof CustomDetail, v: string) => {
    const arr = [...profile.customDetails]; arr[i] = { ...arr[i], [f]: v }; set('customDetails', arr);
  };
  const removeCustom = (i: number) => set('customDetails', profile.customDetails.filter((_, idx) => idx !== i));

  const addVideoEmbed = () => set('media', { ...profile.media, videoEmbeds: [...profile.media.videoEmbeds, ''] });
  const updateVideoEmbed = (i: number, v: string) => {
    const arr = [...profile.media.videoEmbeds]; arr[i] = v; set('media', { ...profile.media, videoEmbeds: arr });
  };
  const removeVideoEmbed = (i: number) => set('media', { ...profile.media, videoEmbeds: profile.media.videoEmbeds.filter((_, idx) => idx !== i) });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`"${file.name}" exceeds the 5 MB limit. Please upload a smaller file.`);
      e.target.value = '';
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/profile/me/attachment', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const att: Attachment = res.data.attachment;
      set('media', { ...profile.media, attachments: [...profile.media.attachments, att] });
    } catch (err: any) {
      setUploadError(err?.response?.data?.message ?? 'Upload failed.');
    }
    e.target.value = '';
  };

  const removeAttachment = (i: number) => set('media', { ...profile.media, attachments: profile.media.attachments.filter((_, idx) => idx !== i) });

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1>Profile Builder</h1>
          <p>Build your academic portfolio. Changes are saved manually.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowShare(true)}
            id="share-profile-btn"
          >
            <Share2 size={15} /> Share Profile
          </button>
          <button className="btn btn-primary" onClick={save} disabled={saveStatus === 'saving'} id="save-profile-btn">
            {saveStatus === 'saving' ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Save size={15} />}
            {saveStatus === 'saving' ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>

      {saveStatus === 'saved' && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          <CheckCircle size={15} /> Profile saved successfully.
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
          <AlertCircle size={15} /> Failed to save. Please try again.
        </div>
      )}

      {/* Two-column layout: content + visibility sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem' }}>
        {/* Main builder content */}
        <div>
          {/* Horizontal Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', overflowX: 'auto', paddingBottom: '0' }}>
            <button
              onClick={() => setActiveTab('basic')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'basic' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'basic' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('qualifications')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'qualifications' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'qualifications' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Qualifications ({profile.qualifications.length})
            </button>
            <button
              onClick={() => setActiveTab('publications')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'publications' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'publications' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Publications ({profile.publications.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'projects' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'projects' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Research Projects ({profile.projects.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'custom' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'custom' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Custom Sections ({profile.customDetails.length})
            </button>
            <button
              onClick={() => setActiveTab('media')}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: activeTab === 'media' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: activeTab === 'media' ? '2px solid var(--color-primary)' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              Media & Attachments
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profile.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Dr. John Smith" />
                </div>
                <div className="form-group">
                  <label className="form-label">Professional Headline</label>
                  <input className="form-input" value={profile.headline} onChange={(e) => set('headline', e.target.value)} placeholder="e.g. Associate Professor of Computer Science" />
                </div>
                <div className="form-group">
                  <label className="form-label">Biography</label>
                  <textarea className="form-textarea" value={profile.bio} onChange={(e) => set('bio', e.target.value)} placeholder="Brief professional biography…" style={{ minHeight: 120 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subjects Taught (comma-separated)</label>
                  <input className="form-input" value={profile.subjects.join(', ')} onChange={(e) => set('subjects', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="e.g. Data Structures, Machine Learning" />
                </div>
                <div>
                  <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Interests</label>
                  <InterestsTab interests={profile.interests} onAddInterest={(interest) => set('interests', [...profile.interests, interest])} onRemoveInterest={(i) => set('interests', profile.interests.filter((_, idx) => idx !== i))} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qualifications' && (
            <div>
              {profile.qualifications.map((q, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Degree</label><input className="form-input" value={q.degree} onChange={(e) => updateQual(i, 'degree', e.target.value)} placeholder="Ph.D. Computer Science" /></div>
                    <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={q.institution} onChange={(e) => updateQual(i, 'institution', e.target.value)} placeholder="MIT" /></div>
                    <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={q.year} onChange={(e) => updateQual(i, 'year', e.target.value)} placeholder="2018" /></div>
                    <div className="form-group"><label className="form-label">Grade / Result</label><input className="form-input" value={q.grade} onChange={(e) => updateQual(i, 'grade', e.target.value)} placeholder="Distinction" /></div>
                  </div>
                  <button className="btn btn-ghost" style={{ marginTop: '0.5rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeQual(i)} type="button"><Trash2 size={13} /> Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addQual} type="button"><Plus size={14} /> Add Qualification</button>
            </div>
          )}

          {activeTab === 'publications' && (
            <div>
              {profile.publications.map((p, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={p.title} onChange={(e) => updatePub(i, 'title', e.target.value)} placeholder="Paper title…" /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group"><label className="form-label">Journal / Conference</label><input className="form-input" value={p.journal} onChange={(e) => updatePub(i, 'journal', e.target.value)} placeholder="Nature, ICML…" /></div>
                      <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={p.year} onChange={(e) => updatePub(i, 'year', e.target.value)} placeholder="2023" /></div>
                      <div className="form-group"><label className="form-label">DOI</label><input className="form-input" value={p.doi} onChange={(e) => updatePub(i, 'doi', e.target.value)} placeholder="10.1000/xyz123" /></div>
                      <div className="form-group"><label className="form-label">URL</label><input className="form-input" type="url" value={p.url} onChange={(e) => updatePub(i, 'url', e.target.value)} placeholder="https://…" /></div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ marginTop: '0.5rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removePub(i)} type="button"><Trash2 size={13} /> Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addPub} type="button"><Plus size={14} /> Add Publication</button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              {profile.projects.map((p, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group"><label className="form-label">Project Title</label><input className="form-input" value={p.title} onChange={(e) => updateProj(i, 'title', e.target.value)} placeholder="Title…" /></div>
                      <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={p.year} onChange={(e) => updateProj(i, 'year', e.target.value)} placeholder="2024" /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={p.description} onChange={(e) => updateProj(i, 'description', e.target.value)} placeholder="Project description…" /></div>
                    <div className="form-group"><label className="form-label">Project URL</label><input className="form-input" type="url" value={p.url} onChange={(e) => updateProj(i, 'url', e.target.value)} placeholder="https://github.com/…" /></div>
                  </div>
                  <button className="btn btn-ghost" style={{ marginTop: '0.5rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeProj(i)} type="button"><Trash2 size={13} /> Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addProj} type="button"><Plus size={14} /> Add Project</button>
            </div>
          )}

          {activeTab === 'custom' && (
            <div>
              {profile.customDetails.map((c, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group"><label className="form-label">Section Title</label><input className="form-input" value={c.sectionTitle} onChange={(e) => updateCustom(i, 'sectionTitle', e.target.value)} placeholder="e.g. Awards, Teaching Philosophy…" /></div>
                    <div className="form-group"><label className="form-label">Content</label><textarea className="form-textarea" value={c.content} onChange={(e) => updateCustom(i, 'content', e.target.value)} placeholder="Content…" /></div>
                  </div>
                  <button className="btn btn-ghost" style={{ marginTop: '0.5rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeCustom(i)} type="button"><Trash2 size={13} /> Remove</button>
                </div>
              ))}
              <button className="btn btn-secondary" onClick={addCustom} type="button"><Plus size={14} /> Add Custom Section</button>
            </div>
          )}

          {activeTab === 'media' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="form-label" style={{ marginBottom: '0.625rem' }}>Upload Files (PDF / Images — max 5 MB each)</label>
                <label
                  htmlFor="file-upload"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
                >
                  <Upload size={20} color="var(--color-text-muted)" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Click to upload or drag and drop</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>JPEG, PNG, GIF, WEBP, PDF — max 5 MB</span>
                </label>
                <input id="file-upload" type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                {uploadError && <div className="alert alert-error" style={{ marginTop: '0.625rem' }}><AlertCircle size={14} />{uploadError}</div>}
                {profile.media.attachments.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {profile.media.attachments.map((a, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: '0.8125rem' }}>
                          <a href={a.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{a.name}</a>
                          <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>({a.sizeKB} KB)</span>
                        </div>
                        <button className="btn btn-ghost" onClick={() => removeAttachment(i)} type="button" style={{ padding: '0.25rem' }}><Trash2 size={13} color="var(--color-danger)" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label">Video Embed URLs (YouTube, Vimeo…)</label>
                {profile.media.videoEmbeds.map((v, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Link size={14} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input className="form-input" value={v} onChange={(e) => updateVideoEmbed(i, e.target.value)} placeholder="https://youtube.com/watch?v=…" style={{ paddingLeft: '2rem' }} />
                    </div>
                    <button className="btn btn-ghost" onClick={() => removeVideoEmbed(i)} type="button"><Trash2 size={13} color="var(--color-danger)" /></button>
                  </div>
                ))}
                <button className="btn btn-secondary" onClick={addVideoEmbed} type="button"><Plus size={14} /> Add Video URL</button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: Visibility Settings - Fixed Position */}
        <div style={{ position: 'fixed', top: '100px', right: '0rem', width: '280px', zIndex: 10, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
          <VisibilityPanel
            visibility={profile.visibility}
            onToggle={toggleVisibility}
            saving={visSaving}
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShare && user && (
        <ShareModal userId={user.id} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
