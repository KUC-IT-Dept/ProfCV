import { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { Profile } from './profileBuilderTypes';

type DocumentsToUploadSectionProps = {
  profile: Profile;
  uploadError: string;
  onUploadDocument: (field: keyof Profile['documents'], file: File) => void;
  onAddVideoEmbed: () => void;
  onUpdateVideoEmbed: (index: number, value: string) => void;
  onRemoveVideoEmbed: (index: number) => void;
};

const DOCUMENT_FIELDS = [
  { key: 'passportPhoto', label: '15.1. Passport-size Photograph', accept: 'image/*' },
  { key: 'signature', label: '15.2. Signature', accept: 'image/*' },
  { key: 'dobProof', label: '15.3. Date of Birth Proof', accept: 'image/*,.pdf' },
  { key: 'categoryCertificate', label: '15.4. Category Certificate (SC/ST/OBC)', accept: 'image/*,.pdf' },
  { key: 'degreeCertificates', label: '15.5. All Degree Certificates & Marksheets', accept: 'image/*,.pdf' },
  { key: 'netSetJrfCertificate', label: '15.6. NET/SET/JRF Certificate', accept: 'image/*,.pdf' },
  { key: 'experienceCertificates', label: '15.7. Experience Certificates', accept: 'image/*,.pdf' },
  { key: 'appointmentOrders', label: '15.8. Appointment Orders', accept: 'image/*,.pdf' },
  { key: 'awardCertificates', label: '15.9. Award Certificates', accept: 'image/*,.pdf' },
  { key: 'publicationProofs', label: '15.10. Publication Proofs', accept: 'image/*,.pdf' },
  { key: 'aadhaarCard', label: '15.11. Aadhaar Card / National ID', accept: 'image/*,.pdf' },
  { key: 'panCard', label: '15.12. PAN Card', accept: 'image/*,.pdf' },
] as const;

export default function DocumentsToUploadSection({
  profile,
  uploadError,
  onUploadDocument,
  onAddVideoEmbed: _onAddVideoEmbed,
  onUpdateVideoEmbed: _onUpdateVideoEmbed,
  onRemoveVideoEmbed: _onRemoveVideoEmbed,
}: DocumentsToUploadSectionProps) {
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (field: keyof Profile['documents'], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadDocument(field, file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>15. Documents to Upload</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Supported formats: Images (JPEG, PNG, etc.) and PDF. Max 5 MB each.</p>
        </div>

        {uploadError && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{uploadError}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {DOCUMENT_FIELDS.map((docField) => {
            const url = profile.documents?.[docField.key as keyof Profile['documents']];
            return (
              <div key={docField.key} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label className="form-label" style={{ fontWeight: 500, margin: 0 }}>{docField.label}</label>

                {url ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <FileText size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        View Document
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', padding: '0.5rem 0' }}>Not uploaded yet.</div>
                )}

                <div style={{ marginTop: 'auto' }}>
                  <input
                    type="file"
                    accept={docField.accept}
                    id={`file-${docField.key}`}
                    style={{ display: 'none' }}
                    ref={(el) => { fileInputs.current[docField.key] = el; }}
                    onChange={(e) => {
                      handleFileChange(docField.key as keyof Profile['documents'], e);
                      if (e.target) e.target.value = '';
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}
                    onClick={() => fileInputs.current[docField.key]?.click()}
                  >
                    <Upload size={14} style={{ marginRight: '0.375rem' }} />
                    {url ? 'Replace' : 'Upload'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}  