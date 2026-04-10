import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/axios';
import { GraduationCap, BookMarked, FlaskConical, BookOpen, Paperclip, Link2, User, Lightbulb, Calendar, Phone, MapPin, User2 } from 'lucide-react';

type PublicProfile = {
  user: { name: string; email: string; role: string; department?: string };
  headline?: string;
  bio?: string;
  subjects?: string[];
  interests?: string[];
  qualifications?: { degree: string; institution: string; year: string; grade: string }[];
  publications?: {
    title: string;
    authors: string;
    journal: string;
    organisation?: string;
    year: string;
    volume?: string;
    issue?: string;
    month?: string;
    pages?: string;
    doi: string;
    url: string
  }[];
  projects?: { title: string; description: string; year: string; url: string }[];
  customDetails?: { sectionTitle: string; content: string; isVisible?: boolean }[];
  professionalDetails?: {
    employeeId: string; designation: string; department: string; institutionName: string;
    affiliatedUniversity: string; institutionType: string; natureOfAppointment: string;
    dateOfJoining: string; dateOfConfirmation: string; payBand: string; bankAccountDetails: string;
    pfNumber: string; serviceBookNumber: string;
    dateOfFirstPromotion: string; natureOfFirstAppointment: string; firstPayBand: string;
    dateOfSecondPromotion: string; natureOfSecondAppointment: string; secondPayBand: string;
    dateOfThirdPromotion: string; natureOfThirdAppointment: string; thirdPayBand: string;
  };
  entranceTests?: {
    net: { subject: string; year: string; certificateNo: string; };
    set: { subject: string; year: string; state: string; };
    gate: { score: string; year: string; };
    jrf: { agency: string; year: string; };
    other: string;
  };
  media?: { attachments: { name: string; url: string; sizeKB: number }[]; videoEmbeds: string[] };
  photo?: string;
  dob?: string;
  gender?: string;
  phoneNumber?: string;
  address?: string;
};

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '1.75rem' }}>{children}</div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;
    api.get(`/profile/public/${userId}`)
      .then((r) => setProfile(r.data))
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)', gap: '1rem' }}>
        <User size={48} color="var(--color-text-light)" />
        <h1 style={{ fontSize: '1.25rem', color: 'var(--color-text)' }}>Profile Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>This profile link may be invalid or has been removed.</p>
      </div>
    );
  }

  const u = profile.user;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '0 1rem 3rem' }}>
      {/* Header band */}
      <div style={{ background: 'linear-gradient(135deg, #8a2be2 0%, #ffa500 100%)', padding: '3rem 1rem 4rem', marginBottom: '0', marginLeft: -16, marginRight: -16 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', color: '#fff' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
            {profile.photo ? (
              <img src={profile.photo} alt={u.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={36} color="#fff" />
            )}
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.25rem', color: '#fff' }}>{u.name}</h1>
          {profile.headline && <p style={{ fontSize: '1.0625rem', opacity: 0.9, marginBottom: '0.375rem', color: '#fff' }}>{profile.headline}</p>}
          <p style={{ fontSize: '0.875rem', opacity: 0.75, color: '#fff' }}>
            {u.email}{u.department ? ` · ${u.department}` : ''}
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.2)', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
              {u.role === 'TEACHER' ? 'Faculty' : u.role}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '-2rem auto 0', position: 'relative' }}>
        <div className="card" style={{ padding: '2rem' }}>

          {/* Personal Info */}
          {(profile.dob || profile.gender || profile.phoneNumber || profile.address) && (
            <Section title="Personal Information" icon={<User2 size={17} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
                {profile.dob && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Calendar size={14} color="var(--color-text-muted)" />
                    <span style={{ color: 'var(--color-text-muted)' }}>Born:</span>
                    <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{new Date(profile.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
                {profile.gender && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <User size={14} color="var(--color-text-muted)" />
                    <span style={{ color: 'var(--color-text-muted)' }}>Gender:</span>
                    <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{profile.gender}</span>
                  </div>
                )}
                {profile.phoneNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Phone size={14} color="var(--color-text-muted)" />
                    <span style={{ color: 'var(--color-text-muted)' }}>Phone:</span>
                    <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{profile.phoneNumber}</span>
                  </div>
                )}
                {profile.address && (
                  <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', fontSize: '0.875rem', gridColumn: 'span 2' }}>
                    <MapPin size={14} color="var(--color-text-muted)" style={{ marginTop: '0.2rem' }} />
                    <span style={{ color: 'var(--color-text-muted)' }}>Address:</span>
                    <span style={{ color: 'var(--color-text)', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{profile.address}</span>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Bio */}
          {profile.bio && (
            <Section title="Biography" icon={<User size={17} />}>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{profile.bio}</p>
            </Section>
          )}

          {/* Professional Details */}
          {profile.professionalDetails && Object.values(profile.professionalDetails).some(v => !!v) && (
            <Section title="Professional / Employment Details" icon={<BookOpen size={17} />}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.professionalDetails.employeeId && <div><span style={{ color: 'var(--color-text-muted)' }}>Employee ID / Staff Code:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.employeeId}</span></div>}
                  {profile.professionalDetails.designation && <div><span style={{ color: 'var(--color-text-muted)' }}>Designation:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.designation}</span></div>}
                  {profile.professionalDetails.department && <div><span style={{ color: 'var(--color-text-muted)' }}>Department:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.department}</span></div>}
                  {profile.professionalDetails.institutionName && <div><span style={{ color: 'var(--color-text-muted)' }}>College / Institution:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.institutionName}</span></div>}
                  {profile.professionalDetails.affiliatedUniversity && <div><span style={{ color: 'var(--color-text-muted)' }}>Affiliated University:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.affiliatedUniversity}</span></div>}
                  {profile.professionalDetails.institutionType && <div><span style={{ color: 'var(--color-text-muted)' }}>Type of Institution:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.institutionType}</span></div>}
                  {profile.professionalDetails.natureOfAppointment && <div><span style={{ color: 'var(--color-text-muted)' }}>Nature of Appointment:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.natureOfAppointment}</span></div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.professionalDetails.dateOfJoining && <div><span style={{ color: 'var(--color-text-muted)' }}>Date of Joining:</span> <span style={{ fontWeight: 500 }}>{new Date(profile.professionalDetails.dateOfJoining).toLocaleDateString()}</span></div>}
                  {profile.professionalDetails.dateOfConfirmation && <div><span style={{ color: 'var(--color-text-muted)' }}>Date of Confirmation:</span> <span style={{ fontWeight: 500 }}>{new Date(profile.professionalDetails.dateOfConfirmation).toLocaleDateString()}</span></div>}
                  {profile.professionalDetails.payBand && <div><span style={{ color: 'var(--color-text-muted)' }}>Pay Band / CTC:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.payBand}</span></div>}
                  {profile.professionalDetails.bankAccountDetails && <div><span style={{ color: 'var(--color-text-muted)' }}>Bank Account (Salary):</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.bankAccountDetails}</span></div>}
                  {profile.professionalDetails.pfNumber && <div><span style={{ color: 'var(--color-text-muted)' }}>PF Number:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.pfNumber}</span></div>}
                  {profile.professionalDetails.serviceBookNumber && <div><span style={{ color: 'var(--color-text-muted)' }}>Service Book Number:</span> <span style={{ fontWeight: 500 }}>{profile.professionalDetails.serviceBookNumber}</span></div>}
                </div>
              </div>

              {((profile.professionalDetails.dateOfFirstPromotion || profile.professionalDetails.natureOfFirstAppointment || profile.professionalDetails.firstPayBand) ||
                (profile.professionalDetails.dateOfSecondPromotion || profile.professionalDetails.natureOfSecondAppointment || profile.professionalDetails.secondPayBand) ||
                (profile.professionalDetails.dateOfThirdPromotion || profile.professionalDetails.natureOfThirdAppointment || profile.professionalDetails.thirdPayBand)) && (
                <div style={{ marginTop: '1.5rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--color-text)' }}>Promotion History</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {(profile.professionalDetails.dateOfFirstPromotion || profile.professionalDetails.natureOfFirstAppointment || profile.professionalDetails.firstPayBand) && (
                      <div style={{ paddingLeft: '0.75rem', borderLeft: '3px solid var(--color-primary)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>First Promotion</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8125rem' }}>
                          {profile.professionalDetails.dateOfFirstPromotion && <div><span style={{ color: 'var(--color-text-muted)' }}>Date:</span> {new Date(profile.professionalDetails.dateOfFirstPromotion).toLocaleDateString()}</div>}
                          {profile.professionalDetails.natureOfFirstAppointment && <div><span style={{ color: 'var(--color-text-muted)' }}>Nature:</span> {profile.professionalDetails.natureOfFirstAppointment}</div>}
                          {profile.professionalDetails.firstPayBand && <div><span style={{ color: 'var(--color-text-muted)' }}>Pay:</span> {profile.professionalDetails.firstPayBand}</div>}
                        </div>
                      </div>
                    )}
                    {(profile.professionalDetails.dateOfSecondPromotion || profile.professionalDetails.natureOfSecondAppointment || profile.professionalDetails.secondPayBand) && (
                      <div style={{ paddingLeft: '0.75rem', borderLeft: '3px solid var(--color-primary)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Second Promotion</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8125rem' }}>
                          {profile.professionalDetails.dateOfSecondPromotion && <div><span style={{ color: 'var(--color-text-muted)' }}>Date:</span> {new Date(profile.professionalDetails.dateOfSecondPromotion).toLocaleDateString()}</div>}
                          {profile.professionalDetails.natureOfSecondAppointment && <div><span style={{ color: 'var(--color-text-muted)' }}>Nature:</span> {profile.professionalDetails.natureOfSecondAppointment}</div>}
                          {profile.professionalDetails.secondPayBand && <div><span style={{ color: 'var(--color-text-muted)' }}>Pay:</span> {profile.professionalDetails.secondPayBand}</div>}
                        </div>
                      </div>
                    )}
                    {(profile.professionalDetails.dateOfThirdPromotion || profile.professionalDetails.natureOfThirdAppointment || profile.professionalDetails.thirdPayBand) && (
                      <div style={{ paddingLeft: '0.75rem', borderLeft: '3px solid var(--color-primary)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Third Promotion</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.8125rem' }}>
                          {profile.professionalDetails.dateOfThirdPromotion && <div><span style={{ color: 'var(--color-text-muted)' }}>Date:</span> {new Date(profile.professionalDetails.dateOfThirdPromotion).toLocaleDateString()}</div>}
                          {profile.professionalDetails.natureOfThirdAppointment && <div><span style={{ color: 'var(--color-text-muted)' }}>Nature:</span> {profile.professionalDetails.natureOfThirdAppointment}</div>}
                          {profile.professionalDetails.thirdPayBand && <div><span style={{ color: 'var(--color-text-muted)' }}>Pay:</span> {profile.professionalDetails.thirdPayBand}</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Section>
          )}

          {/* Entrance / Eligibility Tests */}
          {profile.entranceTests && (
            !!profile.entranceTests.net?.subject || !!profile.entranceTests.set?.subject ||
            !!profile.entranceTests.gate?.score || !!profile.entranceTests.jrf?.agency ||
            !!profile.entranceTests.other
          ) && (
            <Section title="Entrance / Eligibility Tests" icon={<BookOpen size={17} />}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {profile.entranceTests.net?.subject && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>NET (National Eligibility Test)</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {profile.entranceTests.net.subject && <div><span style={{ color: 'var(--color-text-muted)' }}>Subject:</span> {profile.entranceTests.net.subject}</div>}
                      {profile.entranceTests.net.year && <div><span style={{ color: 'var(--color-text-muted)' }}>Year:</span> {profile.entranceTests.net.year}</div>}
                      {profile.entranceTests.net.certificateNo && <div><span style={{ color: 'var(--color-text-muted)' }}>Certificate No:</span> {profile.entranceTests.net.certificateNo}</div>}
                    </div>
                  </div>
                )}
                {profile.entranceTests.set?.subject && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>SET / SLET</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {profile.entranceTests.set.subject && <div><span style={{ color: 'var(--color-text-muted)' }}>Subject:</span> {profile.entranceTests.set.subject}</div>}
                      {profile.entranceTests.set.year && <div><span style={{ color: 'var(--color-text-muted)' }}>Year:</span> {profile.entranceTests.set.year}</div>}
                      {profile.entranceTests.set.state && <div><span style={{ color: 'var(--color-text-muted)' }}>State:</span> {profile.entranceTests.set.state}</div>}
                    </div>
                  </div>
                )}
                {profile.entranceTests.gate?.score && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>GATE</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {profile.entranceTests.gate.score && <div><span style={{ color: 'var(--color-text-muted)' }}>Score / Percentile:</span> {profile.entranceTests.gate.score}</div>}
                      {profile.entranceTests.gate.year && <div><span style={{ color: 'var(--color-text-muted)' }}>Year:</span> {profile.entranceTests.gate.year}</div>}
                    </div>
                  </div>
                )}
                {profile.entranceTests.jrf?.agency && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>JRF (Junior Research Fellowship)</div>
                    <div style={{ fontSize: '0.875rem' }}>
                      {profile.entranceTests.jrf.agency && <div><span style={{ color: 'var(--color-text-muted)' }}>Agency:</span> {profile.entranceTests.jrf.agency}</div>}
                      {profile.entranceTests.jrf.year && <div><span style={{ color: 'var(--color-text-muted)' }}>Year:</span> {profile.entranceTests.jrf.year}</div>}
                    </div>
                  </div>
                )}
                {profile.entranceTests.other && (
                  <div style={{ padding: '1rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Other Competitive Exams</div>
                    <div style={{ fontSize: '0.875rem' }}>{profile.entranceTests.other}</div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Subjects */}
          {profile.subjects && profile.subjects.length > 0 && (
            <Section title="Subjects Taught" icon={<BookOpen size={17} />}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.subjects.map((s, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 500 }}>
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Research Interests */}
          {profile.interests && profile.interests.length > 0 && (
            <Section title="Research Interests" icon={<Lightbulb size={17} />}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {profile.interests.map((interest, i) => (
                  <span key={i} style={{ padding: '0.25rem 0.75rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 500 }}>
                    {interest}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Qualifications */}
          {profile.qualifications && profile.qualifications.length > 0 && (
            <Section title="Qualifications" icon={<GraduationCap size={17} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profile.qualifications.map((q, i) => (
                  <div key={i} style={{ paddingLeft: '0.75rem', borderLeft: '3px solid #BFDBFE' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{q.degree}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {q.institution}{q.year ? ` · ${q.year}` : ''}{q.grade ? ` · ${q.grade}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Publications */}
          {profile.publications && profile.publications.length > 0 && (
            <Section title={`Publications (${profile.publications.length})`} icon={<BookMarked size={17} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {profile.publications.map((p, i) => (
                  <div key={i} style={{ paddingLeft: '0.75rem', borderLeft: '3px solid #BFDBFE', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>
                      {p.url ? <a href={p.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{p.title}</a> : p.title}
                    </div>
                    {p.authors && <div style={{ fontSize: '0.875rem', color: 'var(--color-text)', fontStyle: 'italic', marginTop: '0.125rem' }}>{p.authors}</div>}
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      {p.journal && <strong style={{ color: 'var(--color-text)' }}>{p.journal}</strong>}
                      {p.organisation && <span style={{ color: 'var(--color-text-muted)' }}> ({p.organisation})</span>}
                      {p.volume && <span>, Vol. {p.volume}</span>}
                      {p.issue && <span>, Issue {p.issue}</span>}
                      {(p.month || p.year) && (
                        <span>
                          {' · '}
                          {p.month && `${p.month} `}
                          {p.year}
                        </span>
                      )}
                      {p.pages && <span>, pp. {p.pages}</span>}
                    </div>
                    {p.doi && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', marginTop: '0.125rem' }}>DOI: {p.doi}</div>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Research Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <Section title={`Research Projects (${profile.projects.length})`} icon={<FlaskConical size={17} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {profile.projects.map((p, i) => (
                  <div key={i} style={{ paddingLeft: '0.75rem', borderLeft: '3px solid #BBF7D0' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                      {p.url ? <a href={p.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{p.title}</a> : p.title}
                      {p.year && <span style={{ fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '0.5rem', fontSize: '0.875rem' }}>({p.year})</span>}
                    </div>
                    {p.description && <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{p.description}</div>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Custom Sections */}
          {profile.customDetails && profile.customDetails
            .filter(c => c.isVisible !== false)
            .map((c, i) => (
              <Section key={i} title={c.sectionTitle || 'Custom Section'} icon={<Link2 size={17} />}>
                <p style={{ color: 'var(--color-text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{c.content}</p>
              </Section>
            ))
          }

          {/* Media */}
          {profile.media && profile.media.attachments?.length > 0 && (
            <Section title="Attachments" icon={<Paperclip size={17} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {profile.media.attachments.map((a, i) => (
                  <a key={i} href={a.url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.875rem', textDecoration: 'none' }}>
                    📄 {a.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>({a.sizeKB} KB)</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Footer */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
            Academic profile powered by <strong>Prof CV</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
