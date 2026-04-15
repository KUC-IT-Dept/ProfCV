import { useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = {
  profile: Profile;
  onAddCourse: () => void;
  onUpdateCourse: (index: number, field: 'course' | 'year' | 'programme' | 'subject', value: string) => void;
  onRemoveCourse: (index: number) => void;
  onSetField: (field: 'classesHandled' | 'administrativeRoles' | 'committeeMemberships', value: string) => void;
};

type CourseField = 'course' | 'year' | 'programme' | 'subject';
type OtherAcademicField = 'classesHandled' | 'administrativeRoles' | 'committeeMemberships';

const COURSE_FIELDS: CourseField[] = ['course', 'year', 'programme', 'subject'];
const OTHER_CARD_KEY = 'academic-other';

const createCourseDraft = (course?: Profile['academicResponsibilities']['courses'][number]) => ({
  course: course?.course || '',
  year: course?.year || '',
  programme: course?.programme || '',
  subject: course?.subject || '',
});

const createOtherDraft = (academic: Profile['academicResponsibilities']) => ({
  classesHandled: academic.classesHandled || '',
  administrativeRoles: academic.administrativeRoles || '',
  committeeMemberships: academic.committeeMemberships || '',
});

function PreviewLine({ label, value, fallback = 'Not provided' }: { label: string; value: string; fallback?: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </p>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
        {value || fallback}
      </p>
    </div>
  );
}

export default function AcademicResponsibilitiesSection({ profile, onAddCourse, onUpdateCourse, onRemoveCourse, onSetField }: Props) {
  const academic = profile.academicResponsibilities;
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [editingCourseIndex, setEditingCourseIndex] = useState<number | null>(null);
  const [courseDraft, setCourseDraft] = useState(createCourseDraft());
  const [editingOther, setEditingOther] = useState(false);
  const [otherDraft, setOtherDraft] = useState(createOtherDraft(academic));

  useEffect(() => {
    if (!editingOther) {
      setOtherDraft(createOtherDraft(academic));
    }
  }, [academic.classesHandled, academic.administrativeRoles, academic.committeeMemberships, editingOther]);

  const getCourseCardKey = (index: number) => `academic-course-${index}`;
  const isExpanded = (key: string) => expandedCards[key] ?? false;

  const toggleCard = (key: string) => {
    setExpandedCards((current) => ({ ...current, [key]: !current[key] }));
  };

  const openCard = (key: string) => {
    setExpandedCards((current) => ({ ...current, [key]: true }));
  };

  const startEditCourse = (index: number) => {
    setEditingCourseIndex(index);
    setCourseDraft(createCourseDraft(academic.courses[index]));
    openCard(getCourseCardKey(index));
  };

  const updateDraftCourse = (field: CourseField, value: string) => {
    setCourseDraft((current) => ({ ...current, [field]: value }));
  };

  const saveCourse = (index: number) => {
    COURSE_FIELDS.forEach((field) => {
      onUpdateCourse(index, field, courseDraft[field]);
    });
    setEditingCourseIndex(null);
  };

  const cancelEditCourse = () => {
    setEditingCourseIndex(null);
    setCourseDraft(createCourseDraft());
  };

  const addCourse = () => {
    const nextIndex = academic.courses.length;
    onAddCourse();
    setEditingCourseIndex(nextIndex);
    setCourseDraft(createCourseDraft());
    openCard(getCourseCardKey(nextIndex));
  };

  const removeCourse = (index: number) => {
    if (editingCourseIndex === index) {
      setEditingCourseIndex(null);
      setCourseDraft(createCourseDraft());
    } else if (editingCourseIndex !== null && editingCourseIndex > index) {
      setEditingCourseIndex(editingCourseIndex - 1);
    }

    setExpandedCards((current) => {
      const next: Record<string, boolean> = {};

      Object.entries(current).forEach(([key, value]) => {
        if (!key.startsWith('academic-course-')) {
          next[key] = value;
          return;
        }

        const currentIndex = Number(key.replace('academic-course-', ''));
        if (Number.isNaN(currentIndex)) {
          return;
        }

        if (currentIndex < index) {
          next[key] = value;
          return;
        }

        if (currentIndex > index) {
          next[getCourseCardKey(currentIndex - 1)] = value;
        }
      });

      return next;
    });

    onRemoveCourse(index);
  };

  const startEditOther = () => {
    setEditingOther(true);
    setOtherDraft(createOtherDraft(academic));
    openCard(OTHER_CARD_KEY);
  };

  const setOtherDraftField = (field: OtherAcademicField, value: string) => {
    setOtherDraft((current) => ({ ...current, [field]: value }));
  };

  const saveOther = () => {
    onSetField('classesHandled', otherDraft.classesHandled);
    onSetField('administrativeRoles', otherDraft.administrativeRoles);
    onSetField('committeeMemberships', otherDraft.committeeMemberships);
    setEditingOther(false);
  };

  const cancelEditOther = () => {
    setOtherDraft(createOtherDraft(academic));
    setEditingOther(false);
  };

  return (
    <SectionShell
      title="Academic Responsibilities"
      description="Track your teaching load, academic duties and committee memberships."
    >
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Courses / Subjects Taught</h3>
          <button type="button" className="btn btn-secondary" onClick={addCourse}>
            <Plus size={14} />
            Add Academic Responsibility
          </button>
        </div>

        {academic.courses.length === 0 ? (
          <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Add academic responsibilities and use each card preview to quickly scan details.
          </div>
        ) : null}

        {academic.courses.map((course, index) => {
          const courseCardKey = getCourseCardKey(index);
          const isEditing = editingCourseIndex === index;
          const courseView = isEditing ? courseDraft : createCourseDraft(course);
          const summary = [courseView.course, courseView.programme, courseView.year, courseView.subject].filter(Boolean).join(' · ') || 'No details added yet';

          return (
            <ProfileBuilderSectionCard
              key={courseCardKey}
              title={course.course || `Course #${index + 1}`}
              summary={summary}
              expanded={isExpanded(courseCardKey)}
              onToggle={() => toggleCard(courseCardKey)}
              actions={(
                <>
                  {isEditing ? (
                    <>
                      <button type="button" className="btn btn-primary" onClick={() => saveCourse(index)}>
                        <Save size={14} />
                        Save
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={cancelEditCourse}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={() => startEditCourse(index)}>
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => removeCourse(index)}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
            >
              {isEditing ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Courses / Subjects Taught</label>
                    <input
                      className="form-input"
                      value={courseView.course}
                      onChange={(event) => updateDraftCourse('course', event.target.value)}
                      placeholder="e.g. Advanced Algorithms / Database Systems"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      className="form-input"
                      value={courseView.year}
                      onChange={(event) => updateDraftCourse('year', event.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Programmes</label>
                    <input
                      className="form-input"
                      value={courseView.programme}
                      onChange={(event) => updateDraftCourse('programme', event.target.value)}
                      placeholder="e.g. B.Sc, M.Sc, B.Tech"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      className="form-input"
                      value={courseView.subject}
                      onChange={(event) => updateDraftCourse('subject', event.target.value)}
                      placeholder="e.g. Computer Science, Physics"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <PreviewLine label="Courses / Subjects Taught" value={courseView.course} fallback="No course added yet" />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <PreviewLine label="Year" value={courseView.year} />
                    <PreviewLine label="Programmes" value={courseView.programme} />
                  </div>
                  <PreviewLine label="Subject" value={courseView.subject} />
                </div>
              )}
            </ProfileBuilderSectionCard>
          );
        })}

        {(() => {
          const otherView = editingOther ? otherDraft : createOtherDraft(academic);
          const otherSummary = [otherView.classesHandled, otherView.administrativeRoles, otherView.committeeMemberships]
            .filter(Boolean)
            .join(' · ') || 'No additional responsibilities added yet';

          return (
            <ProfileBuilderSectionCard
              title="Other Academic Responsibilities"
              summary={otherSummary}
              expanded={isExpanded(OTHER_CARD_KEY)}
              onToggle={() => toggleCard(OTHER_CARD_KEY)}
              actions={(
                <>
                  {editingOther ? (
                    <>
                      <button type="button" className="btn btn-primary" onClick={saveOther}>
                        <Save size={14} />
                        Save
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={cancelEditOther}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-secondary" onClick={startEditOther}>
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                </>
              )}
            >
              {editingOther ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Classes Handled (UG / PG / Ph.D.)</label>
                    <input
                      className="form-input"
                      value={otherView.classesHandled}
                      onChange={(event) => setOtherDraftField('classesHandled', event.target.value)}
                      placeholder="e.g. UG: Data Structures, PG: AI"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Administrative Roles (HOD / Dean / IQAC / Warden etc.)</label>
                    <input
                      className="form-input"
                      value={otherView.administrativeRoles}
                      onChange={(event) => setOtherDraftField('administrativeRoles', event.target.value)}
                      placeholder="e.g. Head of Department, Warden"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Committee Memberships (Academic Council / BOS / etc.)</label>
                    <textarea
                      className="form-textarea"
                      value={otherView.committeeMemberships}
                      onChange={(event) => setOtherDraftField('committeeMemberships', event.target.value)}
                      placeholder="e.g. Member of Board of Studies, Academic Council"
                      style={{ minHeight: 110 }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <PreviewLine label="Classes Handled (UG / PG / Ph.D.)" value={otherView.classesHandled} fallback="No classes listed" />
                  <PreviewLine label="Administrative Roles" value={otherView.administrativeRoles} fallback="No administrative roles listed" />
                  <PreviewLine label="Committee Memberships" value={otherView.committeeMemberships} fallback="No committee memberships listed" />
                </div>
              )}
            </ProfileBuilderSectionCard>
          );
        })()}
      </div>
    </SectionShell>
  );
}
