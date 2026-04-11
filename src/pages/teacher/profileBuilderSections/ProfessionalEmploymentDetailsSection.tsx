import { Plus, Trash2 } from 'lucide-react';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';
import SelectField from '../../../components/SelectField';

type Props = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (
    f: keyof Profile['professionalDetails'],
    v: any
  ) => void;
  isExpanded: boolean;
  onToggle: () => void;
};

export default function ProfessionalEmploymentDetailsSection({
  profile,
  onAdd,
  onUpdate,
  isExpanded,
  onToggle
}: Props) {
  const prof = profile.professionalDetails;

  const APPOINTMENT_OPTIONS = [
    'Regular', 'Contract', 'Guest', 'Adjunct', 'Visiting',
    'Assistant Professor', 'Associate Professor', 'Professor', 'Senior Professor'
  ];

  const INSTITUTION_TYPES = [
    'Government', 'Aided', 'Private', 'Deemed', 'Central University'
  ];

  const PROMOTION_LABELS = ['First', 'Second', 'Third'];

  // ✅ Handle promotion updates
  const handlePromotionChange = (
    index: number,
    field: 'date' | 'nature' | 'payScale',
    value: string
  ) => {
    const updated = [...(prof.promotions || [])];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onUpdate('promotions', updated);
  };

  return (
    <SectionShell
      label="Professional / Employment Details"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* BASIC DETAILS */}
        <div className="form-group">
          <label className="form-label">Employee ID / Staff Code</label>
          <input
            className="form-input"
            value={prof.employeeId || ''}
            onChange={(e) => onUpdate('employeeId', e.target.value)}
          />
        </div>

        <SelectField
          label="Designation"
          options={['Professor', 'Associate Professor', 'Assistant Professor']}
          value={prof.designation || ''}
          onChange={(v) => onUpdate('designation', v)}
        />

        <SelectField
          label="Department"
          options={['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Other']}
          value={prof.department || ''}
          onChange={(v) => onUpdate('department', v)}
        />

        <div className="form-group">
          <label className="form-label">College / Institution Name</label>
          <input
            className="form-input"
            value={prof.collegeName || ''}
            onChange={(e) => onUpdate('collegeName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">University Affiliation</label>
          <input
            className="form-input"
            value={prof.universityAffiliation || ''}
            onChange={(e) => onUpdate('universityAffiliation', e.target.value)}
          />
        </div>

        <SelectField
          label="Type of Institution"
          options={INSTITUTION_TYPES}
          value={prof.institutionType || ''}
          onChange={(v) => onUpdate('institutionType', v)}
        />

        <SelectField
          label="Nature of Appointment"
          options={APPOINTMENT_OPTIONS}
          value={prof.appointmentNature || ''}
          onChange={(v) => onUpdate('appointmentNature', v)}
        />

        <div className="form-group">
          <label className="form-label">Date of Joining</label>
          <input
            type="date"
            className="form-input"
            value={prof.dateOfJoining || ''}
            onChange={(e) => onUpdate('dateOfJoining', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date of Confirmation</label>
          <input
            type="date"
            className="form-input"
            value={prof.dateOfConfirmation || ''}
            onChange={(e) => onUpdate('dateOfConfirmation', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Pay Scale</label>
          <input
            className="form-input"
            value={prof.payScale || ''}
            onChange={(e) => onUpdate('payScale', e.target.value)}
          />
        </div>

        {/* BANK DETAILS */}
        <div className="form-group">
          <label className="form-label">Account Number</label>
          <input
            className="form-input"
            value={prof.accountNumber || ''}
            onChange={(e) => onUpdate('accountNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">IFSC Code</label>
          <input
            className="form-input"
            value={prof.ifscCode || ''}
            onChange={(e) => onUpdate('ifscCode', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Bank Name</label>
          <input
            className="form-input"
            value={prof.bankName || ''}
            onChange={(e) => onUpdate('bankName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Branch Name</label>
          <input
            className="form-input"
            value={prof.branchName || ''}
            onChange={(e) => onUpdate('branchName', e.target.value)}
          />
        </div>

        {/* PF + SERVICE */}
        <div className="form-group">
          <label className="form-label">PF Number</label>
          <input
            className="form-input"
            value={prof.pfNumber || ''}
            onChange={(e) => onUpdate('pfNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Service Book Number</label>
          <input
            className="form-input"
            value={prof.serviceBookNumber || ''}
            onChange={(e) => onUpdate('serviceBookNumber', e.target.value)}
          />
        </div>

        {/* CLEAR BUTTON */}
        <button
          type="button"
          className="text-blue-600 flex items-center gap-1"
          onClick={() => {
            onUpdate('promotions', []);
          }}
        >
          <Trash2 size={16} />
          Clear Professional Details
        </button>

      </div>

      {/* PROMOTIONS SECTION */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Promotional Details</h3>

        {(prof.promotions || []).map((promo, index) => (
          <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 border p-4 rounded">

            <div>
              <label>Date of {PROMOTION_LABELS[index]} Promotion</label>
              <input
                type="date"
                className="form-input"
                value={promo.date || ''}
                onChange={(e) =>
                  handlePromotionChange(index, 'date', e.target.value)
                }
              />
            </div>

            <SelectField
              label="Nature"
              options={APPOINTMENT_OPTIONS}
              value={promo.nature || ''}
              onChange={(v) =>
                handlePromotionChange(index, 'nature', v)
              }
            />

            <div>
              <label>New Pay Scale</label>
              <input
                className="form-input"
                value={promo.payScale || ''}
                onChange={(e) =>
                  handlePromotionChange(index, 'payScale', e.target.value)
                }
              />
            </div>

          </div>
        ))}

        {/* ADD PROMOTION */}
        <button
          className="btn btn-primary flex items-center mt-2"
          onClick={() =>
            onUpdate('promotions', [
              ...(prof.promotions || []),
              { date: '', nature: '', payScale: '' }
            ])
          }
        >
          <Plus size={16} className="mr-2" />
          Add Promotion
        </button>
      </div>
      
      {/* ADD EMPLOYMENT */}
      <button
        className="btn btn-primary mt-6 flex items-center"
        onClick={onAdd}
      >
        <Plus size={16} className="mr-2" />
        Add another employment record
      </button>

    </SectionShell>
  );
}