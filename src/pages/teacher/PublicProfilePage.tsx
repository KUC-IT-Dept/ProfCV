import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/axios';
import { GraduationCap, BookMarked, FlaskConical, BookOpen, Paperclip, Link2, User } from 'lucide-react';

type PublicProfile = {
  user: { name: string; email: string; role: string; department?: string };
  headline?: string;
  bio?: string;
  subjects?: string[];
  qualifications?: { degree: string; institution: string; year: string; grade: string }[];
  publications?: { title: string; journal: string; year: string; doi: string; url: string }[];
  projects?: { title: string; description: string; year: string; url: string }[];
  customDetails?: { sectionTitle: string; content: string }[];
  media?: { attachments: { name: string; url: string; sizeKB: number }[]; videoEmbeds: string[] };
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
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <User size={36} color="#fff" />
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

          {/* Bio */}
          {profile.bio && (
            <Section title="Biography" icon={<User size={17} />}>
              <p style={{ color: 'var(--color-text)', lineHeight: 1.8 }}>{profile.bio}</p>
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
                  <div key={i} style={{ paddingLeft: '0.75rem', borderLeft: '3px solid #BFDBFE' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                      {p.url ? <a href={p.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{p.title}</a> : p.title}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {p.journal && <span>{p.journal}</span>}
                      {p.year && <span> · {p.year}</span>}
                    </div>
                    {p.doi && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>DOI: {p.doi}</div>}
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
          {profile.customDetails && profile.customDetails.map((c, i) => (
            <Section key={i} title={c.sectionTitle || 'Custom Section'} icon={<Link2 size={17} />}>
              <p style={{ color: 'var(--color-text)', whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{c.content}</p>
            </Section>
          ))}

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
