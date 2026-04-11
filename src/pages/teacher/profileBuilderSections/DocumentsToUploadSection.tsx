import React from 'react';
import { Link, Plus, Trash2, Upload } from 'lucide-react';
import { Profile } from './profileBuilderTypes';

type DocumentsToUploadSectionProps = {
  profile: Profile;
  uploadError: string;
  onUploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddVideoEmbed: () => void;
  onUpdateVideoEmbed: (index: number, value: string) => void;
  onRemoveVideoEmbed: (index: number) => void;
  onRemoveAttachment: (index: number) => void;
};

export default function DocumentsToUploadSection({
  profile,
  uploadError,
  onUploadFile,
  onAddVideoEmbed,
  onUpdateVideoEmbed,
  onRemoveVideoEmbed,
  onRemoveAttachment,
}: DocumentsToUploadSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="form-label" style={{ marginBottom: '0.625rem' }}>Upload Files (PDF / Images — max 5 MB each)</label>
        <label
          htmlFor="file-upload"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', cursor: 'pointer', transition: 'border-color 0.15s' }}
          onMouseEnter={(event) => ((event.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)')}
          onMouseLeave={(event) => ((event.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
        >
          <Upload size={20} color="var(--color-text-muted)" />
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Click to upload or drag and drop</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>JPEG, PNG, GIF, WEBP, PDF — max 5 MB</span>
        </label>
        <input id="file-upload" type="file" accept="image/*,.pdf" onChange={onUploadFile} style={{ display: 'none' }} />
        {uploadError && <div className="alert alert-error" style={{ marginTop: '0.625rem' }}>{uploadError}</div>}
        {profile.media.attachments.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {profile.media.attachments.map((attachment, index) => (
              <div key={`${attachment.name}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.8125rem' }}>
                  <a href={attachment.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{attachment.name}</a>
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>({attachment.sizeKB} KB)</span>
                </div>
                <button className="btn btn-ghost" onClick={() => onRemoveAttachment(index)} type="button" style={{ padding: '0.25rem' }}><Trash2 size={13} color="var(--color-danger)" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="form-label">Video Embed URLs (YouTube, Vimeo…)</label>
        {profile.media.videoEmbeds.map((videoUrl, index) => (
          <div key={`${index}-${videoUrl}`} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Link size={14} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input className="form-input" value={videoUrl} onChange={(event) => onUpdateVideoEmbed(index, event.target.value)} placeholder="https://youtube.com/watch?v=…" style={{ paddingLeft: '2rem' }} />
            </div>
            <button className="btn btn-ghost" onClick={() => onRemoveVideoEmbed(index)} type="button"><Trash2 size={13} color="var(--color-danger)" /></button>
          </div>
        ))}
        <button className="btn btn-secondary" onClick={onAddVideoEmbed} type="button"><Plus size={14} /> Add Video URL</button>
      </div>
    </div>
  );
}
