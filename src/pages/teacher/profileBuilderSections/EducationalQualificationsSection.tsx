import { Plus, Trash2, CheckCircle } from 'lucide-react';
import FileField from '../../../components/FileField';
import SelectField from '../../../components/SelectField';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type EducationalQualificationsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['qualifications'][number], value: string) => void;
  onRemove: (index: number) => void;
  onUploadCertificate: (index: number, field: string, file: File) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

const YEAR_OPTIONS = Array.from({ length: 100 }, (_, index) => `${new Date().getFullYear() - index}`);
const DIVISION_OPTIONS = ['First ', 'Second ', 'Third ', 'Pass'];
const MODE_OPTIONS = ['regular', 'distance'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Germany', 'France', 'Australia', 'Other'];
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
// Mapping the level to the specific field name for the certificate
const CERTIFICATE_MAPPING: Record<string, { label: string; field: string }> = {
  '10th': { label: '10th Certificate', field: 'tenthcertificate' },
  '12th': { label: '12th Certificate', field: 'twelfthcertificate' },
  'Undergraduate': { label: 'Graduation Certificate', field: 'ugcertificate' },
  'Postgraduate': { label: 'Post-Graduation Certificate', field: 'pgcertificate' },
  'M.Phil.': { label: 'M.Phil. Certificate', field: 'mphilcertificate' },
  'Ph.D.': { label: 'Ph.D. Certificate', field: 'phdcertificate' },
};

export default function EducationalQualificationsSection({
  profile,
  onAdd,
  onUpdate,
  onRemove,
  onUploadCertificate,
  isExpanded,
  onToggle
}: EducationalQualificationsSectionProps) {

  return (
    <div className="space-y-4">
      {profile.qualifications.map((qualification, index) => {
        const cardKey = `qualifications-${index}`;
        const summary = [
          qualification.educationlevel,
          qualification.institution,
          qualification.yearofpassing
        ].filter(Boolean).join(' · ') || 'Add qualification details';

        const certInfo = CERTIFICATE_MAPPING[qualification.educationlevel];

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={qualification.educationlevel || `Qualification ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <SelectField
                label="Qualification type"
                options={['10th', '12th', 'Undergraduate', 'Postgraduate', 'M.Phil.', 'Ph.D.', 'Other']}
                value={qualification.educationlevel}
                onChange={(value) => onUpdate(index, 'educationlevel', value)}
                placeholder="Select education level"
              />

              <div className="form-group">
                <label className="form-label">Specialisation</label>
                <input
                  className="form-input"
                  value={qualification.specialisation}
                  onChange={(e) => onUpdate(index, 'specialisation', e.target.value)}
                  placeholder="e.g. Computer Science"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institution/University Name</label>
                <input
                  className="form-input"
                  value={qualification.institution}
                  onChange={(e) => onUpdate(index, 'institution', e.target.value)}
                  placeholder="Institution name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Board/University</label>
                <input
                  className="form-input"
                  value={qualification.university}
                  onChange={(e) => onUpdate(index, 'university', e.target.value)}
                  placeholder="University name"
                />
              </div>

              <SelectField label="Year of Passing" options={YEAR_OPTIONS} value={qualification.yearofpassing} onChange={(value) => onUpdate(index, 'yearofpassing', value)} placeholder="Select year" />
              <div className="form-group"><label className="form-label">Percentage/CGPA</label><input className="form-input" value={qualification.cgpa} onChange={(e) => onUpdate(index, 'cgpa', e.target.value)} placeholder="9.38" /></div>
              <SelectField label="Division" options={DIVISION_OPTIONS} value={qualification.division} onChange={(value) => onUpdate(index, 'division', value)} placeholder="Select division" />
              <SelectField label="Mode" options={MODE_OPTIONS} value={qualification.mode} onChange={(value) => onUpdate(index, 'mode', value)} placeholder="Select mode" />
              <SelectField label="Country" options={COUNTRY_OPTIONS} value={qualification.country} onChange={(value) => onUpdate(index, 'country', value)} placeholder="Select country" />
              <div className="form-group">
                <label className="form-label">State / Province</label>
                {qualification.country === 'India' ? (
                  <SelectField
                    label="State / Province"
                    options={INDIAN_STATES}
                    value={qualification.state}
                    onChange={(value) => onUpdate(index, 'state', value)}
                    placeholder="Select State"
                  />
                ) : (
                  <input
                    className="form-input"
                    value={qualification.state}
                    onChange={(e) => onUpdate(index, 'state', e.target.value)}
                    placeholder="State of institution"
                  />
                )}
              </div>
            </div>

            {/* CONDITIONAL UPLOAD AREA */}
            <div style={{ marginTop: '1.25rem' }}>
              {certInfo ? (
                <div className="space-y-2">
                  <FileField
                    label={`Upload ${certInfo.label}`}
                    name={`${certInfo.field}file`}
                    selectedFile={null}
                    onFileSelect={(_, file) => onUploadCertificate(index, certInfo.field, file)}
                  />
                  {qualification[certInfo.field] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', marginTop: '0.25rem', color: '#059669' }}>
                      <CheckCircle size={14} />
                      <a
                        href={`${import.meta.env.VITE_API_BASE_URL || ''}${qualification[certInfo.field]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#059669', fontWeight: 600, textDecoration: 'underline' }}
                      >
                        View uploaded certificate
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center', color: '#666', fontSize: '0.875rem' }}>
                  Please select a valid Qualification Type to enable certificate upload.
                </div>
              )}
            </div>

            <button
              className="btn btn-danger"
              onClick={() => onRemove(index)}
              style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}
            >
              Remove <Trash2 size={16} style={{ marginLeft: '0.5rem' }} />
            </button>
          </ProfileBuilderSectionCard>
        );
      })}

      <button className="btn btn-primary" onClick={onAdd} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center' }}>
        <Plus size={16} style={{ marginRight: '0.5rem' }} />
        Add Qualification
      </button>
    </div>
  );
}