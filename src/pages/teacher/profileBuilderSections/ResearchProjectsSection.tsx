
import { Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileBuilderSectionCard from './ProfileBuilderSectionCard';
import { Profile } from './profileBuilderTypes';

type ResearchProjectsSectionProps = {
  profile: Profile;
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Profile['projects'][number], value: string) => void;
  onRemove: (index: number) => void;
  isExpanded: (key: string) => boolean;
  onToggle: (key: string) => void;
};

type ProjectDraft = {
  title: string;
  fundingAgency: string;
  role: string;
  sanctionedAmount: string;
  durationFrom: string;
  durationTo: string;
  status: string;
  referenceNumber: string;
  description: string;
  year: string;
  url: string;
};

const PROJECT_FIELDS: Array<keyof ProjectDraft> = [
  'title',
  'fundingAgency',
  'role',
  'sanctionedAmount',
  'durationFrom',
  'durationTo',
  'status',
  'referenceNumber',
  'description',
  'year',
  'url',
];

const createProjectDraft = (project?: Profile['projects'][number]): ProjectDraft => {
  const projectData = (project || {}) as Record<string, string>;

  return {
    title: project?.title || '',
    fundingAgency: projectData.fundingAgency || '',
    role: projectData.role || '',
    sanctionedAmount: projectData.sanctionedAmount || '',
    durationFrom: projectData.durationFrom || '',
    durationTo: projectData.durationTo || '',
    status: projectData.status || '',
    referenceNumber: projectData.referenceNumber || '',
    description: project?.description || '',
    year: project?.year || '',
    url: project?.url || '',
  };
};

export default function ResearchProjectsSection({ profile, onAdd, onUpdate, onRemove, isExpanded, onToggle }: ResearchProjectsSectionProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftProject, setDraftProject] = useState<ProjectDraft | null>(null);

  const startEditProject = (index: number) => {
    const cardKey = `projects-${index}`;

    setEditingIndex(index);
    setDraftProject(createProjectDraft(profile.projects[index]));

    if (!isExpanded(cardKey)) {
      onToggle(cardKey);
    }
  };

  const cancelEditProject = () => {
    setEditingIndex(null);
    setDraftProject(null);
  };

  const updateDraftProject = (field: keyof ProjectDraft, value: string) => {
    setDraftProject((current) => {
      if (!current) {
        return current;
      }

      return { ...current, [field]: value };
    });
  };

  const saveProject = (index: number) => {
    if (!draftProject) {
      return;
    }

    PROJECT_FIELDS.forEach((field) => {
      onUpdate(index, field as any, draftProject[field]);
    });

    setEditingIndex(null);
    setDraftProject(null);
  };

  const handleAddProject = () => {
    const nextIndex = profile.projects.length;

    onAdd();
    setEditingIndex(nextIndex);
    setDraftProject(createProjectDraft());
  };

  const handleRemoveProject = (index: number) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      setDraftProject(null);
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
        <button className="btn btn-secondary" onClick={handleAddProject} type="button"><Plus size={14} /> Add Project</button>
      </div>

      {profile.projects.length === 0 && (
        <div style={{ padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          No research projects added yet.
        </div>
      )}

      {profile.projects.map((project, index) => {
        const cardKey = `projects-${index}`;
        const isEditing = editingIndex === index;
        const viewProject = isEditing && draftProject ? draftProject : createProjectDraft(project);
        const summary = [project.title, viewProject.status, project.year].filter(Boolean).join(' · ') || 'Add project details';

        return (
          <ProfileBuilderSectionCard
            key={cardKey}
            title={project.title || `Project ${index + 1}`}
            summary={summary}
            expanded={isExpanded(cardKey)}
            onToggle={() => onToggle(cardKey)}
            actions={(
              <>
                {isEditing ? (
                  <>
                    <button className="btn btn-secondary" type="button" onClick={() => saveProject(index)}>
                      <Save size={14} />
                      Save
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={cancelEditProject}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="btn btn-secondary" type="button" onClick={() => startEditProject(index)}>
                    <Pencil size={14} />
                    Edit
                  </button>
                )}

                <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }} onClick={() => handleRemoveProject(index)} type="button">
                  <Trash2 size={13} />
                  Delete
                </button>
              </>
            )}
          >
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Project Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <input className="form-input" value={viewProject.title} onChange={(event) => updateDraftProject('title', event.target.value)} placeholder="Research project title..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Funding Agency</label>
                  <input className="form-input" value={viewProject.fundingAgency} onChange={(event) => updateDraftProject('fundingAgency', event.target.value)} placeholder="DST / UGC / ICSSR / CSIR / NBHM / etc." />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input className="form-input" value={viewProject.role} onChange={(event) => updateDraftProject('role', event.target.value)} placeholder="Principal Investigator / Co-PI" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sanctioned Amount</label>
                  <input className="form-input" value={viewProject.sanctionedAmount} onChange={(event) => updateDraftProject('sanctionedAmount', event.target.value)} placeholder="e.g. Rs 10,00,000" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">Duration (From)</label><input className="form-input" value={viewProject.durationFrom} onChange={(event) => updateDraftProject('durationFrom', event.target.value)} placeholder="Start date or year" /></div>
                  <div className="form-group"><label className="form-label">Duration (To)</label><input className="form-input" value={viewProject.durationTo} onChange={(event) => updateDraftProject('durationTo', event.target.value)} placeholder="End date or year" /></div>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <input className="form-input" value={viewProject.status} onChange={(event) => updateDraftProject('status', event.target.value)} placeholder="Ongoing / Completed" />
                </div>
                <div className="form-group">
                  <label className="form-label">Project Reference Number</label>
                  <input className="form-input" value={viewProject.referenceNumber} onChange={(event) => updateDraftProject('referenceNumber', event.target.value)} placeholder="Reference number" />
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={viewProject.description} onChange={(event) => updateDraftProject('description', event.target.value)} placeholder="Brief project summary..." style={{ minHeight: 80 }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group"><label className="form-label">Year <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" value={viewProject.year} onChange={(event) => updateDraftProject('year', event.target.value)} placeholder="2022-2023" /></div>
                  <div className="form-group"><label className="form-label">Project URL <span style={{ color: 'var(--color-danger)' }}>*</span></label><input className="form-input" type="url" value={viewProject.url} onChange={(event) => updateDraftProject('url', event.target.value)} placeholder="https://..." /></div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Project Title
                  </p>
                  {renderDetailValue(viewProject.title, 'No project title added yet')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Funding Agency
                    </p>
                    {renderDetailValue(viewProject.fundingAgency)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Role
                    </p>
                    {renderDetailValue(viewProject.role)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Duration (From)
                    </p>
                    {renderDetailValue(viewProject.durationFrom)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Duration (To)
                    </p>
                    {renderDetailValue(viewProject.durationTo)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Status
                    </p>
                    {renderDetailValue(viewProject.status)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Reference Number
                    </p>
                    {renderDetailValue(viewProject.referenceNumber)}
                  </div>
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Sanctioned Amount
                  </p>
                  {renderDetailValue(viewProject.sanctionedAmount)}
                </div>

                <div>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Description
                  </p>
                  {renderDetailValue(viewProject.description, 'No description added yet')}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Year
                    </p>
                    {renderDetailValue(viewProject.year, 'No year added yet')}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Project URL
                    </p>
                    {renderDetailValue(viewProject.url, 'No URL added yet')}
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
