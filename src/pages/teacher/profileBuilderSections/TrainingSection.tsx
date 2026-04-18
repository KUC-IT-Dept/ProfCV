import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type TrainingProgramsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

type TrainingDraft = {
  programName: string;
  type: string;
  organizedBy: string;
  duration: string;
  fromDate: string;
  toDate: string;
  mode: string;
  certificate: string;
};

const TRAINING_FIELDS: Array<keyof TrainingDraft> = [
  'programName',
  'type',
  'organizedBy',
  'duration',
  'fromDate',
  'toDate',
  'mode',
  'certificate',
];

const createTrainingDraft = (training?: any): TrainingDraft => {
  const trainingData = (training || {}) as Record<string, string>;

  return {
    programName: trainingData.programName || '',
    type: trainingData.type || '',
    organizedBy: trainingData.organizedBy || '',
    duration: trainingData.duration || '',
    fromDate: trainingData.fromDate || '',
    toDate: trainingData.toDate || '',
    mode: trainingData.mode || '',
    certificate: trainingData.certificate || '',
  };
};

export default function TrainingSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: TrainingProgramsSectionProps) {
  const trainings = (profile as any).trainings || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftTraining, setDraftTraining] = useState<TrainingDraft | null>(null);

  const startEditTraining = (index: number) => {
    const cardKey = `trainings-${index}`;

    setEditingIndex(index);
    setDraftTraining(createTrainingDraft(trainings[index]));

    if (!isExpanded(cardKey)) {
      onToggle(cardKey);
    }
  };

  const cancelEditTraining = () => {
    setEditingIndex(null);
    setDraftTraining(null);
  };

  const updateDraftTraining = (field: keyof TrainingDraft, value: string) => {
    setDraftTraining((current) => {
      if (!current) {
        return current;
      }
      return { ...current, [field]: value };
    });
  };

  const saveTraining = (index: number) => {
    if (!draftTraining) {
      return;
    }

    TRAINING_FIELDS.forEach((field) => {
      onUpdate(index, field, draftTraining[field]);
    });

    setEditingIndex(null);
    setDraftTraining(null);
  };

  const handleAddTraining = () => {
    onAdd();
    setEditingIndex(0);
    setDraftTraining(createTrainingDraft());

    const newCardKey = 'trainings-0';
    if (!isExpanded(newCardKey)) {
      onToggle(newCardKey);
    }
  };

  const handleRemoveTraining = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftTraining(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    onRemove(index);
  };

  const renderDetailValue = (value: string, fallback = 'Not provided') => (
    <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
      {value || fallback}
    </p>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary, #2563eb)' }}>Training, FDP & Workshops</h3>
        <button className="btn btn-secondary" onClick={handleAddTraining} type="button"><Plus size={14} /> Add Training</button>
      </div>

      {trainings.length === 0 && (
        <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          No training programs added yet.
        </div>
      )}

      {trainings.map((training: any, index: number) => {
        const cardKey = `trainings-${index}`;
        const isEditing = editingIndex === index;
        const viewTraining = isEditing && draftTraining ? draftTraining : createTrainingDraft(training);

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={training.programName || `Training ${index + 1}`}
            summary=""
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
            actions={(
              <>
                {isEditing ? (
                  <>
                    <button className="btn btn-secondary" type="button" onClick={() => saveTraining(index)}>
                      <Save size={14} />
                      Save
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={cancelEditTraining}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" type="button" onClick={() => startEditTraining(index)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

                <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => handleRemoveTraining(index)} type="button">
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          >
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Program Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <input className="form-input" value={viewTraining.programName} onChange={(event) => updateDraftTraining('programName', event.target.value)} placeholder="Name of training program…" />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <input className="form-input" value={viewTraining.type} onChange={(event) => updateDraftTraining('type', event.target.value)} placeholder="FDP / Workshop / Seminar / MOOC / Refresher / Orientation" />
                </div>
                <div className="form-group">
                  <label className="form-label">Organized by</label>
                  <input className="form-input" value={viewTraining.organizedBy} onChange={(event) => updateDraftTraining('organizedBy', event.target.value)} placeholder="Organization or institution name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration</label>
                    <input className="form-input" value={viewTraining.duration} onChange={(event) => updateDraftTraining('duration', event.target.value)} placeholder="e.g. 1 Week / 5 Days" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input className="form-input" value={viewTraining.fromDate} onChange={(event) => updateDraftTraining('fromDate', event.target.value)} placeholder="Start date / year" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input className="form-input" value={viewTraining.toDate} onChange={(event) => updateDraftTraining('toDate', event.target.value)} placeholder="End date / year" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Mode</label>
                    <input className="form-input" value={viewTraining.mode} onChange={(event) => updateDraftTraining('mode', event.target.value)} placeholder="Online / Offline" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Certificate</label>
                    <input className="form-input" value={viewTraining.certificate} onChange={(event) => updateDraftTraining('certificate', event.target.value)} placeholder="Yes / No" />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Program Name
                  </p>
                  {renderDetailValue(viewTraining.programName, 'No program name added yet')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Type
                    </p>
                    {renderDetailValue(viewTraining.type)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Organized by
                    </p>
                    {renderDetailValue(viewTraining.organizedBy)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Duration
                    </p>
                    {renderDetailValue(viewTraining.duration)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      From Date
                    </p>
                    {renderDetailValue(viewTraining.fromDate)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      To Date
                    </p>
                    {renderDetailValue(viewTraining.toDate)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Mode
                    </p>
                    {renderDetailValue(viewTraining.mode)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Certificate
                    </p>
                    {renderDetailValue(viewTraining.certificate)}
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
