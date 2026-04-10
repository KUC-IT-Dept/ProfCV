import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus, Trash2, Upload, Link, Save, CheckCircle, AlertCircle,
  Share2, Copy, Check, Eye, EyeOff, ExternalLink, User,
  ChevronDown, ChevronUp,
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
  photo?: string;
  dob: string;
  gender: string;
  phoneNumber: string;
  address: string;
  subCategory: string;
  differentlyAbled: string;
  maritalStatus: string;
  spouse: string;
  emergencyContact: string;
  panNumber: string;
  bloodGroup: string;
  nationality: string;
  stateCity: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNumber: string;
  alternatePhone: string;
  officialEmail: string;
  personalEmail: string;
  aadhaar: string;
  passport: string;
  religion: string;
  category: string;
};

type Visibility = {
  bio: boolean; qualifications: boolean; publications: boolean;
  projects: boolean; subjects: boolean; customDetails: boolean; media: boolean; interests: boolean;
  photo: boolean; dob: boolean; gender: boolean; phoneNumber: boolean; address: boolean;
};

type Qualification = { degree: string; institution: string; year: string; grade: string };
type Publication = { title: string; authors: string; journal: string; organisation: string; year: string; volume: string; issue: string; month: string; pages: string; doi: string; url: string };
type Project = { title: string; description: string; year: string; url: string };
type CustomDetail = { sectionTitle: string; content: string; isVisible: boolean };
type Attachment = { name: string; url: string; fileType: string; sizeKB: number };

const EMPTY_PROFILE: Profile = {
  name: '', bio: '', headline: '', subjects: [],
  qualifications: [], publications: [], projects: [],
  customDetails: [], interests: [], photo: '',
  dob: '', gender: '', phoneNumber: '', address: '',
  subCategory: '',
  differentlyAbled: '',
  maritalStatus: '',
  spouse: '',
  emergencyContact: '',
  panNumber: '',
  bloodGroup: '',
  nationality: '',
  stateCity: '',
  permanentAddress: '',
  currentAddress: '',
  mobileNumber: '',
  alternatePhone: '',
  officialEmail: '',
  personalEmail: '',
  aadhaar: '',
  passport: '',
  religion: '',
  category: '',
  media: { attachments: [], videoEmbeds: [] },
  visibility: {
    bio: true, qualifications: true, publications: true,
    projects: true, subjects: true, customDetails: true, media: false, interests: true,
    photo: true, dob: false, gender: false, phoneNumber: false, address: false,
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

// ── Update Password Modal ──────────────────────────────────────────────────────
function UpdatePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess('Password updated successfully.');
      setTimeout(() => onClose(), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password.');
      setSaving(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '1.75rem' }} role="dialog" aria-modal="true">
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1.25rem' }}>Update Password</h2>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input type="password" required className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" required className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" required className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
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
  const [personalOpen, setPersonalOpen] = useState(false);

  const personalKeys = ['photo', 'phoneNumber', 'address', 'dob', 'gender'] as const;
  const personalLabels: Record<string, string> = {
    photo: 'Profile Photo',
    phoneNumber: 'Phone Number',
    address: 'Address',
    dob: 'Date of Birth',
    gender: 'Gender',
  };

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

        {/* Personal Info Dropdown */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <button
            onClick={() => setPersonalOpen(!personalOpen)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', background: 'var(--color-bg)', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text)' }}>Personal Info</span>
            {personalOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {personalOpen && (
            <div style={{ padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
              {personalKeys.map((key) => {
                const isOn = visibility[key];
                return (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.375rem 0.5rem', borderRadius: 'var(--radius-sm)', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text)' }}>{personalLabels[key]}</span>
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => onToggle(key)}
                      style={{ width: 14, height: 14 }}
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollapsibleEditorCard({
  title,
  summary,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  summary: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.25rem 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h3 style={{ fontSize: '0.9375rem', margin: 0 }}>{title}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>{expanded ? 'Expanded' : 'Collapsed'}</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {summary}
            </p>
          </div>
          {expanded ? <ChevronUp size={14} color="var(--color-text-muted)" /> : <ChevronDown size={14} color="var(--color-text-muted)" />}
        </button>

      </div>

      {expanded && <div style={{ marginTop: '1rem' }}>{children}</div>}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ProfileBuilderPage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [savedProfile, setSavedProfile] = useState<Profile>(EMPTY_PROFILE);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [uploadError, setUploadError] = useState('');
  const [error, setError] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [visSaving, setVisSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [basicEditMode, setBasicEditMode] = useState(false);

  useEffect(() => {
    api.get('/profile/me').then((r) => {
      const p = r.data;
      const initialProfile = {
        name: p.user?.name || '', bio: p.bio || '', headline: p.headline || '', subjects: p.subjects || [],
        qualifications: p.qualifications || [], publications: p.publications || [],
        projects: p.projects || [],
        customDetails: (p.customDetails || []).map((c: any) => ({ ...c, isVisible: c.isVisible ?? true })),
        interests: p.interests || [],
        media: p.media || { attachments: [], videoEmbeds: [] },
        visibility: p.visibility || EMPTY_PROFILE.visibility,
        photo: p.photo || '',
        dob: p.dob || '', gender: p.gender || '', phoneNumber: p.phoneNumber || '', address: p.address || '',
        subCategory: p.subCategory || '',
        differentlyAbled: p.differentlyAbled || '',
        maritalStatus: p.maritalStatus || '',
        spouse: p.spouse || '',
        emergencyContact: p.emergencyContact || '',
        panNumber: p.panNumber || '',
        bloodGroup: p.bloodGroup || '',
        nationality: p.nationality || '',
        stateCity: p.stateCity || '',
        permanentAddress: p.permanentAddress || '',
        currentAddress: p.currentAddress || '',
        mobileNumber: p.mobileNumber || '',
        alternatePhone: p.alternatePhone || '',
        officialEmail: p.officialEmail || '',
        personalEmail: p.personalEmail || '',
        aadhaar: p.aadhaar || '',
        passport: p.passport || '',
        religion: p.religion || '',
        category: p.category || '',
      };
      setProfile(initialProfile);
      setSavedProfile(initialProfile);
    }).catch(() => { });
  }, []);

  const isExpanded = (key: string) => expandedSections[key] ?? false;
  const openSection = (key: string) => setExpandedSections((prev) => ({ ...prev, [key]: true }));
  const toggleSection = (key: string) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const save = useCallback(async () => {
    // Validation
    const missingPubs = profile.publications.some(p => !p.title || !p.year || !p.doi || !p.url);
    const missingProjects = profile.projects.some(p => !p.title || !p.year || !p.url);
    const missingCustom = profile.customDetails.some(c => !c.sectionTitle || !c.content);

    if (missingPubs || missingProjects || missingCustom) {
      setError('Please fill in all mandatory fields (marked with *) for Publications, Research Projects, and Custom Sections.');
      setSaveStatus('error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaveStatus('saving');
    setError('');
    try {
      await api.put('/profile/me', profile);
      // Update AuthContext if name or photo has changed
      if ((profile.name && profile.name !== user?.name) || (profile.photo && profile.photo !== user?.photo)) {
        updateUser({ name: profile.name, photo: profile.photo });
      }
      setSavedProfile(profile);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setError('An error occurred while saving your profile.');
    }
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

  const addQual = () => {
    const nextIndex = profile.qualifications.length;
    set('qualifications', [...profile.qualifications, { degree: '', institution: '', year: '', grade: '' }]);
    openSection(`qualifications-${nextIndex}`);
  };
  const updateQual = (i: number, f: keyof Qualification, v: string) => {
    const q = [...profile.qualifications]; q[i] = { ...q[i], [f]: v }; set('qualifications', q);
  };
  const removeQual = (i: number) => set('qualifications', profile.qualifications.filter((_, idx) => idx !== i));

  const addPub = () => {
    const nextIndex = profile.publications.length;
    set('publications', [...profile.publications, { title: '', authors: '', journal: '', organisation: '', year: '', volume: '', issue: '', month: '', pages: '', doi: '', url: '' }]);
    openSection(`publications-${nextIndex}`);
  };
  const updatePub = (i: number, f: keyof Publication, v: string) => {
    const arr = [...profile.publications]; arr[i] = { ...arr[i], [f]: v }; set('publications', arr);
  };
  const removePub = (i: number) => set('publications', profile.publications.filter((_, idx) => idx !== i));

  const addProj = () => {
    const nextIndex = profile.projects.length;
    set('projects', [...profile.projects, { title: '', description: '', year: '', url: '' }]);
    openSection(`projects-${nextIndex}`);
  };
  const updateProj = (i: number, f: keyof Project, v: string) => {
    const arr = [...profile.projects]; arr[i] = { ...arr[i], [f]: v }; set('projects', arr);
  };
  const removeProj = (i: number) => set('projects', profile.projects.filter((_, idx) => idx !== i));

  const addCustom = () => {
    const newIdx = profile.customDetails.length;
    set('customDetails', [...profile.customDetails, { sectionTitle: '', content: '', isVisible: true }]);
    setActiveTab(`custom-${newIdx}`);
    openSection(`custom-${newIdx}`);
  };
  const updateCustom = (i: number, f: keyof CustomDetail, v: any) => {
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

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setUploadError(`"${file.name}" exceeds the 2 MB limit. Please upload a smaller image.`);
      e.target.value = '';
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/profile/me/photo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const photoUrl = res.data.photoUrl;
      set('photo', photoUrl);
      updateUser({ photo: photoUrl });
    } catch (err: any) {
      setUploadError(err?.response?.data?.message ?? 'Photo upload failed.');
    }
    e.target.value = '';
  };

  const removeAttachment = (i: number) => set('media', { ...profile.media, attachments: profile.media.attachments.filter((_, idx) => idx !== i) });

  return (
    <div style={{ width: 'calc(100% - 340px)', maxWidth: 'none' }}>
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

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Main builder content */}
        <div style={{ minWidth: 0 }}>
          {/* Horizontal Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            {/* Scrollable Tabs Area */}
            <div style={{ flex: 1, display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
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
                Publications ({savedProfile.publications.length})
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
                Research Projects ({savedProfile.projects.length})
              </button>
              {profile.customDetails.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(`custom-${i}`)}
                  style={{
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: activeTab === `custom-${i}` ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    borderBottom: activeTab === `custom-${i}` ? '2px solid var(--color-primary)' : 'none',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}
                >
                  {!c.isVisible && <EyeOff size={12} color="var(--color-text-light)" />}
                  {c.sectionTitle || `Section ${i + 1}`}
                </button>
              ))}
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

            {/* Fixed Action Button */}
            <div style={{ flexShrink: 0, paddingLeft: '0.5rem', borderLeft: '1px solid var(--color-border)', marginLeft: '0.5rem' }}>
              <button
                onClick={addCustom}
                style={{
                  padding: '0.5rem 0.875rem',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-primary-light',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--color-primary-light)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                title="Add Custom Section"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'basic' && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Basic Information</h2>
                  <p style={{ fontSize: '0.8125rem', margin: 0 }}>View your details, then click Edit to make changes.</p>
                </div>
                <button className="btn btn-secondary" type="button" onClick={() => setBasicEditMode((prev) => !prev)}>
                  Edit
                </button>
              </div>

              {!basicEditMode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {profile.photo ? <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--color-text-light)" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{profile.name || 'Unnamed profile'}</h3>
                      <p style={{ margin: 0 }}>{profile.headline || 'No headline added yet'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>Biography</div>
                      <div style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text)' }}>{profile.bio || 'No biography added yet'}</div>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>Subjects</div>
                      <div style={{ color: 'var(--color-text)' }}>{profile.subjects.length > 0 ? profile.subjects.join(', ') : 'No subjects added yet'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>
                        Personal Information
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        color: 'var(--color-text)'
                      }}>
                        <div><strong>Full Name:</strong> {profile.name || 'Not set'}</div>
                        <div><strong>Date of Birth:</strong> {profile.dob || 'Not set'}</div>
                        <div><strong>Gender:</strong> {profile.gender || 'Not set'}</div>
                        <div><strong>Blood Group:</strong> {profile.bloodGroup || 'Not set'}</div>
                        <div><strong>Nationality:</strong> {profile.nationality || 'Not set'}</div>
                        <div><strong>State & City:</strong> {profile.stateCity || 'Not set'}</div>
                        <div><strong>Permanent Address:</strong> {profile.permanentAddress || 'Not set'}</div>
                        <div><strong>Current Address:</strong> {profile.currentAddress || 'Not set'}</div>
                        <div><strong>Mobile Number:</strong> {profile.mobileNumber || 'Not set'}</div>
                        <div><strong>Alternate Phone:</strong> {profile.alternatePhone || 'Not set'}</div>
                        <div><strong>Official Email:</strong> {profile.officialEmail || 'Not set'}</div>
                        <div><strong>Personal Email:</strong> {profile.personalEmail || 'Not set'}</div>
                        <div><strong>Aadhaar:</strong> {profile.aadhaar || 'Not set'}</div>
                        <div><strong>Passport:</strong> {profile.passport || 'Not set'}</div>
                        <div><strong>Religion:</strong> {profile.religion || 'Not set'}</div>
                        <div><strong>Category:</strong> {profile.category || 'Not set'}</div>
                        <div><strong>Sub-category:</strong> {profile.subCategory || 'Not set'}</div>
                        <div><strong>Differently Abled:</strong> {profile.differentlyAbled || 'Not set'}</div>
                        <div><strong>Marital Status:</strong> {profile.maritalStatus || 'Not set'}</div>
                        <div><strong>Spouse:</strong> {profile.spouse || 'Not set'}</div>
                        <div><strong>Emergency Contact:</strong> {profile.emergencyContact || 'Not set'}</div>
                        <div><strong>PAN Number:</strong> {profile.panNumber || 'Not set'}</div>
                      </div>
                    </div>
                    <div className="card" style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>Interests</div>
                      {profile.interests.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {profile.interests.map((interest, i) => (
                            <span key={i} style={{ padding: '0.35rem 0.65rem', borderRadius: '99px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.8125rem' }}>{interest}</span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--color-text)' }}>No interests added yet</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <button type="button" onClick={() => setShowPasswordModal(true)} style={{ backgroundColor: 'red', width: '220px', color: 'white', textAlign: 'center', padding: '6px 16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                      Update Password
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Profile Photo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {profile.photo ? <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--color-text-light)" />}
                      </div>
                      <div>
                        <label htmlFor="photo-upload" className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: '0.375rem', display: 'inline-flex' }}>
                          <Upload size={14} /> {profile.photo ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Accepted: JPG, PNG, GIF. Max 2MB.</p>
                      </div>
                    </div>
                  </div>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-input" value={profile.dob} onChange={(e) => set('dob', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-input" value={profile.gender} onChange={(e) => set('gender', e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input" value={profile.phoneNumber} onChange={(e) => set('phoneNumber', e.target.value)} placeholder="e.g. +1 234 567 890" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Office / Residential Address</label>
                    <textarea className="form-textarea" value={profile.address} onChange={(e) => set('address', e.target.value)} placeholder="Enter full address…" style={{ minHeight: 80 }} />
                  </div>
                  <div>
                    <div className="form-group">
                      <label className="form-label">Blood Group</label>
                      <input className="form-input" value={profile.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nationality</label>
                      <input className="form-input" value={profile.nationality} onChange={(e) => set('nationality', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">State & City</label>
                      <input className="form-input" value={profile.stateCity} onChange={(e) => set('stateCity', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Permanent Address</label>
                      <textarea className="form-textarea" value={profile.permanentAddress} onChange={(e) => set('permanentAddress', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Address</label>
                      <textarea className="form-textarea" value={profile.currentAddress} onChange={(e) => set('currentAddress', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input className="form-input" value={profile.mobileNumber} onChange={(e) => set('mobileNumber', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alternate Phone</label>
                      <input className="form-input" value={profile.alternatePhone} onChange={(e) => set('alternatePhone', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Official Email</label>
                      <input className="form-input" value={profile.officialEmail} onChange={(e) => set('officialEmail', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Personal Email</label>
                      <input className="form-input" value={profile.personalEmail} onChange={(e) => set('personalEmail', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Aadhaar</label>
                      <input className="form-input" value={profile.aadhaar} onChange={(e) => set('aadhaar', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">PAN Number</label>
                      <input className="form-input" value={profile.panNumber} onChange={(e) => set('panNumber', e.target.value)} />
                    </div>
                    <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Interests</label>
                    <InterestsTab interests={profile.interests} onAddInterest={(interest) => set('interests', [...profile.interests, interest])} onRemoveInterest={(i) => set('interests', profile.interests.filter((_, idx) => idx !== i))} />
                  </div>
                  <button type="button" onClick={() => setShowPasswordModal(true)} style={{ backgroundColor: 'red', width: '220px', color: 'white', textAlign: 'center', padding: '6px 16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                    Update Password
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'qualifications' && (
            <div>
              {profile.qualifications.map((q, i) => {
                const cardKey = `qualifications-${i}`;
                const summary = [q.degree, q.institution, q.year].filter(Boolean).join(' · ') || 'Add qualification details';
                return (
                  <CollapsibleEditorCard
                    key={cardKey}
                    title={q.degree || `Qualification ${i + 1}`}
                    summary={summary}
                    expanded={isExpanded(cardKey)}
                    onToggle={() => toggleSection(cardKey)}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div className="form-group"><label className="form-label">Degree</label><input className="form-input" value={q.degree} onChange={(e) => updateQual(i, 'degree', e.target.value)} placeholder="Ph.D. Computer Science" /></div>
                      <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={q.institution} onChange={(e) => updateQual(i, 'institution', e.target.value)} placeholder="MIT" /></div>
                      <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={q.year} onChange={(e) => updateQual(i, 'year', e.target.value)} placeholder="2018" /></div>
                      <div className="form-group"><label className="form-label">Grade / Result</label><input className="form-input" value={q.grade} onChange={(e) => updateQual(i, 'grade', e.target.value)} placeholder="Distinction" /></div>
                    </div>
                    <button className="btn btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeQual(i)} type="button"><Trash2 size={13} /> Remove</button>
                  </CollapsibleEditorCard>
                );
              })}
              <button className="btn btn-secondary" onClick={addQual} type="button"><Plus size={14} /> Add Qualification</button>
            </div>
          )}

          {activeTab === 'publications' && (
            <div>
              {profile.publications.map((p, i) => {
                const cardKey = `publications-${i}`;
                const summary = [p.title, p.year, p.journal].filter(Boolean).join(' · ') || 'Add publication details';
                return (
                  <CollapsibleEditorCard
                    key={cardKey}
                    title={p.title || `Publication ${i + 1}`}
                    summary={summary}
                    expanded={isExpanded(cardKey)}
                    onToggle={() => toggleSection(cardKey)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Paper Title / Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" value={p.title} onChange={(e) => updatePub(i, 'title', e.target.value)} placeholder="Enter paper title…" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Authors List (comma-separated)</label>
                        <input className="form-input" value={p.authors} onChange={(e) => updatePub(i, 'authors', e.target.value)} placeholder="e.g. John Doe, Jane Smith…" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Journal / Conference Name</label><input className="form-input" value={p.journal} onChange={(e) => updatePub(i, 'journal', e.target.value)} placeholder="Nature, ICML…" /></div>
                        <div className="form-group"><label className="form-label">Organisation / Publisher</label><input className="form-input" value={p.organisation} onChange={(e) => updatePub(i, 'organisation', e.target.value)} placeholder="e.g. IEEE, Springer…" /></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Year of Publication <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={p.year} onChange={(e) => updatePub(i, 'year', e.target.value)} placeholder="2023" /></div>
                        <div className="form-group"><label className="form-label">Month (Optional)</label><input className="form-input" value={p.month} onChange={(e) => updatePub(i, 'month', e.target.value)} placeholder="June" /></div>
                        <div className="form-group"><label className="form-label">DOI <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={p.doi} onChange={(e) => updatePub(i, 'doi', e.target.value)} placeholder="10.1000/xyz123" /></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Volume (Optional)</label><input className="form-input" value={p.volume} onChange={(e) => updatePub(i, 'volume', e.target.value)} placeholder="Vol 12" /></div>
                        <div className="form-group"><label className="form-label">Issue (Optional)</label><input className="form-input" value={p.issue} onChange={(e) => updatePub(i, 'issue', e.target.value)} placeholder="Issue 4" /></div>
                        <div className="form-group"><label className="form-label">Page Numbers (Optional)</label><input className="form-input" value={p.pages} onChange={(e) => updatePub(i, 'pages', e.target.value)} placeholder="e.g. 123-145" /></div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Publication URL <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" type="url" value={p.url} onChange={(e) => updatePub(i, 'url', e.target.value)} placeholder="https://…" />
                      </div>
                      <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => removePub(i)} type="button"><Trash2 size={13} /> Remove Publication</button>
                    </div>
                  </CollapsibleEditorCard>
                );
              })}
              <button className="btn btn-secondary" onClick={addPub} type="button"><Plus size={14} /> Add Publication</button>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              {profile.projects.map((p, i) => {
                const cardKey = `projects-${i}`;
                const summary = [p.title, p.year].filter(Boolean).join(' · ') || 'Add project details';
                return (
                  <CollapsibleEditorCard
                    key={cardKey}
                    title={p.title || `Project ${i + 1}`}
                    summary={summary}
                    expanded={isExpanded(cardKey)}
                    onToggle={() => toggleSection(cardKey)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label">Project Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" value={p.title} onChange={(e) => updateProj(i, 'title', e.target.value)} placeholder="Research project title…" />
                      </div>
                      <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={p.description} onChange={(e) => updateProj(i, 'description', e.target.value)} placeholder="Brief project summary…" style={{ minHeight: 80 }} /></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div className="form-group"><label className="form-label">Year <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={p.year} onChange={(e) => updateProj(i, 'year', e.target.value)} placeholder="2022-2023" /></div>
                        <div className="form-group"><label className="form-label">Project URL <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" type="url" value={p.url} onChange={(e) => updateProj(i, 'url', e.target.value)} placeholder="https://…" /></div>
                      </div>
                      <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => removeProj(i)} type="button"><Trash2 size={13} /> Remove Project</button>
                    </div>
                  </CollapsibleEditorCard>
                );
              })}
              <button className="btn btn-secondary" onClick={addProj} type="button"><Plus size={14} /> Add Project</button>
            </div>
          )}

          {activeTab.startsWith('custom-') && (
            <div>
              {(() => {
                const idx = parseInt(activeTab.split('-')[1]);
                const c = profile.customDetails[idx];
                if (!c) return null;
                const cardKey = `custom-${idx}`;
                const preview = c.content.trim().replace(/\s+/g, ' ').slice(0, 90);
                const summary = `${c.isVisible ? 'Visible' : 'Hidden'}${preview ? ` · ${preview}` : ''}`;
                return (
                  <CollapsibleEditorCard
                    key={cardKey}
                    title={c.sectionTitle || `Section ${idx + 1}`}
                    summary={summary || 'Add section content'}
                    expanded={isExpanded(cardKey)}
                    onToggle={() => toggleSection(cardKey)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                        {c.isVisible ? <Eye size={14} color="var(--color-primary)" /> : <EyeOff size={14} color="var(--color-text-light)" />}
                        <span>{c.isVisible ? 'Visible on Profile' : 'Hidden from Profile'}</span>
                        <input type="checkbox" checked={c.isVisible} onChange={() => updateCustom(idx, 'isVisible', !c.isVisible)} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Section Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" value={c.sectionTitle} onChange={(e) => updateCustom(idx, 'sectionTitle', e.target.value)} placeholder="e.g. Awards, Teaching Philosophy…" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Content <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <textarea className="form-textarea" value={c.content} onChange={(e) => updateCustom(idx, 'content', e.target.value)} placeholder="Content…" style={{ minHeight: 200 }} />
                      </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                      <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeCustom(idx)} type="button">
                        <Trash2 size={13} /> Remove Section
                      </button>
                    </div>
                  </CollapsibleEditorCard>
                );
              })()}
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

        {/* Sidebar: Visibility Settings - Fixed Right Position */}
        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', width: '280px', zIndex: 10, maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
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

      {/* Password Modal */}
      {showPasswordModal && (
        <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
