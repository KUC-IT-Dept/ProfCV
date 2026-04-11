import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type WorkExperienceSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['workExperiences'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

export default function WorkExperienceSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: WorkExperienceSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>Work Experience</h3>
        </div>
        {profile.workExperiences.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
            No work experience added yet. Click "Add Work Experience" to begin.
          </div>
        )}
        {profile.workExperiences.map((workExperience, index) => {
          const cardKey = `workExperiences-${index}`;
          const summary = [workExperience.institutionName, workExperience.designation, workExperience.fromDate].filter(Boolean).join(' · ') || 'Add work experience details';

          return (
            <ProfileBuilderSectionCard
              key={cardKey}
              title={workExperience.institutionName || `Work Experience ${index + 1}`}
              summary={summary}
              expanded={isExpanded(cardKey)}
              onToggle={() => onToggle(cardKey)}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                <div className="form-group"><label className="form-label">Institution Name *</label><input className="form-input" value={workExperience.institutionName} onChange={(event) => onUpdate(index, 'institutionName', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">Designation *</label><input className="form-input" value={workExperience.designation} onChange={(event) => onUpdate(index, 'designation', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">Department *</label><input className="form-input" value={workExperience.department} onChange={(event) => onUpdate(index, 'department', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">Nature of Appointment</label><input className="form-input" value={workExperience.natureOfAppointment} onChange={(event) => onUpdate(index, 'natureOfAppointment', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" value={workExperience.fromDate} onChange={(event) => onUpdate(index, 'fromDate', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" value={workExperience.toDate} onChange={(event) => onUpdate(index, 'toDate', event.target.value)} /></div>
                <div className="form-group"><label className="form-label">Total Duration</label><input className="form-input" value={workExperience.totalDuration} onChange={(event) => onUpdate(index, 'totalDuration', event.target.value)} placeholder="e.g. 5 Years 2 Months" /></div>
                <div className="form-group"><label className="form-label">Reason for Leaving</label><input className="form-input" value={workExperience.reasonForLeaving} onChange={(event) => onUpdate(index, 'reasonForLeaving', event.target.value)} /></div>
              </div>
              <button className="btn btn-ghost" style={{ marginTop: '0.75rem', color: 'var(--color-danger)', fontSize: '0.8125rem' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Work Experience</button>
            </ProfileBuilderSectionCard>
          );
        })}
        <button className="btn btn-secondary" onClick={onAdd} type="button" style={{ alignSelf: 'flex-start' }}><Plus size={14} /> Add Work Experience</button>
      </div>
    </div>
  );
}
