import { useState } from 'react';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };

type AwardHonour = {
  awardName: string;
  awardingBody: string;
  level: string;
  yearReceived: string;
  description: string;
};

export default function AwardsHonoursSection(_props: Props) {
  const [awards, setAwards] = useState<AwardHonour[]>([
    {
      awardName: '',
      awardingBody: '',
      level: '',
      yearReceived: '',
      description: '',
    },
  ]);

  const updateAward = (index: number, field: keyof AwardHonour, value: string) => {
    setAwards((current) =>
      current.map((award, awardIndex) =>
        awardIndex === index ? { ...award, [field]: value } : award
      )
    );
  };

  const addAward = () => {
    setAwards((current) => [
      ...current,
      {
        awardName: '',
        awardingBody: '',
        level: '',
        yearReceived: '',
        description: '',
      },
    ]);
  };

  const removeAward = (index: number) => {
    setAwards((current) => current.filter((_, awardIndex) => awardIndex !== index));
  };

  return (
    <SectionShell title="Awards & Honours" description="Enter one or more awards, fellowships, honours and recognitions.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {awards.map((award, index) => (
          <div
            key={`award-${index}`}
            className="card"
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Award / Fellowship {index + 1}</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Add the award name, organization, level, year, and description.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ color: 'var(--color-danger)', fontSize: '0.8125rem' }}
                onClick={() => removeAward(index)}
              >
                Remove
              </button>
            </div>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Award / Fellowship Name</label>
                <input
                  className="form-input"
                  value={award.awardName}
                  onChange={(event) => updateAward(index, 'awardName', event.target.value)}
                  placeholder="Enter award or fellowship name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Awarding Body / Organization</label>
                <input
                  className="form-input"
                  value={award.awardingBody}
                  onChange={(event) => updateAward(index, 'awardingBody', event.target.value)}
                  placeholder="Enter the awarding body or organization"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <input
                    className="form-input"
                    value={award.level}
                    onChange={(event) => updateAward(index, 'level', event.target.value)}
                    placeholder="Institution / State / National / International"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year Received</label>
                  <input
                    className="form-input"
                    value={award.yearReceived}
                    onChange={(event) => updateAward(index, 'yearReceived', event.target.value)}
                    placeholder="e.g. 2024"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={award.description}
                  onChange={(event) => updateAward(index, 'description', event.target.value)}
                  placeholder="Add a brief description of the award or achievement"
                  rows={4}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        ))}

        <button className="btn btn-secondary" type="button" onClick={addAward}>
          Add Award / Honour
        </button>
      </div>
    </SectionShell>
  );
}
