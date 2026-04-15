import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Profile } from './profileBuilderTypes';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';

type Props = { profile: Profile; };

type AwardHonour = {
  awardName: string;
  awardingBody: string;
  level: string;
  yearReceived: string;
  description: string;
};

const EMPTY_AWARD: AwardHonour = {
  awardName: '',
  awardingBody: '',
  level: '',
  yearReceived: '',
  description: '',
};

export default function AwardsHonoursSection(_props: Props) {
  const [awards, setAwards] = useState<AwardHonour[]>([{ ...EMPTY_AWARD }]);
  const [expandedCardKey, setExpandedCardKey] = useState<string | null>('award-0');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftAward, setDraftAward] = useState<AwardHonour | null>(null);

  const startEditAward = (index: number) => {
    setEditingIndex(index);
    setDraftAward({ ...awards[index] });
    setExpandedCardKey(`award-${index}`);
  };

  const updateDraftAward = (field: keyof AwardHonour, value: string) => {
    setDraftAward((current) => {
      if (!current) {
        return current;
      }

      return { ...current, [field]: value };
    });
  };

  const saveAward = (index: number) => {
    if (!draftAward) {
      return;
    }

    setAwards((current) =>
      current.map((award, awardIndex) =>
        awardIndex === index ? { ...draftAward } : award
      )
    );

    setEditingIndex(null);
    setDraftAward(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDraftAward(null);
  };

  const addAward = () => {
    const nextIndex = awards.length;
    setAwards((current) => [...current, { ...EMPTY_AWARD }]);
    setExpandedCardKey(`award-${nextIndex}`);
    setEditingIndex(nextIndex);
    setDraftAward({ ...EMPTY_AWARD });
  };

  const removeAward = (index: number) => {
    setAwards((current) => current.filter((_, awardIndex) => awardIndex !== index));

    setEditingIndex((current) => {
      if (current === null) {
        return current;
      }

      if (current === index) {
        return null;
      }

      return current > index ? current - 1 : current;
    });

    setExpandedCardKey((current) => {
      if (!current) {
        return current;
      }

      const currentIndex = Number(current.replace('award-', ''));
      if (Number.isNaN(currentIndex)) {
        return current;
      }

      if (currentIndex === index) {
        return null;
      }

      return currentIndex > index ? `award-${currentIndex - 1}` : current;
    });

    if (editingIndex === index) {
      setDraftAward(null);
    }
  };

  const toggleCard = (index: number) => {
    const cardKey = `award-${index}`;
    setExpandedCardKey((current) => (current === cardKey ? null : cardKey));
  };

  const getSummary = (award: AwardHonour) => {
    const summary = [award.awardName, award.awardingBody, award.yearReceived]
      .filter(Boolean)
      .join(' - ');
    return summary || 'Click to view or edit award details';
  };

  const renderDetailValue = (value: string, fallback = 'Not provided') => (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
      {value || fallback}
    </p>
  );

  return ( 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" type="button" onClick={addAward}>
            <Plus size={14} />
            Add Award / Honour
          </button>
        </div>

        {awards.map((award, index) => {
          const cardKey = `award-${index}`;
          const isEditing = editingIndex === index;
          const viewAward = isEditing && draftAward ? draftAward : award;

          return (
            <ProfileBuilderSectionCard
              key={cardKey}
              title={award.awardName || `Award / Fellowship ${index + 1}`}
              summary={getSummary(award)}
              expanded={expandedCardKey === cardKey}
              onToggle={() => toggleCard(index)}
              actions={(
                <>
                  {isEditing ? (
                    <>
                      <button className="btn btn-secondary" type="button" onClick={() => saveAward(index)}>
                        <Save size={14} />
                        Save
                      </button>
                      <button className="btn btn-ghost" type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-secondary" type="button" onClick={() => startEditAward(index)}>
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}

                  <button
                    className="btn btn-ghost"
                    style={{ color: 'var(--color-danger)' }}
                    type="button"
                    onClick={() => removeAward(index)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </>
              )}
            >
              {isEditing ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Award / Fellowship Name</label>
                    <input
                      className="form-input"
                      value={viewAward.awardName}
                      onChange={(event) => updateDraftAward('awardName', event.target.value)}
                      placeholder="Enter award or fellowship name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Awarding Body / Organization</label>
                    <input
                      className="form-input"
                      value={viewAward.awardingBody}
                      onChange={(event) => updateDraftAward('awardingBody', event.target.value)}
                      placeholder="Enter the awarding body or organization"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Level</label>
                      <input
                        className="form-input"
                        value={viewAward.level}
                        onChange={(event) => updateDraftAward('level', event.target.value)}
                        placeholder="Institution / State / National / International"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Year Received</label>
                      <input
                        className="form-input"
                        value={viewAward.yearReceived}
                        onChange={(event) => updateDraftAward('yearReceived', event.target.value)}
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-input"
                      value={viewAward.description}
                      onChange={(event) => updateDraftAward('description', event.target.value)}
                      placeholder="Add a brief description of the award or achievement"
                      rows={4}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Award / Fellowship Name
                    </p>
                    {renderDetailValue(viewAward.awardName, 'No award name added yet')}
                  </div>

                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Awarding Body / Organization
                    </p>
                    {renderDetailValue(viewAward.awardingBody, 'No awarding body added yet')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Level
                      </p>
                      {renderDetailValue(viewAward.level)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        Year Received
                      </p>
                      {renderDetailValue(viewAward.yearReceived)}
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Description
                    </p>
                    {renderDetailValue(viewAward.description, 'No description added yet')}
                  </div>
                </div>
              )}
            </ProfileBuilderSectionCard>
          );
        })}
      </div>
  );
}
