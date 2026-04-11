import { useState } from 'react';

type SupervisionDetails = {
  phDStudentsAwarded: string;
  completedStudentNames: string;
  phDStudentsOngoing: string;
  mPhilStudentsGuided: string;
  studentDetails: string;
};

const EMPTY_SUPERVISION_DETAILS: SupervisionDetails = {
  phDStudentsAwarded: '',
  completedStudentNames: '',
  phDStudentsOngoing: '',
  mPhilStudentsGuided: '',
  studentDetails: '',
};

export default function ResearchSupervisionSection() {
  const [supervisionDetails, setSupervisionDetails] = useState<SupervisionDetails>(EMPTY_SUPERVISION_DETAILS);

  const updateField = (field: keyof SupervisionDetails, value: string) => {
    setSupervisionDetails((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', margin: 0 }}>Research Supervision</h2>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          Ph.D. and M.Phil. supervision details for research students.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Number of Ph.D. students Awarded</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={supervisionDetails.phDStudentsAwarded}
            onChange={(event) => updateField('phDStudentsAwarded', event.target.value)}
            placeholder="Enter count"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Names of completed students</label>
          <textarea
            className="form-textarea"
            value={supervisionDetails.completedStudentNames}
            onChange={(event) => updateField('completedStudentNames', event.target.value)}
            placeholder="List completed students here"
            style={{ minHeight: 100 }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of Ph.D. students Ongoing</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={supervisionDetails.phDStudentsOngoing}
            onChange={(event) => updateField('phDStudentsOngoing', event.target.value)}
            placeholder="Enter count"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of M.Phil. students Guided</label>
          <input
            className="form-input"
            type="number"
            min="0"
            value={supervisionDetails.mPhilStudentsGuided}
            onChange={(event) => updateField('mPhilStudentsGuided', event.target.value)}
            placeholder="Enter count"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Student Names, Topics, Year (optional detail)</label>
          <textarea
            className="form-textarea"
            value={supervisionDetails.studentDetails}
            onChange={(event) => updateField('studentDetails', event.target.value)}
            placeholder="Example: Jane Doe – Machine Learning, 2024"
            style={{ minHeight: 120 }}
          />
        </div>
      </div>
    </section>
  );
}
