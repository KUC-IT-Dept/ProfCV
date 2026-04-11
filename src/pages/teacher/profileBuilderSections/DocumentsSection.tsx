import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type DocumentsSectionProps = {
  profile: Profile;
  uploadError: string;
  onUploadFile: (docKey: keyof Profile['documents'], event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (docKey: keyof Profile['documents']) => void;
};

export default function DocumentsSection({
  profile,
  uploadError,
  onUploadFile,
  onRemoveDocument,
}: DocumentsSectionProps) {
  const documentsList = [
    { key: 'passportPhoto', label: '15.1. Passport-size Photograph' },
    { key: 'signature', label: '15.2. Signature' },
    { key: 'dobProof', label: '15.3. Date of Birth Proof' },
    { key: 'categoryCertificate', label: '15.4. Category Certificate (SC/ST/OBC)' },
    { key: 'degreeCertificates', label: '15.5. All Degree Certificates & Marksheets' },
    { key: 'netSetJrfCertificate', label: '15.6. NET/SET/JRF Certificate' },
    { key: 'experienceCertificates', label: '15.7. Experience Certificates' },
    { key: 'appointmentOrders', label: '15.8. Appointment Orders' },
    { key: 'awardCertificates', label: '15.9. Award Certificates' },
    { key: 'publicationProofs', label: '15.10. Publication Proofs' },
    { key: 'aadhaarCard', label: '15.11. Aadhaar Card / National ID' },
    { key: 'panCard', label: '15.12. PAN Card' }
  ] as const;

  return (
    <SectionShell title="Documents to Upload" description="Upload your certificates and supporting documents here.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {uploadError && <div className="alert alert-error">{uploadError}</div>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {documentsList.map((doc) => (
            <div key={doc.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{doc.label}</span>
                {profile.documents && profile.documents[doc.key as keyof Profile['documents']] ? (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>Uploaded</span>
                    <a href={profile.documents[doc.key as keyof Profile['documents']]} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>View file</a>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Not uploaded yet</span>
                )}
              </div>
              <div>
                {profile.documents && profile.documents[doc.key as keyof Profile['documents']] ? (
                  <button className="btn btn-ghost" onClick={() => onRemoveDocument(doc.key as keyof Profile['documents'])} type="button" style={{ padding: '0.5rem' }}>
                    <Trash2 size={16} color="var(--color-danger)" />
                  </button>
                ) : (
                  <label htmlFor={`doc-upload-${doc.key}`} className="btn btn-secondary" style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>
                    <Upload size={14} style={{ marginRight: '0.5rem' }} /> Upload
                    <input
                      id={`doc-upload-${doc.key}`}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => onUploadFile(doc.key as keyof Profile['documents'], e)}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
