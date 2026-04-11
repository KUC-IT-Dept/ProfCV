
import { Plus, Trash2 } from 'lucide-react';
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

const YEAR_OPTIONS = Array.from({ length: 100 }, (_, index) => `${1950 + index}`);
const DIVISION_OPTIONS = ['First Class with Distinction', 'First Class', 'Second Class', 'Third Class', 'Pass'];
const MODE_OPTIONS = ['regular', 'distance'];
const COUNTRY_OPTIONS = ['India', 'USA', 'UK', 'Germany', 'France', 'Australia', 'Other'];

export default function EducationalQualificationsSection({ profile, onAdd, onUpdate, onRemove, onUploadCertificate, isExpanded, onToggle }: EducationalQualificationsSectionProps) {
  return (
    <div>
      {profile.qualifications.map((qualification, index) => {
        const cardKey = `qualifications-${index}`;
        const summary = [qualification.degree, qualification.institution, qualification.yearofpassing].filter(Boolean).join(' · ') || 'Add qualification details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={qualification.degree || `Qualification ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group"><label className="form-label">Degree / Qualification</label><input className="form-input" value={qualification.degree} onChange={(event) => onUpdate(index, 'degree', event.target.value)} placeholder="e.g. B.Sc, M.Sc, Ph.D." /></div>
              <div className="form-group"><label className="form-label">Specialisation</label><input className="form-input" value={qualification.specialisation} onChange={(event) => onUpdate(index, 'specialisation', event.target.value)} placeholder="e.g. Computer Science" /></div>
              <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={qualification.institution} onChange={(event) => onUpdate(index, 'institution', event.target.value)} placeholder="Institution name" /></div>
              <div className="form-group"><label className="form-label">University</label><input className="form-input" value={qualification.university} onChange={(event) => onUpdate(index, 'university', event.target.value)} placeholder="University name" /></div>
              <SelectField label="Year of Passing" options={YEAR_OPTIONS} value={qualification.yearofpassing} onChange={(value) => onUpdate(index, 'yearofpassing', value)} placeholder="Select year of passing" />
              <div className="form-group"><label className="form-label">CGPA / Percentage</label><input className="form-input" value={qualification.cgpa} onChange={(event) => onUpdate(index, 'cgpa', event.target.value)} placeholder="9.38" /></div>
              <SelectField label="Division / Class" options={DIVISION_OPTIONS} value={qualification.division} onChange={(value) => onUpdate(index, 'division', value)} placeholder="Select division/class" />
              <SelectField label="Mode of Study" options={MODE_OPTIONS} value={qualification.mode} onChange={(value) => onUpdate(index, 'mode', value)} placeholder="Select mode of study" />
              <SelectField label="Country" options={COUNTRY_OPTIONS} value={qualification.country} onChange={(value) => onUpdate(index, 'country', value)} placeholder="Select country" />
              <div className="form-group"><label className="form-label">State / Province</label><input className="form-input" value={qualification.state} onChange={(event) => onUpdate(index, 'state', event.target.value)} placeholder="State of institution" /></div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FileField label="Upload 10th certificate" name="tenthcertificatefile" selectedFile={null} onFileSelect={(_, file) => onUploadCertificate(index, 'tenthcertificate', file)} />
              <FileField label="Upload 12th certificate" name="twelfthcertificatefile" selectedFile={null} onFileSelect={(_, file) => onUploadCertificate(index, 'twelfthcertificate', file)} />
              <FileField label="Upload Graduation certificate" name="ugcertificatefile" selectedFile={null} onFileSelect={(_, file) => onUploadCertificate(index, 'ugcertificate', file)} />
              <FileField label="Upload Post-Graduation certificate" name="pgcertificatefile" selectedFile={null} onFileSelect={(_, file) => onUploadCertificate(index, 'pgcertificate', file)} />
              <FileField label="Upload M.Phil. certificate" name="mphilcertificatefile" selectedFile={null} onFileSelect={(_, file) => onUploadCertificate(index, 'mphilcertificate', file)} />
            </div>

            <button className="btn btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove</button>
          </ProfileBuilderSectionCard>
        );
      })}
      <button className="btn btn-secondary" onClick={onAdd} type="button"><Plus size={14} /> Add Qualification</button>
    </div>
  );
}
