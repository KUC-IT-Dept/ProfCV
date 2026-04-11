import React, { useEffect, useState, useCallback } from 'react';
import {
  Plus, Trash2, Upload, Link, Save, CheckCircle, AlertCircle,
  Share2, Copy, Check, Eye, EyeOff, ExternalLink, User,
  ChevronDown, ChevronUp,
} from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../contexts/AuthContext';
import BasicInformationSection from './profileBuilderSections/BasicInformationSection';
import EntranceEligibilityTestsSection from './profileBuilderSections/EntranceEligibilityTestsSection';
import MediaAttachmentsSection from './profileBuilderSections/MediaAttachmentsSection';
import DocumentsSection from './profileBuilderSections/DocumentsSection';
import ProfessionalDetailsSection from './profileBuilderSections/ProfessionalDetailsSection';
import PublicationsSection from './profileBuilderSections/PublicationsSection';
import QualificationsSection from './profileBuilderSections/QualificationsSection';
import ResearchProjectsSection from './profileBuilderSections/ResearchProjectsSection';
import WorkExperienceSection from './profileBuilderSections/WorkExperienceSection';


type Profile = {
  name: string; bio: string; headline: string; subjects: string[];
  workExperiences: WorkExperience[];
  qualifications: Qualification[];
  publications: Publication[];
  projects: Project[];
  customDetails: CustomDetail[];
  interests: string[];
  media: { attachments: Attachment[]; videoEmbeds: string[] };
  documents: {
    passportPhoto: string;
    signature: string;
    dobProof: string;
    categoryCertificate: string;
    degreeCertificates: string;
    netSetJrfCertificate: string;
    experienceCertificates: string;
    appointmentOrders: string;
    awardCertificates: string;
    publicationProofs: string;
    aadhaarCard: string;
    panCard: string;
  };
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
  professionalDetails: {
    employeeId: string; designation: string; department: string; institutionName: string;
    affiliatedUniversity: string; institutionType: string; natureOfAppointment: string;
    dateOfJoining: string; dateOfConfirmation: string; payBand: string; bankAccountDetails: string;
    pfNumber: string; serviceBookNumber: string;
    dateOfFirstPromotion: string; natureOfFirstAppointment: string; firstPayBand: string;
    dateOfSecondPromotion: string; natureOfSecondAppointment: string; secondPayBand: string;
    dateOfThirdPromotion: string; natureOfThirdAppointment: string; thirdPayBand: string;
  };
  entranceTests: {
    net: { subject: string; year: string; certificateNo: string; };
    set: { subject: string; year: string; state: string; };
    gate: { score: string; year: string; };
    jrf: { agency: string; year: string; };
    other: string;
  };
};

type Visibility = {
  bio: boolean; qualifications: boolean; publications: boolean;
  projects: boolean; subjects: boolean; customDetails: boolean; media: boolean; interests: boolean;
  professionalDetails: boolean; entranceTests: boolean; workExperiences: boolean;
  photo: boolean; dob: boolean; gender: boolean; phoneNumber: boolean; address: boolean;
};

type Qualification = {
  [key: string]: string;
  degree: string;
  specialisation: string;
  institution: string;
  university: string;
  yearofpassing: string;
  cgpa: string;
  division: string;
  mode: string;
  country: string;
  state: string;
  tenthcertificate: string;
  twelfthcertificate: string;
  ugcertificate: string;
  pgcertificate: string;
  mphilcertificate: string;
};
type WorkExperience = { institutionName: string; designation: string; department: string; fromDate: string; toDate: string; totalDuration: string; natureOfAppointment: string; reasonForLeaving: string; };
type Publication = { title: string; authors: string; journal: string; organisation: string; year: string; volume: string; issue: string; month: string; pages: string; doi: string; url: string };
type Project = { title: string; description: string; year: string; url: string };
type CustomDetail = { sectionTitle: string; content: string; isVisible: boolean };
type Attachment = { name: string; url: string; fileType: string; sizeKB: number };
const EMPTY_PROFILE: Profile = {
  name: '', bio: '', headline: '', subjects: [],
  workExperiences: [], qualifications: [], publications: [], projects: [],
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
  documents: { passportPhoto: '', signature: '', dobProof: '', categoryCertificate: '', degreeCertificates: '', netSetJrfCertificate: '', experienceCertificates: '', appointmentOrders: '', awardCertificates: '', publicationProofs: '', aadhaarCard: '', panCard: '' },
  visibility: {
    bio: true, qualifications: true, publications: true,
    projects: true, subjects: true, customDetails: true, media: false, interests: true,
    professionalDetails: true, entranceTests: true, workExperiences: true,
    photo: true, dob: false, gender: false, phoneNumber: false, address: false,
  },
  professionalDetails: {
    employeeId: '', designation: '', department: '', institutionName: '',
    affiliatedUniversity: '', institutionType: '', natureOfAppointment: '',
    dateOfJoining: '', dateOfConfirmation: '', payBand: '', bankAccountDetails: '',
    pfNumber: '', serviceBookNumber: '',
    dateOfFirstPromotion: '', natureOfFirstAppointment: '', firstPayBand: '',
    dateOfSecondPromotion: '', natureOfSecondAppointment: '', secondPayBand: '',
    dateOfThirdPromotion: '', natureOfThirdAppointment: '', thirdPayBand: '',
  },
  entranceTests: {
    net: { subject: '', year: '', certificateNo: '' },
    set: { subject: '', year: '', state: '' },
    gate: { score: '', year: '' },
    jrf: { agency: '', year: '' },
    other: '',
  },
};

const VISIBILITY_SECTIONS = [
  { key: 'bio', label: 'Biography & Headline' },
  { key: 'subjects', label: 'Subjects Taught' },
  { key: 'interests', label: 'Interests' },
  { key: 'workExperiences', label: 'Work Experience' },
  { key: 'qualifications', label: 'Qualifications' },
  { key: 'professionalDetails', label: 'Professional Details' },
  { key: 'entranceTests', label: 'Entrance / Eligibility Tests' },
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
        workExperiences: p.workExperiences || [],
        qualifications: p.qualifications || [], publications: p.publications || [],
        projects: p.projects || [],
        customDetails: (p.customDetails || []).map((c: any) => ({ ...c, isVisible: c.isVisible ?? true })),
        interests: p.interests || [],
        media: p.media || { attachments: [], videoEmbeds: [] },
        documents: p.documents || EMPTY_PROFILE.documents,
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
        professionalDetails: Object.assign({}, EMPTY_PROFILE.professionalDetails, p.professionalDetails || {}),
        entranceTests: Object.assign({
          net: { subject: '', year: '', certificateNo: '' },
          set: { subject: '', year: '', state: '' },
          gate: { score: '', year: '' },
          jrf: { agency: '', year: '' },
          other: '',
        }, p.entranceTests || {}),
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
    set('qualifications', [...profile.qualifications, {
      degree: '',
      specialisation: '',
      institution: '',
      university: '',
      yearofpassing: '',
      cgpa: '',
      division: '',
      mode: '',
      country: '',
      state: '',
      tenthcertificate: '',
      twelfthcertificate: '',
      ugcertificate: '',
      pgcertificate: '',
      mphilcertificate: '',
    }]);
    openSection(`qualifications-${nextIndex}`);
  };
  const updateProfDetail = (f: keyof Profile['professionalDetails'], v: string) => {
    setProfile((p) => ({ ...p, professionalDetails: { ...p.professionalDetails, [f]: v } }));
  };

  const updateEntranceTest = (exam: 'net' | 'set' | 'gate' | 'jrf' | 'other', field: string, v: string) => {
    setProfile((p) => {
      const et = { ...p.entranceTests };
      if (exam === 'other') {
        (et as any).other = v;
      } else {
        (et[exam] as any) = { ...(et[exam] as any), [field]: v };
      }
      return { ...p, entranceTests: et };
    });
  };

  const addWorkExp = () => set('workExperiences', [...profile.workExperiences, { institutionName: '', designation: '', department: '', fromDate: '', toDate: '', totalDuration: '', natureOfAppointment: '', reasonForLeaving: '' }]);
  const updateWorkExp = (i: number, f: keyof WorkExperience, v: string) => {
    const w = [...profile.workExperiences]; w[i] = { ...w[i], [f]: v }; set('workExperiences', w);
  };
  const removeWorkExp = (i: number) => set('workExperiences', profile.workExperiences.filter((_, idx) => idx !== i));
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

  const handleFileUpload = async (
    arg1: React.ChangeEvent<HTMLInputElement> | number,
    arg2?: string,
    arg3?: File,
  ) => {
    setUploadError('');
    const file = typeof arg1 === 'number' ? arg3 : arg1.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`"${file.name}" exceeds the 5 MB limit. Please upload a smaller file.`);
      if (typeof arg1 !== 'number') arg1.target.value = '';
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/profile/me/attachment', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const att: Attachment = res.data.attachment;
      if (typeof arg1 === 'number' && arg2) {
        set('qualifications', profile.qualifications.map((qualification, index) => (
          index === arg1 ? { ...qualification, [arg2]: att.url } : qualification
        )));
      } else {
        set('media', { ...profile.media, attachments: [...profile.media.attachments, att] });
      }
    } catch (err: any) {
      setUploadError(err?.response?.data?.message ?? 'Upload failed.');
    }
    if (typeof arg1 !== 'number') arg1.target.value = '';
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

  const handleDocumentUpload = async (docKey: keyof Profile['documents'], event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(`"${file.name}" exceeds the 5 MB limit. Please upload a smaller file.`);
      event.target.value = '';
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post(`/profile/me/document/${docKey}`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      set('documents', { ...profile.documents, [docKey]: res.data.fileUrl });
    } catch (err: any) {
      setUploadError(err?.response?.data?.message ?? 'Upload failed.');
    }
    event.target.value = '';
  };

  const removeDocument = (docKey: keyof Profile['documents']) => {
    set('documents', { ...profile.documents, [docKey]: '' });
  };

  const removeAttachment = (i: number) => set('media', { ...profile.media, attachments: profile.media.attachments.filter((_, idx) => idx !== i) });

  return (
    <div style={{ width: 'calc(100% - 340px)', maxWidth: 'none' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ flex: 1, display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              <button onClick={() => setActiveTab('basic')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'basic' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'basic' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Basic Information
              </button>
              <button onClick={() => setActiveTab('professionalDetails')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'professionalDetails' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'professionalDetails' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Professional Details
              </button>
              <button onClick={() => setActiveTab('entranceTests')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'entranceTests' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'entranceTests' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Entrance / Eligibility Tests
              </button>
              <button onClick={() => setActiveTab('workExperiences')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'workExperiences' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'workExperiences' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Work Experience ({profile.workExperiences.length})
              </button>
              <button onClick={() => setActiveTab('qualifications')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'qualifications' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'qualifications' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Qualifications ({profile.qualifications.length})
              </button>
              <button onClick={() => setActiveTab('publications')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'publications' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'publications' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Publications ({savedProfile.publications.length})
              </button>
              <button onClick={() => setActiveTab('projects')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'projects' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'projects' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Research Projects ({savedProfile.projects.length})
              </button>
              {profile.customDetails.map((customDetail, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(`custom-${index}`)}
                  style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === `custom-${index}` ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === `custom-${index}` ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  {!customDetail.isVisible && <EyeOff size={12} color="var(--color-text-light)" />}
                  {customDetail.sectionTitle || `Section ${index + 1}`}
                </button>
              ))}
              <button onClick={() => setActiveTab('media')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'media' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'media' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Media & Attachments
              </button>
              <button onClick={() => setActiveTab('documents')} style={{ padding: '0.75rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: activeTab === 'documents' ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: activeTab === 'documents' ? '2px solid var(--color-primary)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                Documents
              </button>
            </div>

            <div style={{ flexShrink: 0, paddingLeft: '0.5rem', borderLeft: '1px solid var(--color-border)', marginLeft: '0.5rem' }}>
              <button
                onClick={addCustom}
                style={{ padding: '0.5rem 0.875rem', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary-light)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = 'var(--color-primary)';
                  event.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'var(--color-primary-light)';
                  event.currentTarget.style.color = 'var(--color-primary)';
                }}
                title="Add Custom Section"
              >
                <Plus size={16} /> Add Section
              </button>
            </div>
          </div>

          {activeTab === 'basic' && (
            <BasicInformationSection
              profile={profile}
              editMode={basicEditMode}
              onToggleEdit={() => setBasicEditMode((prev) => !prev)}
              onOpenPasswordModal={() => setShowPasswordModal(true)}
              onSetField={set}
              onPhotoUpload={handlePhotoUpload}
              onAddInterest={(interest) => set('interests', [...profile.interests, interest])}
              onRemoveInterest={(index) => set('interests', profile.interests.filter((_, currentIndex) => currentIndex !== index))}
            />
          )}

          {activeTab === 'professionalDetails' && (
            <ProfessionalDetailsSection profile={profile} onUpdate={updateProfDetail} />
          )}

          {activeTab === 'entranceTests' && (
            <EntranceEligibilityTestsSection profile={profile} onUpdate={updateEntranceTest} />
          )}

          {activeTab === 'workExperiences' && (
            <WorkExperienceSection
              profile={profile}
              onAdd={addWorkExp}
              onUpdate={updateWorkExp}
              onRemove={removeWorkExp}
              isExpanded={isExpanded}
              onToggle={toggleSection}
            />
          )}

          {activeTab === 'qualifications' && (
            <QualificationsSection
              profile={profile}
              onAdd={addQual}
              onUpdate={updateQual}
              onRemove={removeQual}
              onUploadCertificate={handleFileUpload}
              isExpanded={isExpanded}
              onToggle={toggleSection}
            />
          )}

          {activeTab === 'publications' && (
            <PublicationsSection
              profile={profile}
              onAdd={addPub}
              onUpdate={updatePub}
              onRemove={removePub}
              isExpanded={isExpanded}
              onToggle={toggleSection}
            />
          )}

          {activeTab === 'projects' && (
            <ResearchProjectsSection
              profile={profile}
              onAdd={addProj}
              onUpdate={updateProj}
              onRemove={removeProj}
              isExpanded={isExpanded}
              onToggle={toggleSection}
            />
          )}

          {activeTab.startsWith('custom-') && (
            <div>
              {(() => {
                const index = parseInt(activeTab.split('-')[1], 10);
                const customDetail = profile.customDetails[index];
                if (!customDetail) return null;
                const cardKey = `custom-${index}`;
                const preview = customDetail.content.trim().replace(/\s+/g, ' ').slice(0, 90);
                const summary = `${customDetail.isVisible ? 'Visible' : 'Hidden'}${preview ? ` · ${preview}` : ''}`;

                return (
                  <CollapsibleEditorCard
                    key={cardKey}
                    title={customDetail.sectionTitle || `Section ${index + 1}`}
                    summary={summary || 'Add section content'}
                    expanded={isExpanded(cardKey)}
                    onToggle={() => toggleSection(cardKey)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8125rem', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                        {customDetail.isVisible ? <Eye size={14} color="var(--color-primary)" /> : <EyeOff size={14} color="var(--color-text-light)" />}
                        <span>{customDetail.isVisible ? 'Visible on Profile' : 'Hidden from Profile'}</span>
                        <input type="checkbox" checked={customDetail.isVisible} onChange={() => updateCustom(index, 'isVisible', !customDetail.isVisible)} style={{ display: 'none' }} />
                      </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Section Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <input className="form-input" value={customDetail.sectionTitle} onChange={(event) => updateCustom(index, 'sectionTitle', event.target.value)} placeholder="e.g. Awards, Teaching Philosophy…" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Content <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                        <textarea className="form-textarea" value={customDetail.content} onChange={(event) => updateCustom(index, 'content', event.target.value)} placeholder="Content…" style={{ minHeight: 200 }} />
                      </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
                      <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => removeCustom(index)} type="button">
                        <Trash2 size={13} /> Remove Section
                      </button>
                    </div>
                  </CollapsibleEditorCard>
                );
              })()}
            </div>
          )}

          {activeTab === 'media' && (
            <MediaAttachmentsSection
              profile={profile}
              uploadError={uploadError}
              onUploadFile={handleFileUpload}
              onAddVideoEmbed={addVideoEmbed}
              onUpdateVideoEmbed={updateVideoEmbed}
              onRemoveVideoEmbed={removeVideoEmbed}
              onRemoveAttachment={removeAttachment}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsSection
              profile={profile}
              uploadError={uploadError}
              onUploadFile={handleDocumentUpload}
              onRemoveDocument={removeDocument}
            />
          )}
        </div>

        <div style={{ position: 'fixed', top: '5rem', right: '1.5rem', width: '280px', zIndex: 10, maxHeight: 'calc(100vh - 6rem)', overflowY: 'auto' }}>
          <VisibilityPanel
            visibility={profile.visibility}
            onToggle={toggleVisibility}
            saving={visSaving}
          />
        </div>
      </div>

      {showShare && user ? (
        <ShareModal userId={user?.id ?? ''} onClose={() => setShowShare(false)} />
      ) : null}

      {showPasswordModal && (
        <UpdatePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
