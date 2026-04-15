import { ChevronDown, ChevronUp, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile };

type SupervisionDetail = {
  studentName: string;
  topic: string;
  year: string;
};

type SupervisionEntry = {
  phdAwarded: string;
  completedStudents: string;
  phdOngoing: string;
  mphilGuided: string;
  details: SupervisionDetail[];
};

type SupervisionEntryField = Exclude<keyof SupervisionEntry, 'details'>;

const createEmptyDetail = (): SupervisionDetail => ({ studentName: '', topic: '', year: '' });

const createEmptyEntry = (): SupervisionEntry => ({
  phdAwarded: '',
  completedStudents: '',
  phdOngoing: '',
  mphilGuided: '',
  details: [],
});

const buildDetailKey = (entryIndex: number, detailIndex: number) => `${entryIndex}:${detailIndex}`;

const shiftIndexSetAfterRemoval = (source: Set<number>, removedIndex: number) => {
  const next = new Set<number>();

  source.forEach((value) => {
    if (value < removedIndex) {
      next.add(value);
      return;
    }

    if (value > removedIndex) {
      next.add(value - 1);
    }
  });

  return next;
};

const shiftDetailKeysAfterEntryRemoval = (source: Set<string>, removedEntryIndex: number) => {
  const next = new Set<string>();

  source.forEach((key) => {
    const [entryText, detailText] = key.split(':');
    const entryIndex = Number(entryText);
    const detailIndex = Number(detailText);

    if (entryIndex < removedEntryIndex) {
      next.add(key);
      return;
    }

    if (entryIndex > removedEntryIndex) {
      next.add(buildDetailKey(entryIndex - 1, detailIndex));
    }
  });

  return next;
};

const shiftDetailKeysAfterRowRemoval = (source: Set<string>, entryIndex: number, removedDetailIndex: number) => {
  const next = new Set<string>();

  source.forEach((key) => {
    const [entryText, detailText] = key.split(':');
    const currentEntryIndex = Number(entryText);
    const currentDetailIndex = Number(detailText);

    if (currentEntryIndex !== entryIndex) {
      next.add(key);
      return;
    }

    if (currentDetailIndex < removedDetailIndex) {
      next.add(key);
      return;
    }

    if (currentDetailIndex > removedDetailIndex) {
      next.add(buildDetailKey(entryIndex, currentDetailIndex - 1));
    }
  });

  return next;
};

function PreviewField({ label, value, fallback = 'Not provided' }: { label: string; value: string; fallback?: string }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </p>
      <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: value ? 'var(--color-text)' : 'var(--color-text-light)' }}>
        {value || fallback}
      </p>
    </div>
  );
}

export default function PhdResearchSupervisionSection(_props: Props) {
  const [entries, setEntries] = useState<SupervisionEntry[]>([]);
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());
  const [editingEntries, setEditingEntries] = useState<Set<number>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [editingDetails, setEditingDetails] = useState<Set<string>>(new Set());

  const isEntryExpanded = (index: number) => expandedEntries.has(index);
  const isEntryEditing = (index: number) => editingEntries.has(index);

  const isDetailExpanded = (entryIndex: number, detailIndex: number) => {
    const detailKey = buildDetailKey(entryIndex, detailIndex);
    return expandedDetails.has(detailKey);
  };

  const isDetailEditing = (entryIndex: number, detailIndex: number) => {
    const detailKey = buildDetailKey(entryIndex, detailIndex);
    return editingDetails.has(detailKey);
  };

  const toggleEntry = (index: number) => {
    setExpandedEntries((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleDetail = (entryIndex: number, detailIndex: number) => {
    const detailKey = buildDetailKey(entryIndex, detailIndex);

    setExpandedDetails((current) => {
      const next = new Set(current);
      if (next.has(detailKey)) {
        next.delete(detailKey);
      } else {
        next.add(detailKey);
      }
      return next;
    });
  };

  const setEntryEditing = (index: number, editing: boolean) => {
    setEditingEntries((current) => {
      const next = new Set(current);
      if (editing) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });

    if (editing) {
      setExpandedEntries((current) => {
        const next = new Set(current);
        next.add(index);
        return next;
      });
    }
  };

  const setDetailEditing = (entryIndex: number, detailIndex: number, editing: boolean) => {
    const detailKey = buildDetailKey(entryIndex, detailIndex);

    setEditingDetails((current) => {
      const next = new Set(current);
      if (editing) {
        next.add(detailKey);
      } else {
        next.delete(detailKey);
      }
      return next;
    });

    if (editing) {
      setExpandedDetails((current) => {
        const next = new Set(current);
        next.add(detailKey);
        return next;
      });

      setEntryEditing(entryIndex, true);
    }
  };

  const addEntry = () => {
    const nextIndex = entries.length;

    setEntries((current) => [...current, createEmptyEntry()]);
    setEntryEditing(nextIndex, true);
  };

  const removeEntry = (entryIndex: number) => {
    setEntries((current) => current.filter((_, index) => index !== entryIndex));
    setExpandedEntries((current) => shiftIndexSetAfterRemoval(current, entryIndex));
    setEditingEntries((current) => shiftIndexSetAfterRemoval(current, entryIndex));
    setExpandedDetails((current) => shiftDetailKeysAfterEntryRemoval(current, entryIndex));
    setEditingDetails((current) => shiftDetailKeysAfterEntryRemoval(current, entryIndex));
  };

  const updateEntryField = (entryIndex: number, field: SupervisionEntryField, value: string) => {
    setEntries((current) =>
      current.map((entry, index) =>
        index === entryIndex ? { ...entry, [field]: value } : entry
      )
    );
  };

  const saveEntry = (entryIndex: number) => {
    setEntryEditing(entryIndex, false);
  };

  const addDetail = (entryIndex: number) => {
    let nextDetailIndex = 0;

    setEntries((current) =>
      current.map((entry, index) => {
        if (index !== entryIndex) {
          return entry;
        }

        nextDetailIndex = entry.details.length;
        return { ...entry, details: [...entry.details, createEmptyDetail()] };
      })
    );

    setEntryEditing(entryIndex, true);
    setDetailEditing(entryIndex, nextDetailIndex, true);
  };

  const removeDetail = (entryIndex: number, detailIndex: number) => {
    setEntries((current) =>
      current.map((entry, index) => {
        if (index !== entryIndex) {
          return entry;
        }

        return {
          ...entry,
          details: entry.details.filter((_, currentDetailIndex) => currentDetailIndex !== detailIndex),
        };
      })
    );

    setExpandedDetails((current) => shiftDetailKeysAfterRowRemoval(current, entryIndex, detailIndex));
    setEditingDetails((current) => shiftDetailKeysAfterRowRemoval(current, entryIndex, detailIndex));
  };

  const updateDetail = (entryIndex: number, detailIndex: number, field: keyof SupervisionDetail, value: string) => {
    setEntries((current) =>
      current.map((entry, index) => {
        if (index !== entryIndex) {
          return entry;
        }

        return {
          ...entry,
          details: entry.details.map((detail, currentDetailIndex) =>
            currentDetailIndex === detailIndex ? { ...detail, [field]: value } : detail
          ),
        };
      })
    );
  };

  const saveDetail = (entryIndex: number, detailIndex: number) => {
    setDetailEditing(entryIndex, detailIndex, false);
  };

  return (
    <SectionShell
      title="Ph.D. / Research Supervision"
      description="Provide Ph.D. supervision counts and optional student details."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button
          className="btn btn-primary"
          type="button"
          onClick={addEntry}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start' }}
        >
          <Plus size={14} />
          Add Ph.D. / Research Supervision
        </button>

        {entries.length === 0 && (
          <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            No supervision entries added yet. Use the button above to create your first entry.
          </div>
        )}

        {entries.map((entry, entryIndex) => {
          const entrySummary = [
            entry.phdAwarded ? `Awarded: ${entry.phdAwarded}` : '',
            entry.phdOngoing ? `Ongoing: ${entry.phdOngoing}` : '',
            entry.mphilGuided ? `M.Phil Guided: ${entry.mphilGuided}` : '',
          ].filter(Boolean).join(' · ') || (entry.details[0]?.studentName ? `Student: ${entry.details[0].studentName}` : 'Add supervision details');

          return (
            <ProfileBuilderSectionCard
              key={`supervision-entry-${entryIndex}`}
              title={`Ph.D. / Research Supervision ${entryIndex + 1}`}
              summary={entrySummary}
              expanded={isEntryExpanded(entryIndex)}
              onToggle={() => toggleEntry(entryIndex)}
              actions={(
                <>
                  {!isEntryEditing(entryIndex) ? (
                    <button className="btn btn-secondary" type="button" onClick={() => setEntryEditing(entryIndex, true)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Pencil size={13} />
                      Edit
                    </button>
                  ) : (
                    <button className="btn btn-primary" type="button" onClick={() => saveEntry(entryIndex)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Save size={13} />
                      Save
                    </button>
                  )}

                  <button className="btn btn-ghost" type="button" onClick={() => removeEntry(entryIndex)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
                    <Trash2 size={13} />
                    Delete
                  </button>
                </>
              )}
            >
              {isEntryEditing(entryIndex) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Number of Ph.D. students Awarded</label>
                      <input
                        className="form-input"
                        value={entry.phdAwarded}
                        onChange={(event) => updateEntryField(entryIndex, 'phdAwarded', event.target.value)}
                        placeholder="Enter number awarded"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Number of Ph.D. students Ongoing</label>
                      <input
                        className="form-input"
                        value={entry.phdOngoing}
                        onChange={(event) => updateEntryField(entryIndex, 'phdOngoing', event.target.value)}
                        placeholder="Enter number ongoing"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Names of completed students</label>
                    <textarea
                      className="form-textarea"
                      value={entry.completedStudents}
                      onChange={(event) => updateEntryField(entryIndex, 'completedStudents', event.target.value)}
                      placeholder="List the names of completed Ph.D. students"
                      rows={4}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Number of M.Phil. students Guided</label>
                    <input
                      className="form-input"
                      value={entry.mphilGuided}
                      onChange={(event) => updateEntryField(entryIndex, 'mphilGuided', event.target.value)}
                      placeholder="Enter number guided"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <PreviewField label="Ph.D. Awarded" value={entry.phdAwarded} fallback="0" />
                    <PreviewField label="Ph.D. Ongoing" value={entry.phdOngoing} fallback="0" />
                    <PreviewField label="M.Phil Guided" value={entry.mphilGuided} fallback="0" />
                  </div>
                  <PreviewField label="Completed Students" value={entry.completedStudents} fallback="No completed student names added" />
                </div>
              )}

              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'grid', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Student Names, Topics, Year</h4>
                    <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                      Rows are collapsible with preview. Click a row to view more details.
                    </p>
                  </div>
                  <button className="btn btn-secondary" type="button" onClick={() => addDetail(entryIndex)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Plus size={13} />
                    Add Row
                  </button>
                </div>

                {entry.details.length === 0 && (
                  <div style={{ padding: '0.85rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                    No student rows added yet.
                  </div>
                )}

                {entry.details.map((detail, detailIndex) => {
                  const detailSummary = [detail.studentName, detail.topic, detail.year].filter(Boolean).join(' · ') || 'No student detail entered yet';

                  return (
                    <div
                      key={`supervision-detail-${entryIndex}-${detailIndex}`}
                      className="card"
                      style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.65rem' }}>
                        <button
                          type="button"
                          onClick={() => toggleDetail(entryIndex, detailIndex)}
                          style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                            padding: 0,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                              <h5 style={{ margin: 0, fontSize: '0.875rem' }}>Student Detail {detailIndex + 1}</h5>
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)' }}>
                                {isDetailExpanded(entryIndex, detailIndex) ? 'Expanded' : 'Collapsed'}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {detailSummary}
                            </p>
                          </div>
                          {isDetailExpanded(entryIndex, detailIndex) ? <ChevronUp size={14} color="var(--color-text-muted)" /> : <ChevronDown size={14} color="var(--color-text-muted)" />}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                          {!isDetailEditing(entryIndex, detailIndex) ? (
                            <button className="btn btn-secondary" type="button" onClick={() => setDetailEditing(entryIndex, detailIndex, true)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                              <Pencil size={13} />
                              Edit
                            </button>
                          ) : (
                            <button className="btn btn-primary" type="button" onClick={() => saveDetail(entryIndex, detailIndex)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                              <Save size={13} />
                              Save
                            </button>
                          )}

                          <button className="btn btn-ghost" type="button" onClick={() => removeDetail(entryIndex, detailIndex)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--color-danger)' }}>
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </div>
                      </div>

                      {isDetailExpanded(entryIndex, detailIndex) && (
                        <div style={{ marginTop: '0.85rem' }}>
                          {isDetailEditing(entryIndex, detailIndex) ? (
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                              <div className="form-group">
                                <label className="form-label">Student Name</label>
                                <input
                                  className="form-input"
                                  value={detail.studentName}
                                  onChange={(event) => updateDetail(entryIndex, detailIndex, 'studentName', event.target.value)}
                                  placeholder="Enter student name"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Topic</label>
                                <input
                                  className="form-input"
                                  value={detail.topic}
                                  onChange={(event) => updateDetail(entryIndex, detailIndex, 'topic', event.target.value)}
                                  placeholder="Enter research topic"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Year</label>
                                <input
                                  className="form-input"
                                  value={detail.year}
                                  onChange={(event) => updateDetail(entryIndex, detailIndex, 'year', event.target.value)}
                                  placeholder="Enter year (optional)"
                                />
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                              <PreviewField label="Student Name" value={detail.studentName} fallback="No name added" />
                              <PreviewField label="Topic" value={detail.topic} fallback="No topic added" />
                              <PreviewField label="Year" value={detail.year} fallback="No year added" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ProfileBuilderSectionCard>
          );
        })}
      </div>
    </SectionShell>
  );
}
