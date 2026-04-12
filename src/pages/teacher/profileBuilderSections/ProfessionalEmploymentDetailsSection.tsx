import { Trash2 } from 'lucide-react';
import type { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';
import SelectField from '../../../components/SelectField';

type Props = {
  profile: Profile;
  onUpdate: (f: keyof Profile['professionalDetails'], v: string) => void;
};

export default function ProfessionalEmploymentDetailsSection({
  profile,
  onUpdate
}: Props) {
  const prof = profile.professionalDetails;

  const APPOINTMENT_OPTIONS = [
    'Regular', 'Contract', 'Guest', 'Adjunct', 'Visiting',
    'Assistant Professor', 'Associate Professor', 'Professor', 'Senior Professor'
  ];

  const INSTITUTION_TYPES = [
    'Government', 'Aided', 'Private', 'Deemed', 'Central University'
  ];

  const clearFields: Array<keyof Profile['professionalDetails']> = [
    'employeeId',
    'designation',
    'department',
    'institutionName',
    'affiliatedUniversity',
    'institutionType',
    'natureOfAppointment',
    'dateOfJoining',
    'dateOfConfirmation',
    'payBand',
    'bankAccountDetails',
    'pfNumber',
    'serviceBookNumber',
    'dateOfFirstPromotion',
    'natureOfFirstAppointment',
    'firstPayBand',
    'dateOfSecondPromotion',
    'natureOfSecondAppointment',
    'secondPayBand',
    'dateOfThirdPromotion',
    'natureOfThirdAppointment',
    'thirdPayBand'
  ];

  const clearProfessionalDetails = () => {
    clearFields.forEach((field) => onUpdate(field, ''));
  };

  return (
    <SectionShell
      title="Professional / Employment Details"
      description="Employment, payroll, and promotion details for your public profile and records."
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
            value={prof.institutionName || ''}
            onChange={(e) => onUpdate('institutionName', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">University Affiliation</label>
          <input
            className="form-input"
            value={prof.affiliatedUniversity || ''}
            onChange={(e) => onUpdate('affiliatedUniversity', e.target.value)}
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
          value={prof.natureOfAppointment || ''}
          onChange={(v) => onUpdate('natureOfAppointment', v)}
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
          <label className="form-label">Pay Band</label>
          <input
            className="form-input"
            value={prof.payBand || ''}
            onChange={(e) => onUpdate('payBand', e.target.value)}
          />
        </div>

        {/* BANK DETAILS */}
        <div className="form-group">
          <label className="form-label">Bank Account Details</label>
          <input
            className="form-input"
            value={prof.bankAccountDetails || ''}
            onChange={(e) => onUpdate('bankAccountDetails', e.target.value)}
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
          onClick={clearProfessionalDetails}
        >
          <Trash2 size={16} />
          Clear Professional Details
        </button>

      </div>

      {/* PROMOTIONS SECTION */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Promotional Details</h3>

        <div className="grid md:grid-cols-3 gap-4 mb-4 border p-4 rounded">
          <div>
            <label>Date of First Promotion</label>
            <input
              type="date"
              className="form-input"
              value={prof.dateOfFirstPromotion || ''}
              onChange={(e) => onUpdate('dateOfFirstPromotion', e.target.value)}
            />
          </div>

          <SelectField
            label="Nature (First Promotion)"
            options={APPOINTMENT_OPTIONS}
            value={prof.natureOfFirstAppointment || ''}
            onChange={(v) => onUpdate('natureOfFirstAppointment', v)}
          />

          <div>
            <label>First Pay Band</label>
            <input
              className="form-input"
              value={prof.firstPayBand || ''}
              onChange={(e) => onUpdate('firstPayBand', e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4 border p-4 rounded">
          <div>
            <label>Date of Second Promotion</label>
            <input
              type="date"
              className="form-input"
              value={prof.dateOfSecondPromotion || ''}
              onChange={(e) => onUpdate('dateOfSecondPromotion', e.target.value)}
            />
          </div>

          <SelectField
            label="Nature (Second Promotion)"
            options={APPOINTMENT_OPTIONS}
            value={prof.natureOfSecondAppointment || ''}
            onChange={(v) => onUpdate('natureOfSecondAppointment', v)}
          />

          <div>
            <label>Second Pay Band</label>
            <input
              className="form-input"
              value={prof.secondPayBand || ''}
              onChange={(e) => onUpdate('secondPayBand', e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4 border p-4 rounded">
          <div>
            <label>Date of Third Promotion</label>
            <input
              type="date"
              className="form-input"
              value={prof.dateOfThirdPromotion || ''}
              onChange={(e) => onUpdate('dateOfThirdPromotion', e.target.value)}
            />
          </div>

          <SelectField
            label="Nature (Third Promotion)"
            options={APPOINTMENT_OPTIONS}
            value={prof.natureOfThirdAppointment || ''}
            onChange={(v) => onUpdate('natureOfThirdAppointment', v)}
          />

          <div>
            <label>Third Pay Band</label>
            <input
              className="form-input"
              value={prof.thirdPayBand || ''}
              onChange={(e) => onUpdate('thirdPayBand', e.target.value)}
            />
          </div>
        </div>
      </div>

    </SectionShell>
  );
}