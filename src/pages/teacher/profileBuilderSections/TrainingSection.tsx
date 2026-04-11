import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

export default function TrainingSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: TrainingProgramsSectionProps) {
  const trainings = (profile as any).trainings || [];

  return (
    <div>
      {trainings.map((training: any, index: number) => {
        const cardKey = `trainings-${index}`;
        const trainingData = training as Record<string, string>;
        const summary = [training.programName, trainingData.type, trainingData.durationDates].filter(Boolean).join(' · ') || 'Add training details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={training.programName || `Training ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Program Name <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                <input className="form-input" value={training.programName} onChange={(event) => onUpdate(index, 'programName', event.target.value)} placeholder="Name of training program…" />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <input className="form-input" value={trainingData.type || ''} onChange={(event) => onUpdate(index, 'type', event.target.value)} placeholder="FDP / Workshop / Seminar / MOOC / Refresher / Orientation" />
              </div>
              <div className="form-group">
                <label className="form-label">Organized by</label>
                <input className="form-input" value={trainingData.organizedBy || ''} onChange={(event) => onUpdate(index, 'organizedBy', event.target.value)} placeholder="Organization or institution name" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group"><label className="form-label">Duration / Dates</label><input className="form-input" value={trainingData.durationDates || ''} onChange={(event) => onUpdate(index, 'durationDates', event.target.value)} placeholder="e.g. Jan 15-20, 2024" /></div>
                <div className="form-group"><label className="form-label">Mode</label><input className="form-input" value={trainingData.mode || ''} onChange={(event) => onUpdate(index, 'mode', event.target.value)} placeholder="Online / Offline" /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Certificate</label>
                <input className="form-input" value={trainingData.certificate || ''} onChange={(event) => onUpdate(index, 'certificate', event.target.value)} placeholder="Yes / No" />
              </div>
              <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', fontSize: '0.8125rem', alignSelf: 'flex-start' }} onClick={() => onRemove(index)} type="button"><Trash2 size={13} /> Remove Training</button>
            </div>
          </ProfileBuilderSectionCard>
        );
      })}
      <button className="btn btn-secondary" onClick={onAdd} type="button"><Plus size={14} /> Add Training</button>
    </div>
  );
}
