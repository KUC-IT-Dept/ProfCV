import React, { useState } from 'react';
import { Plus, Trash2, Upload, User, X } from 'lucide-react';
import { Profile } from './profileBuilderTypes';

const DEFAULT_INTERESTS = ['AI', 'ML', 'IoT', 'MERN', 'HCI', 'Embedded Systems', 'Strategic Logic', 'Inclusive Design'];

type PersonalInformationSectionProps = {
  profile: Profile;
  photoPreviewUrl?: string | null;
  editMode: boolean;
  onToggleEdit: () => void;
  onOpenPasswordModal: () => void;
  onSetField: (key: keyof Profile, value: any) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (index: number) => void;
};

function SubjectsEditor({
  subjects,
  onAddSubject,
  onRemoveSubject,
}: {
  subjects: string[];
  onAddSubject: (subject: string) => void;
  onRemoveSubject: (index: number) => void;
}) {
  const [subjectInput, setSubjectInput] = useState('');

  const handleAddSubject = () => {
    const trimmed = subjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      onAddSubject(trimmed);
      setSubjectInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddSubject();
      e.preventDefault();
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter subject name..."
          value={subjectInput}
          onChange={(e) => setSubjectInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-input"
          style={{ flex: 1 }}
        />
        <button
          className="btn btn-primary"
          onClick={handleAddSubject}
          type="button"
          style={{ flexShrink: 0 }}
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {subjects.length > 0 && (
        <div>
          <label className="form-label">Added Subjects</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {subjects.map((subject, index) => (
              <div
                key={`${subject}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  borderRadius: '99px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                }}
              >
                {subject}
                <button
                  onClick={() => onRemoveSubject(index)}
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function InterestsEditor({
  interests,
  onAddInterest,
  onRemoveInterest,
}: {
  interests: string[];
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (index: number) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customValue, setCustomValue] = useState('');

  const filteredInterests = DEFAULT_INTERESTS.filter(
    (interest) => interest.toLowerCase().includes(searchTerm.toLowerCase()) && !interests.includes(interest),
  );

  const handleAddDefault = (interest: string) => {
    onAddInterest(interest);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleAddCustom = () => {
    const trimmed = customValue.trim();
    if (trimmed && !interests.includes(trimmed)) {
      onAddInterest(trimmed);
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
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setShowDropdown(true)}
            className="form-input"
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={() => setShowDropdown((prev) => !prev)} type="button" style={{ flexShrink: 0 }}>
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
                  onMouseEnter={(event) => ((event.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg)')}
                  onMouseLeave={(event) => ((event.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
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
                    onChange={(event) => setCustomValue(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleAddCustom()}
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
            {interests.map((interest, index) => (
              <div key={`${interest}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '99px', fontSize: '0.8125rem', fontWeight: 500 }}>
                {interest}
                <button onClick={() => onRemoveInterest(index)} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

export default function PersonalInformationSection({
  profile,
  photoPreviewUrl,
  editMode,
  onToggleEdit,
  onOpenPasswordModal,
  onSetField,
  onPhotoUpload,
  onAddInterest,
  onRemoveInterest,
}: PersonalInformationSectionProps) {
  const displayPhoto = photoPreviewUrl || profile.photo;
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Basic Information</h2>
          <p style={{ fontSize: '0.8125rem', margin: 0 }}>View your details, then click Edit to make changes.</p>
        </div>
        <button className="btn btn-secondary" type="button" onClick={onToggleEdit}>
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>

      {!editMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {displayPhoto ? <img src={displayPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--color-text-light)" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{profile.name || 'Unnamed profile'}</h3>
              <p style={{ margin: 0 }}>{profile.headline}</p>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
            <div className="card" style={{ padding: '1rem', minHeight: '360px', maxHeight: '360px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.75rem' }}>
                Personal Information
              </div>

              <div style={{ display: 'grid', rowGap: '0.9rem', color: 'var(--color-text)' }}>
                {[
                  ['Full Name', profile.name],
                  ['Date of Birth', profile.dob],
                  ['Gender', profile.gender],
                  ['Blood Group', profile.bloodGroup],
                  ['Nationality', profile.nationality],
                  ['State & City', profile.stateCity],
                  ['Permanent Address', profile.permanentAddress],
                  ['Current Address', profile.currentAddress],
                  ['Phone Number', profile.phoneNumber || profile.mobileNumber],
                  ['Mobile Number', profile.mobileNumber],
                  ['Alternate Phone', profile.alternatePhone],
                  ['Official Email', profile.officialEmail],
                  ['Personal Email', profile.personalEmail],
                  ['Aadhaar', profile.aadhaar],
                  ['Passport', profile.passport],
                  ['Religion', profile.religion],
                  ['Category', profile.category],
                  ['Sub-category', profile.subCategory],
                  ['Differently Abled', profile.differentlyAbled],
                  ['Marital Status', profile.maritalStatus],
                  ['Spouse', profile.spouse],
                  ['Emergency Contact', profile.emergencyContact],
                  ['PAN Number', profile.panNumber],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-light)', minWidth: 150 }}>{label}:</span>
                    <span style={{ textAlign: 'right', minWidth: 0 }}>{value || 'Not set'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '1rem', minHeight: '360px', maxHeight: '360px', overflowY: 'auto' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginBottom: '0.25rem' }}>Interests</div>
              {profile.interests.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profile.interests.map((interest, index) => (
                    <span key={`${interest}-${index}`} style={{ padding: '0.35rem 0.65rem', borderRadius: '99px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.8125rem' }}>{interest}</span>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--color-text)' }}>No interests added yet</div>
              )}
            </div>
          </div>

          <div>
            <button type="button" onClick={onOpenPasswordModal} style={{ backgroundColor: 'red', width: '220px', color: 'white', textAlign: 'center', padding: '6px 16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
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
                {displayPhoto ? <img src={displayPhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--color-text-light)" />}
              </div>
              <div>
                <label htmlFor="photo-upload" className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: '0.375rem', display: 'inline-flex' }}>
                  <Upload size={14} /> {displayPhoto ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input id="photo-upload" type="file" accept="image/*" onChange={onPhotoUpload} style={{ display: 'none' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>Accepted: JPG, PNG, GIF. Max 2MB.</p>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={profile.name} onChange={(event) => onSetField('name', event.target.value)} placeholder="e.g. Dr. John Smith" />
          </div>
          <div className="form-group">
            <label className="form-label">Professional Headline</label>
            <input
              className="form-input"
              value={profile.headline}
              onChange={(event) => onSetField('headline', event.target.value)}
              placeholder="e.g. Associate Professor of Computer Science"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea className="form-textarea" value={profile.bio} onChange={(event) => onSetField('bio', event.target.value)} placeholder="Brief professional biography…" style={{ minHeight: 120 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Subjects Taught</label>
            <SubjectsEditor
              subjects={profile.subjects}
              onAddSubject={(subject) => onSetField('subjects', [...profile.subjects, subject])}
              onRemoveSubject={(index) => onSetField('subjects', profile.subjects.filter((_, i) => i !== index))}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-input" value={profile.dob} onChange={(event) => onSetField('dob', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-input" value={profile.gender} onChange={(event) => onSetField('gender', event.target.value)}>
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
            <input className="form-input" value={profile.phoneNumber} onChange={(event) => onSetField('phoneNumber', event.target.value)} placeholder="e.g. +1 234 567 890" />
          </div>
          <div className="form-group">
            <label className="form-label">Office / Residential Address</label>
            <textarea className="form-textarea" value={profile.address} onChange={(event) => onSetField('address', event.target.value)} placeholder="Enter full address…" style={{ minHeight: 80 }} />
          </div>
          <div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <input className="form-input" value={profile.bloodGroup} onChange={(event) => onSetField('bloodGroup', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Nationality</label>
              <input className="form-input" value={profile.nationality} onChange={(event) => onSetField('nationality', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">State & City</label>
              <input className="form-input" value={profile.stateCity} onChange={(event) => onSetField('stateCity', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Permanent Address</label>
              <textarea className="form-textarea" value={profile.permanentAddress} onChange={(event) => onSetField('permanentAddress', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Current Address</label>
              <textarea className="form-textarea" value={profile.currentAddress} onChange={(event) => onSetField('currentAddress', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input className="form-input" value={profile.mobileNumber} onChange={(event) => onSetField('mobileNumber', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Alternate Phone</label>
              <input className="form-input" value={profile.alternatePhone} onChange={(event) => onSetField('alternatePhone', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input className="form-input" value={profile.officialEmail} onChange={(event) => onSetField('officialEmail', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Personal Email</label>
              <input className="form-input" value={profile.personalEmail} onChange={(event) => onSetField('personalEmail', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar</label>
              <input className="form-input" value={profile.aadhaar} onChange={(event) => onSetField('aadhaar', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Passport</label>
              <input className="form-input" value={profile.passport} onChange={(event) => onSetField('passport', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Religion</label>
              <input className="form-input" value={profile.religion} onChange={(event) => onSetField('religion', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-input" value={profile.category} onChange={(event) => onSetField('category', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Sub-category</label>
              <input className="form-input" value={profile.subCategory} onChange={(event) => onSetField('subCategory', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Differently Abled</label>
              <input className="form-input" value={profile.differentlyAbled} onChange={(event) => onSetField('differentlyAbled', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <input className="form-input" value={profile.maritalStatus} onChange={(event) => onSetField('maritalStatus', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Spouse</label>
              <input className="form-input" value={profile.spouse} onChange={(event) => onSetField('spouse', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input className="form-input" value={profile.emergencyContact} onChange={(event) => onSetField('emergencyContact', event.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input className="form-input" value={profile.panNumber} onChange={(event) => onSetField('panNumber', event.target.value)} />
            </div>
            <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Interests</label>
            <InterestsEditor interests={profile.interests} onAddInterest={onAddInterest} onRemoveInterest={onRemoveInterest} />
          </div>
          <button type="button" onClick={onOpenPasswordModal} style={{ backgroundColor: 'red', width: '220px', color: 'white', textAlign: 'center', padding: '6px 16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
            Update Password
          </button>
        </div>
      )}
    </div>
  );
}
