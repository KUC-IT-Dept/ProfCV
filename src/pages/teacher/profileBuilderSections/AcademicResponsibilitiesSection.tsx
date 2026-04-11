import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = {
  profile: Profile;
  onAddCourse: () => void;
  onUpdateCourse: (index: number, field: 'course' | 'year' | 'programme' | 'subject', value: string) => void;
  onRemoveCourse: (index: number) => void;
  onSetField: (field: 'classesHandled' | 'administrativeRoles' | 'committeeMemberships', value: string) => void;
};

export default function AcademicResponsibilitiesSection({ profile, onAddCourse, onUpdateCourse, onRemoveCourse, onSetField }: Props) {
  const academic = profile.academicResponsibilities;

  return (
    <SectionShell
      title="Academic Responsibilities"
      description="Track your teaching load, academic duties and committee memberships."
    >
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Courses / Subjects Taught</h3>
          {academic.courses.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Add the courses or subjects you teach so they appear on your profile.
            </div>
          ) : null}

          <div style={{ display: 'grid', gap: '1rem' }}>
            {academic.courses.map((course, index) => (
              <div key={index} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '0.95rem' }}>Course #{index + 1}</strong>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}
                    onClick={() => onRemoveCourse(index)}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Courses / Subjects Taught</label>
                    <input
                      className="form-input"
                      value={course.course}
                      onChange={(event) => onUpdateCourse(index, 'course', event.target.value)}
                      placeholder="e.g. Advanced Algorithms / Database Systems"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      className="form-input"
                      value={course.year}
                      onChange={(event) => onUpdateCourse(index, 'year', event.target.value)}
                      placeholder="e.g. 2024"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Programmes</label>
                    <input
                      className="form-input"
                      value={course.programme}
                      onChange={(event) => onUpdateCourse(index, 'programme', event.target.value)}
                      placeholder="e.g. B.Sc, M.Sc, B.Tech"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                      className="form-input"
                      value={course.subject}
                      onChange={(event) => onUpdateCourse(index, 'subject', event.target.value)}
                      placeholder="e.g. Computer Science, Physics"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onAddCourse}
            style={{ marginTop: '1rem', alignSelf: 'flex-start' }}
          >
            + Add Course
          </button>
        </div>

        <div className="card" style={{ padding: '1rem', border: '1px solid var(--color-border)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Other Academic Responsibilities</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Classes Handled (UG / PG / Ph.D.)</label>
              <input
                className="form-input"
                value={academic.classesHandled}
                onChange={(event) => onSetField('classesHandled', event.target.value)}
                placeholder="e.g. UG: Data Structures, PG: AI"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Administrative Roles (HOD / Dean / IQAC / Warden etc.)</label>
              <input
                className="form-input"
                value={academic.administrativeRoles}
                onChange={(event) => onSetField('administrativeRoles', event.target.value)}
                placeholder="e.g. Head of Department, Warden"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Committee Memberships (Academic Council / BOS / etc.)</label>
              <textarea
                className="form-textarea"
                value={academic.committeeMemberships}
                onChange={(event) => onSetField('committeeMemberships', event.target.value)}
                placeholder="e.g. Member of Board of Studies, Academic Council"
                style={{ minHeight: 110 }}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
