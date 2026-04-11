import { useState } from 'react';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };

type SupervisionDetail = {
  studentName: string;
  topic: string;
  year: string;
};

export default function PhdResearchSupervisionSection(_props: Props) {
  const [phdAwarded, setPhdAwarded] = useState('');
  const [completedStudents, setCompletedStudents] = useState('');
  const [phdOngoing, setPhdOngoing] = useState('');
  const [mphilGuided, setMphilGuided] = useState('');
  const [details, setDetails] = useState<SupervisionDetail[]>([
    { studentName: '', topic: '', year: '' },
  ]);

  const updateDetail = (index: number, field: keyof SupervisionDetail, value: string) => {
    setDetails((current) =>
      current.map((detail, detailIndex) =>
        detailIndex === index ? { ...detail, [field]: value } : detail
      )
    );
  };

  const addDetail = () => {
    setDetails((current) => [...current, { studentName: '', topic: '', year: '' }]);
  };

  const removeDetail = (index: number) => {
    setDetails((current) => current.filter((_, detailIndex) => detailIndex !== index));
  };

  return (
    <SectionShell
      title="Ph.D. / Research Supervision"
      description="Provide Ph.D. supervision counts and optional student details."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label">Number of Ph.D. students Awarded</label>
            <input
              className="form-input"
              value={phdAwarded}
              onChange={(event) => setPhdAwarded(event.target.value)}
              placeholder="Enter number awarded"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Number of Ph.D. students Ongoing</label>
            <input
              className="form-input"
              value={phdOngoing}
              onChange={(event) => setPhdOngoing(event.target.value)}
              placeholder="Enter number ongoing"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Names of completed students</label>
          <textarea
            className="form-input"
            value={completedStudents}
            onChange={(event) => setCompletedStudents(event.target.value)}
            placeholder="List the names of completed Ph.D. students"
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Number of M.Phil. students Guided</label>
          <input
            className="form-input"
            value={mphilGuided}
            onChange={(event) => setMphilGuided(event.target.value)}
            placeholder="Enter number guided"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Student Names, Topics, Year (optional detail)</h3>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
              Add details for individual research students if available.
            </p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={addDetail}>
            Add Row
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {details.map((detail, index) => (
            <div
              key={`supervision-detail-${index}`}
              className="card"
              style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            >
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Student Name</label>
                  <input
                    className="form-input"
                    value={detail.studentName}
                    onChange={(event) => updateDetail(index, 'studentName', event.target.value)}
                    placeholder="Enter student name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <input
                    className="form-input"
                    value={detail.topic}
                    onChange={(event) => updateDetail(index, 'topic', event.target.value)}
                    placeholder="Enter research topic"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    className="form-input"
                    value={detail.year}
                    onChange={(event) => updateDetail(index, 'year', event.target.value)}
                    placeholder="Enter year (optional)"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }}
                  onClick={() => removeDetail(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
