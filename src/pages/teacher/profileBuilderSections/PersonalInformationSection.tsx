import React, { useState } from 'react';
import { Plus, Trash2, Upload, User } from 'lucide-react';
import { Profile } from './profileBuilderTypes';

const DEFAULT_INTERESTS = ['AI', 'ML', 'IoT', 'MERN', 'HCI', 'Embedded Systems', 'Strategic Logic', 'Inclusive Design'];

type PersonalInformationSectionProps = {
  profile: Profile;
  editMode: boolean;
  onToggleEdit: () => void;
  onOpenPasswordModal: () => void;
  onSetField: (key: keyof Profile, value: any) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (index: number) => void;
};

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
  editMode,
  onToggleEdit,
  onOpenPasswordModal,
  onSetField,
  onPhotoUpload,
  onAddInterest,
  onRemoveInterest,
}: PersonalInformationSectionProps) {
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', color: 'var(--color-text)' }}>
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
                {profile.photo ? <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={32} color="var(--color-text-light)" />}
              </div>
              <div>
                <label htmlFor="photo-upload" className="btn btn-secondary" style={{ cursor: 'pointer', marginBottom: '0.375rem', display: 'inline-flex' }}>
                  <Upload size={14} /> {profile.photo ? 'Change Photo' : 'Upload Photo'}
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
            <input className="form-input" value={profile.headline} onChange={(event) => onSetField('headline', event.target.value)} placeholder="e.g. Associate Professor of Computer Science" />
          </div>
          <div className="form-group">
            <label className="form-label">Biography</label>
            <textarea className="form-textarea" value={profile.bio} onChange={(event) => onSetField('bio', event.target.value)} placeholder="Brief professional biography…" style={{ minHeight: 120 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Subjects Taught (comma-separated)</label>
            <input className="form-input" value={profile.subjects.join(', ')} onChange={(event) => onSetField('subjects', event.target.value.split(',').map((subject) => subject.trim()).filter(Boolean))} placeholder="e.g. Data Structures, Machine Learning" />
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
