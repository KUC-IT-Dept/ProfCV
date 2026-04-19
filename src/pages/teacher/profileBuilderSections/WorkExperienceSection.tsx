import { useState, useMemo } from 'react';
import { Plus, Trash2, Pencil, Save } from 'lucide-react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type WorkExperienceSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['workExperiences'][number], value: string) => void;
  onRemove: (index: number) => void;
  onSave: () => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

function PreviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8125rem', lineHeight: 1.6 }}>
      <span style={{ color: 'var(--color-text-muted)', minWidth: 180, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: 'var(--color-text)', fontWeight: 500, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export default function WorkExperienceSection({ 
  profile, 
  onAdd, 
  onUpdate, 
  onRemove, 
  onSave, 
  isExpanded, 
  onToggle 
}: WorkExperienceSectionProps) {
  const [editingIndices, setEditingIndices] = useState<Set<number>>(new Set());

  /**
   * SORTING LOGIC:
   * 1. Items currently being EDITED (including new ones) stay at the top.
   * 2. Saved items are sorted by 'fromDate' (Year-wise, latest first).
   * 3. Uses originalIndex as a tie-breaker.
   */
  const sortedExperiences = useMemo(() => {
    return [...profile.workExperiences]
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .sort((a, b) => {
        const isAEditing = editingIndices.has(a.originalIndex);
        const isBEditing = editingIndices.has(b.originalIndex);

        // Priority 1: Move active editing/new items to the very top
        if (isAEditing && !isBEditing) return -1;
        if (!isAEditing && isBEditing) return 1;
        if (isAEditing && isBEditing) return b.originalIndex - a.originalIndex;

        // Priority 2: Year-wise sort (Latest first)
        const dateA = a.fromDate ? new Date(a.fromDate).getTime() : 0;
        const dateB = b.fromDate ? new Date(b.fromDate).getTime() : 0;

        if (dateB !== dateA) return dateB - dateA;

        // Priority 3: Tie-breaker (Newest created first)
        return b.originalIndex - a.originalIndex;
      });
  }, [profile.workExperiences, editingIndices]);

  const setEditing = (index: number, editing: boolean) => {
    setEditingIndices((prev) => {
      const next = new Set(prev);
      if (editing) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  const handleAdd = () => {
    const nextIndex = profile.workExperiences.length;
    onAdd();
    // Putting it in editing mode forces the sort logic to move it to the top
    setEditing(nextIndex, true);
    onToggle(`workExperiences-${nextIndex}`);
    
    // Smooth scroll to top so user sees the new card immediately
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = (index: number) => {
    const cardKey = `workExperiences-${index}`;
    if (!isExpanded(cardKey)) {
      onToggle(cardKey);
    }
    setEditing(index, true);
  };

  const handleSave = (index: number) => {
    setEditing(index, false); // Removing from editing set triggers re-sort to year-wise
    onSave();
  };

  const handleRemove = (index: number) => {
    setEditingIndices((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value < index) next.add(value);
        else if (value > index) next.add(value - 1);
      });
      return next;
    });
    onRemove(index);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0, fontWeight: 600 }}>
            Work Experience
          </h3>
          <button 
            className="btn btn-primary" 
            onClick={handleAdd} 
            type="button" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={14} /> Add Work Experience
          </button>
        </div>

        {profile.workExperiences.length === 0 && (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            color: 'var(--color-text-muted)', 
            background: 'var(--color-bg)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px dashed var(--color-border)' 
          }}>
            No work experience added yet. Use the button above to add your first entry.
          </div>
        )}

        {sortedExperiences.map((workExperience) => {
          const index = workExperience.originalIndex;
          const cardKey = `workExperiences-${index}`;
          const isEditing = editingIndices.has(index);
          const summary = [
            workExperience.designation, 
            workExperience.institutionName, 
            workExperience.fromDate
          ].filter(Boolean).join(' · ') || 'New Work Experience';

          return (
            <ProfileBuilderSectionCard
              key={cardKey}
              title={workExperience.institutionName || `Work Experience ${index + 1}`}
              summary={summary}
              expanded={isExpanded(cardKey)}
              onToggle={() => onToggle(cardKey)}
              actions={(
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isEditing ? (
                    <button className="btn btn-secondary" type="button" onClick={() => handleEdit(index)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Pencil size={13} /> Edit
                    </button>
                  ) : (
                    <button className="btn btn-primary" type="button" onClick={() => handleSave(index)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Save size={13} /> Save
                    </button>
                  )}
                  <button 
                    className="btn btn-ghost" 
                    type="button" 
                    onClick={() => handleRemove(index)} 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              )}
            >
              {isExpanded(cardKey) && !isEditing && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <PreviewRow label="Institution Name" value={workExperience.institutionName} />
                  <PreviewRow label="Designation" value={workExperience.designation} />
                  <PreviewRow label="Department" value={workExperience.department} />
                  <PreviewRow label="Nature of Appointment" value={workExperience.natureOfAppointment} />
                  <PreviewRow label="From Date" value={workExperience.fromDate} />
                  <PreviewRow label="To Date" value={workExperience.toDate} />
                  <PreviewRow label="Total Duration" value={workExperience.totalDuration} />
                  <PreviewRow label="Reason for Leaving" value={workExperience.reasonForLeaving} />
                  
                  {!workExperience.institutionName && !workExperience.designation && (
                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      No details added yet. Click <strong>Edit</strong> to enter information.
                    </p>
                  )}
                </div>
              )}

              {isExpanded(cardKey) && isEditing && (
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Institution Name *</label>
                    <input className="form-input" value={workExperience.institutionName} onChange={(e) => onUpdate(index, 'institutionName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation *</label>
                    <input className="form-input" value={workExperience.designation} onChange={(e) => onUpdate(index, 'designation', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-input" value={workExperience.department} onChange={(e) => onUpdate(index, 'department', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nature of Appointment</label>
                    <input className="form-input" value={workExperience.natureOfAppointment} onChange={(e) => onUpdate(index, 'natureOfAppointment', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input type="date" className="form-input" value={workExperience.fromDate} onChange={(e) => onUpdate(index, 'fromDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input type="date" className="form-input" value={workExperience.toDate} onChange={(e) => onUpdate(index, 'toDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Duration</label>
                    <input className="form-input" value={workExperience.totalDuration} onChange={(e) => onUpdate(index, 'totalDuration', e.target.value)} placeholder="e.g. 5 Years" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reason for Leaving</label>
                    <input className="form-input" value={workExperience.reasonForLeaving} onChange={(e) => onUpdate(index, 'reasonForLeaving', e.target.value)} />
                  </div>
                </div>
              )}
            </ProfileBuilderSectionCard>
          );
        })}
      </div>
    </div>
  );
}