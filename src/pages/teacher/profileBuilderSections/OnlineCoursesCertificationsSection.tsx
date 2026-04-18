import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

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
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>('course-0');
  const [editingIndex, setEditingIndex] = useState<number | null>(0);
  const [draftEntry, setDraftEntry] = useState<OnlineCourseCertification | null>({ ...EMPTY_ONLINE_COURSE });

  const startEditEntry = (index: number) => {
    setEditingIndex(index);
    setDraftEntry({ ...entries[index] });
    setExpandedCardKey(`course-${index}`);
  };

  const cancelEditEntry = () => {
    setEditingIndex(null);
    setDraftEntry(null);
  };

  const updateDraftEntry = (field: keyof OnlineCourseCertification, value: string) => {
    setDraftEntry((current) => {
      if (!current) {
        return current;
      }
      return { ...current, [field]: value };
    });
  };

  const saveEntry = (index: number) => {
    if (!draftEntry) {
      return;
    }

    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...draftEntry } : entry
      )
    );

    setEditingIndex(null);
    setDraftEntry(null);
  };

  const addEntry = () => {
    setEntries((current) => [{ ...EMPTY_ONLINE_COURSE }, ...current]);
    setExpandedCardKey('course-0');
    setEditingIndex(0);
    setDraftEntry({ ...EMPTY_ONLINE_COURSE });
  };

  const removeEntry = (index: number) => {
    setEntries((current) => current.filter((_, entryIndex) => entryIndex !== index));

    setEditingIndex((current) => {
      if (current === null) return current;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });

    setExpandedCardKey((current) => {
      if (!current) return current;
      const currentIndex = Number(current.replace('course-', ''));
      if (Number.isNaN(currentIndex)) return current;
      if (currentIndex === index) return null;
      return currentIndex > index ? `course-${currentIndex - 1}` : current;
    });

    if (editingIndex === index) {
      setDraftEntry(null);
    }
  };

  const toggleCard = (index: number) => {
    const cardKey = `course-${index}`;
    setExpandedCardKey((current) => (current === cardKey ? null : cardKey));
  };

  const renderDetailValue = (value: string, fallback = 'Not provided') => (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
      {value || fallback}
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>Online Courses & Certifications</h3>
        <button className="btn btn-secondary" onClick={addEntry} type="button"><Plus size={14} /> Add Course/Certification</button>
      </div>

      {entries.length === 0 && (
        <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          No online courses or certifications added yet.
        </div>
      )}

      {entries.map((entry, index) => {
        const cardKey = `course-${index}`;
        const isEditing = editingIndex === index;
        const viewEntry = isEditing && draftEntry ? draftEntry : entry;

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={entry.courseName || `Course / Certification`}
            summary=""
            expanded={expandedCardKey === cardKey}
            onToggle={() => toggleCard(index)}
            actions={(
              <>
                {isEditing ? (
                  <>
                    <button className="btn btn-secondary" type="button" onClick={() => saveEntry(index)}>
                      <Save size={14} />
                      Save
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={cancelEditEntry}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" type="button" onClick={() => startEditEntry(index)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

                <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => removeEntry(index)} type="button">
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          >
            {isEditing ? (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Course Name</label>
                  <input
                    className="form-input"
                    value={viewEntry.courseName}
                    onChange={(event) => updateDraftEntry('courseName', event.target.value)}
                    placeholder="Enter course or certification name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <input
                    className="form-input"
                    value={viewEntry.platform}
                    onChange={(event) => updateDraftEntry('platform', event.target.value)}
                    placeholder="e.g. SWAYAM, Coursera, NPTEL"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input
                      className="form-input"
                      value={viewEntry.duration}
                      onChange={(event) => updateDraftEntry('duration', event.target.value)}
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
                      value={viewEntry.year}
                      onChange={(event) => updateDraftEntry('year', event.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Score / Grade</label>
                    <input
                      className="form-input"
                      value={viewEntry.scoreGrade}
                      onChange={(event) => updateDraftEntry('scoreGrade', event.target.value)}
                      placeholder="e.g. 95%, A+"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certificate Number</label>
                    <input
                      className="form-input"
                      value={viewEntry.certificateNumber}
                      onChange={(event) => updateDraftEntry('certificateNumber', event.target.value)}
                      placeholder="Enter certificate number if available"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Course Name
                  </p>
                  {renderDetailValue(viewEntry.courseName, 'No course name added yet')}
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Platform
                  </p>
                  {renderDetailValue(viewEntry.platform)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Duration
                    </p>
                    {renderDetailValue(viewEntry.duration)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Year
                    </p>
                    {renderDetailValue(viewEntry.year)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Score / Grade
                    </p>
                    {renderDetailValue(viewEntry.scoreGrade)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Certificate Number
                    </p>
                    {renderDetailValue(viewEntry.certificateNumber)}
                  </div>
                </div>
              </div>
            )}
          </ProfileBuilderSectionCard>
        );
      })}
    </div>
  );
}
