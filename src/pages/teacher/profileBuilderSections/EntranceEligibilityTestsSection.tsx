import { Profile } from './profileBuilderTypes';

type EntranceEligibilityTestsSectionProps = {
  profile: Profile;
  onUpdate: (exam: 'net' | 'set' | 'gate' | 'jrf' | 'other', field: string, value: string) => void;
};

export default function EntranceEligibilityTestsSection({ profile, onUpdate }: EntranceEligibilityTestsSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0', color: 'var(--color-primary)' }}>Entrance / Eligibility Tests</h3>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>NET (National Eligibility Test)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Subject</label><input className="form-input" value={profile.entranceTests?.net?.subject || ''} onChange={(event) => onUpdate('net', 'subject', event.target.value)} /></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={profile.entranceTests?.net?.year || ''} onChange={(event) => onUpdate('net', 'year', event.target.value)} placeholder="e.g. 2021" /></div>
            <div className="form-group"><label className="form-label">Certificate No.</label><input className="form-input" value={profile.entranceTests?.net?.certificateNo || ''} onChange={(event) => onUpdate('net', 'certificateNo', event.target.value)} /></div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>SET / SLET</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Subject</label><input className="form-input" value={profile.entranceTests?.set?.subject || ''} onChange={(event) => onUpdate('set', 'subject', event.target.value)} /></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={profile.entranceTests?.set?.year || ''} onChange={(event) => onUpdate('set', 'year', event.target.value)} placeholder="e.g. 2022" /></div>
            <div className="form-group"><label className="form-label">State</label><input className="form-input" value={profile.entranceTests?.set?.state || ''} onChange={(event) => onUpdate('set', 'state', event.target.value)} /></div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>GATE</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Score / Percentile</label><input className="form-input" value={profile.entranceTests?.gate?.score || ''} onChange={(event) => onUpdate('gate', 'score', event.target.value)} /></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={profile.entranceTests?.gate?.year || ''} onChange={(event) => onUpdate('gate', 'year', event.target.value)} placeholder="e.g. 2020" /></div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>JRF (Junior Research Fellowship)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Agency (UGC/CSIR/ICMR etc.)</label><input className="form-input" value={profile.entranceTests?.jrf?.agency || ''} onChange={(event) => onUpdate('jrf', 'agency', event.target.value)} /></div>
            <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={profile.entranceTests?.jrf?.year || ''} onChange={(event) => onUpdate('jrf', 'year', event.target.value)} /></div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Any other competitive exam qualified</h4>
          <div className="form-group">
            <input className="form-input" value={profile.entranceTests?.other || ''} onChange={(event) => onUpdate('other', '', event.target.value)} placeholder="e.g. GRE, CAT, IELTS, state-level exams..." />
          </div>
        </div>
      </div>
    </div>
  );
}
