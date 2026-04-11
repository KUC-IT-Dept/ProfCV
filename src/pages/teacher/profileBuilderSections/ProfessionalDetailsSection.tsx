import React from 'react';
import { Profile } from './profileBuilderTypes';

type ProfessionalDetailsSectionProps = {
  profile: Profile;
  onUpdate: (field: keyof Profile['professionalDetails'], value: string) => void;
};

export default function ProfessionalDetailsSection({ profile, onUpdate }: ProfessionalDetailsSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Professional Details</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Employee ID / Staff Code</label>
            <input className="form-input" value={profile.professionalDetails?.employeeId || ''} onChange={(event) => onUpdate('employeeId', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Designation</label>
            <select className="form-input" value={profile.professionalDetails?.designation || ''} onChange={(event) => onUpdate('designation', event.target.value)}>
              <option value="">Select Designation</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
              <option value="Senior Professor">Senior Professor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" value={profile.professionalDetails?.department || ''} onChange={(event) => onUpdate('department', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">College / Institution Name</label>
            <input className="form-input" value={profile.professionalDetails?.institutionName || ''} onChange={(event) => onUpdate('institutionName', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">University Affiliated to</label>
            <input className="form-input" value={profile.professionalDetails?.affiliatedUniversity || ''} onChange={(event) => onUpdate('affiliatedUniversity', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Type of Institution</label>
            <select className="form-input" value={profile.professionalDetails?.institutionType || ''} onChange={(event) => onUpdate('institutionType', event.target.value)}>
              <option value="">Select Type</option>
              <option value="Government">Government</option>
              <option value="Aided">Aided</option>
              <option value="Private">Private</option>
              <option value="Deemed">Deemed</option>
              <option value="Central University">Central University</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nature of Appointment</label>
            <select className="form-input" value={profile.professionalDetails?.natureOfAppointment || ''} onChange={(event) => onUpdate('natureOfAppointment', event.target.value)}>
              <option value="">Select Nature</option>
              <option value="Regular">Regular</option>
              <option value="Contract">Contract</option>
              <option value="Guest">Guest</option>
              <option value="Adjunct">Adjunct</option>
              <option value="Visiting">Visiting</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
              <option value="Senior Professor">Senior Professor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date of Joining (current institution)</label>
            <input type="date" className="form-input" value={profile.professionalDetails?.dateOfJoining || ''} onChange={(event) => onUpdate('dateOfJoining', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Confirmation / Regularization</label>
            <input type="date" className="form-input" value={profile.professionalDetails?.dateOfConfirmation || ''} onChange={(event) => onUpdate('dateOfConfirmation', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Pay Band / Pay Scale / CTC</label>
            <input className="form-input" value={profile.professionalDetails?.payBand || ''} onChange={(event) => onUpdate('payBand', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Bank Account Details (for salary)</label>
            <input className="form-input" value={profile.professionalDetails?.bankAccountDetails || ''} onChange={(event) => onUpdate('bankAccountDetails', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Provident Fund (PF) Number</label>
            <input className="form-input" value={profile.professionalDetails?.pfNumber || ''} onChange={(event) => onUpdate('pfNumber', event.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Service Book Number</label>
            <input className="form-input" value={profile.professionalDetails?.serviceBookNumber || ''} onChange={(event) => onUpdate('serviceBookNumber', event.target.value)} />
          </div>
        </div>

        <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>First Promotion</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Date of First Promotion</label><input type="date" className="form-input" value={profile.professionalDetails?.dateOfFirstPromotion || ''} onChange={(event) => onUpdate('dateOfFirstPromotion', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">Nature of Appointment</label><input className="form-input" value={profile.professionalDetails?.natureOfFirstAppointment || ''} onChange={(event) => onUpdate('natureOfFirstAppointment', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">New Pay Band / Pay Scale</label><input className="form-input" value={profile.professionalDetails?.firstPayBand || ''} onChange={(event) => onUpdate('firstPayBand', event.target.value)} /></div>
        </div>

        <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Second Promotion</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Date of Second Promotion</label><input type="date" className="form-input" value={profile.professionalDetails?.dateOfSecondPromotion || ''} onChange={(event) => onUpdate('dateOfSecondPromotion', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">Nature of Appointment</label><input className="form-input" value={profile.professionalDetails?.natureOfSecondAppointment || ''} onChange={(event) => onUpdate('natureOfSecondAppointment', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">New Pay Band / Pay Scale</label><input className="form-input" value={profile.professionalDetails?.secondPayBand || ''} onChange={(event) => onUpdate('secondPayBand', event.target.value)} /></div>
        </div>

        <h4 style={{ fontSize: '1rem', marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--color-text)' }}>Third Promotion</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group"><label className="form-label">Date of Third Promotion</label><input type="date" className="form-input" value={profile.professionalDetails?.dateOfThirdPromotion || ''} onChange={(event) => onUpdate('dateOfThirdPromotion', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">Nature of Appointment</label><input className="form-input" value={profile.professionalDetails?.natureOfThirdAppointment || ''} onChange={(event) => onUpdate('natureOfThirdAppointment', event.target.value)} /></div>
          <div className="form-group"><label className="form-label">New Pay Band / Pay Scale</label><input className="form-input" value={profile.professionalDetails?.thirdPayBand || ''} onChange={(event) => onUpdate('thirdPayBand', event.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
