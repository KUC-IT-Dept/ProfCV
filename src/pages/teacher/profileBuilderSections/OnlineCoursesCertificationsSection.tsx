import { useState } from 'react';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };

type OnlineCourseCertification = {
  courseName: string;
  platform: string;
  duration: string;
  scoreGrade: string;
  certificateNumber: string;
  year: string;
};

const EMPTY_ONLINE_COURSE: OnlineCourseCertification = {
  courseName: '',
  platform: '',
  duration: '',
  scoreGrade: '',
  certificateNumber: '',
  year: '',
};

export default function OnlineCoursesCertificationsSection(_props: Props) {
  const [entries, setEntries] = useState<OnlineCourseCertification[]>([EMPTY_ONLINE_COURSE]);

  const updateEntry = (index: number, field: keyof OnlineCourseCertification, value: string) => {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addEntry = () => {
    setEntries((current) => [...current, EMPTY_ONLINE_COURSE]);
  };

  const removeEntry = (index: number) => {
    setEntries((current) => current.filter((_, entryIndex) => entryIndex !== index));
  };

  return (
    <SectionShell
      title="Online Courses & Certifications"
      description="Add each online course or certification with course name, platform, duration, score/grade, certificate number, and year."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries.map((entry, index) => (
          <div
            key={`online-course-${index}`}
            className="card"
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Online Course / Certification {index + 1}</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Provide the course name, platform, duration, score/grade, certificate number, and year.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: 'var(--color-danger)', fontSize: '0.8125rem' }}
                onClick={() => removeEntry(index)}
              >
                Remove
              </button>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Course Name</label>
                <input
                  className="form-input"
                  value={entry.courseName}
                  onChange={(event) => updateEntry(index, 'courseName', event.target.value)}
                  placeholder="Enter course or certification name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Platform</label>
                <input
                  className="form-input"
                  value={entry.platform}
                  onChange={(event) => updateEntry(index, 'platform', event.target.value)}
                  placeholder="e.g. SWAYAM, Coursera, NPTEL"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-input"
                    value={entry.duration}
                    onChange={(event) => updateEntry(index, 'duration', event.target.value)}
                    placeholder="e.g. 8 weeks, 40 hours"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    className="form-input"
                    type="number"
                    min="1900"
                    max="2099"
                    value={entry.year}
                    onChange={(event) => updateEntry(index, 'year', event.target.value)}
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Score / Grade</label>
                  <input
                    className="form-input"
                    value={entry.scoreGrade}
                    onChange={(event) => updateEntry(index, 'scoreGrade', event.target.value)}
                    placeholder="e.g. 95%, A+"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Certificate Number</label>
                  <input
                    className="form-input"
                    value={entry.certificateNumber}
                    onChange={(event) => updateEntry(index, 'certificateNumber', event.target.value)}
                    placeholder="Enter certificate number if available"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          className="btn btn-secondary"
          type="button"
          onClick={addEntry}
          style={{ alignSelf: 'flex-start', display: 'inline-flex' }}
        >
          + Add Online Courses and Certifications
        </button>
      </div>
    </SectionShell>
  );
}
