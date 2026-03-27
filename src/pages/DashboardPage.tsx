import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, Share2, FileText, User, Download, LayoutDashboard,
  FlaskConical, GraduationCap, BookMarked, Paperclip, Trophy, TrendingUp,
  Calendar, Newspaper, Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';

interface AdminStats {
  totalFaculty: number;
  departments: number;
  totalProfiles: number;
}

interface TeacherStats {
  publications: number;
  projects: number;
  qualifications: number;
  subjects: number;
  attachments: number;
  videoEmbeds: number;
  headline: string;
  department: string | null;
  // derived
  mostPublishedYear: string | null;
  mostActiveProjectYear: string | null;
  distinctJournals: number;
  latestPub: { title: string; year: string } | null;
}

interface HodTeacher {
  name: string;
  publishCount: number;
  projectCount: number;
  latestPub?: string;
}

interface HodStats {
  totalFaculty: number;
  totalPubs: number;
  totalProjects: number;
  totalQuals: number;
  avgPubs: string;
  leaderboard: HodTeacher[];
}

// ── helpers ──────────────────────────────────────────────────────────────────
function mode(arr: string[]): string | null {
  if (!arr.length) return null;
  const cnt: Record<string, number> = {};
  arr.forEach((v) => { if (v) cnt[v] = (cnt[v] || 0) + 1; });
  let best = '', max = 0;
  Object.entries(cnt).forEach(([k, n]) => { if (n > max) { max = n; best = k; } });
  return best || null;
}

const ROLE_MODULES: Record<string, { to: string; icon: React.ReactNode; label: string; desc: string }[]> = {
  TEACHER: [
    { to: '/profile', icon: <User size={20} />, label: 'My Profile', desc: 'Build and update your academic profile' },
    { to: '/cv-export', icon: <FileText size={20} />, label: 'Export CV', desc: 'Generate and print your CV' },
  ],
  HOD: [
    { to: '/directory', icon: <Users size={20} />, label: 'Faculty Directory', desc: 'View your department faculty' },
    { to: '/managerial-export', icon: <Download size={20} />, label: 'Data Export', desc: 'Export faculty data as CSV / Excel / PDF' },
    { to: '/hierarchy', icon: <Share2 size={20} />, label: 'Org Hierarchy', desc: 'View departmental structure' },
  ],
  VC: [
    { to: '/directory', icon: <Users size={20} />, label: 'Faculty Directory', desc: 'View all university faculty' },
    { to: '/managerial-export', icon: <Download size={20} />, label: 'Data Export', desc: 'Export faculty data as CSV / Excel' },
    { to: '/hierarchy', icon: <Share2 size={20} />, label: 'Org Hierarchy', desc: 'View university-wide structure' },
  ],
  SUPERADMIN: [
    { to: '/directory', icon: <Users size={20} />, label: 'Faculty Directory', desc: 'View all faculty across departments' },
    { to: '/managerial-export', icon: <Download size={20} />, label: 'Data Export', desc: 'Export faculty data reports' },
    { to: '/hierarchy', icon: <Share2 size={20} />, label: 'Org Hierarchy', desc: 'Complete university hierarchy' },
  ],
};

const MEDALS = ['🥇', '🥈', '🥉'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [teacherStats, setTeacherStats] = useState<TeacherStats | null>(null);
  const [hodStats, setHodStats] = useState<HodStats | null>(null);
  const isTeacher = user?.role === 'TEACHER';
  const isHod = user?.role === 'HOD';

  useEffect(() => {
    if (isTeacher) {
      api.get('/profile/me').then((res) => {
        const p = res.data;
        const pubs: any[] = p.publications || [];
        const projs: any[] = p.projects || [];
        const pubYears = pubs.map((x: any) => x.year).filter(Boolean);
        const projYears = projs.map((x: any) => x.year).filter(Boolean);
        const journals = [...new Set(pubs.map((x: any) => x.journal).filter(Boolean))];
        const sortedPubs = [...pubs].filter(x => x.year).sort((a, b) => Number(b.year) - Number(a.year));

        setTeacherStats({
          publications: pubs.length,
          projects: projs.length,
          qualifications: (p.qualifications || []).length,
          subjects: (p.subjects || []).length,
          attachments: (p.media?.attachments || []).length,
          videoEmbeds: (p.media?.videoEmbeds || []).length,
          headline: p.headline || '',
          department: user?.department ?? null,
          mostPublishedYear: mode(pubYears),
          mostActiveProjectYear: mode(projYears),
          distinctJournals: journals.length,
          latestPub: sortedPubs[0] ? { title: sortedPubs[0].title, year: sortedPubs[0].year } : null,
        });
      }).catch(() => {});
    } else if (isHod) {
      // HOD: fetch directory + all profiles in parallel
      api.get('/directory').then(async (directoryRes) => {
        const teachers: any[] = (directoryRes.data as any[]).filter((u: any) => u.role === 'TEACHER');
        const profiles = await Promise.all(
          teachers.map((t: any) =>
            api.get(`/profile/${t._id}`).then(r => ({ ...r.data, _userId: t._id, _userName: t.name })).catch(() => null)
          )
        );
        const valid = profiles.filter(Boolean);

        const totalPubs = valid.reduce((s, p) => s + (p.publications?.length || 0), 0);
        const totalProjects = valid.reduce((s, p) => s + (p.projects?.length || 0), 0);
        const totalQuals = valid.reduce((s, p) => s + (p.qualifications?.length || 0), 0);

        const leaderboard: HodTeacher[] = valid.map(p => {
          const pubs = (p.publications || []) as any[];
          const sorted = [...pubs].filter(x => x.year).sort((a, b) => Number(b.year) - Number(a.year));
          return {
            name: p._userName || p.user?.name || 'Unknown',
            publishCount: pubs.length,
            projectCount: (p.projects || []).length,
            latestPub: sorted[0]?.title,
          };
        }).sort((a, b) => b.publishCount - a.publishCount);

        setHodStats({
          totalFaculty: teachers.length,
          totalPubs,
          totalProjects,
          totalQuals,
          avgPubs: teachers.length ? (totalPubs / teachers.length).toFixed(1) : '0',
          leaderboard: leaderboard.slice(0, 5),
        });
      }).catch(() => { });
    } else {
      api.get('/directory').then((res) => {
        const users: any[] = res.data;
        const depts = new Set(users.map((u: any) => u.department).filter(Boolean));
        const teachers = users.filter((u: any) => u.role === 'TEACHER');
        setAdminStats({ totalFaculty: teachers.length, departments: depts.size, totalProfiles: teachers.length });
      }).catch(() => {});
    }
  }, [isTeacher, isHod, user?.department]);

  const modules = ROLE_MODULES[user?.role ?? 'TEACHER'] ?? [];
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <LayoutDashboard size={20} color="var(--color-primary)" />
          <h1>{greeting()}, {user?.name?.split(' ')[0]}</h1>
        </div>
        <p>Welcome back to Prof CV — your academic portfolio platform.</p>
      </div>

      {/* ── Admin / VC Stats ─────────────────────────────────────────────── */}
      {!isTeacher && !isHod && adminStats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Faculty', value: adminStats.totalFaculty, icon: <Users size={20} /> },
            { label: 'Departments', value: adminStats.departments, icon: <BookOpen size={20} /> },
            { label: 'Faculty Profiles', value: adminStats.totalProfiles, icon: <FileText size={20} /> },
          ].map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card-icon">{s.icon}</div>
              <div>
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HOD Stats & Leaderboard ───────────────────────────────────────── */}
      {isHod && hodStats && (
        <>
          {/* Aggregate stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Faculty in Dept', value: hodStats.totalFaculty, icon: <Users size={20} />, color: '#1D4ED8' },
              { label: 'Total Publications', value: hodStats.totalPubs, icon: <BookMarked size={20} />, color: '#4F46E5' },
              { label: 'Research Projects', value: hodStats.totalProjects, icon: <FlaskConical size={20} />, color: '#059669' },
              { label: 'Qualifications', value: hodStats.totalQuals, icon: <GraduationCap size={20} />, color: '#D97706' },
              { label: 'Avg Pubs / Teacher', value: hodStats.avgPubs, icon: <TrendingUp size={20} />, color: '#7C3AED' },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-card-icon" style={{ background: `${s.color}14`, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="stat-card-value">{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Publication Leaderboard */}
          {hodStats.leaderboard.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Trophy size={17} color="#D97706" />
                <h3 style={{ fontSize: '0.9375rem' }}>Publication Leaderboard</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Top faculty by publications</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    {['Rank', 'Faculty', 'Publications', 'Projects', 'Latest Publication'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {hodStats.leaderboard.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 700, fontSize: '1.1rem' }}>{MEDALS[i] ?? `#${i + 1}`}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>{t.name}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.6rem', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 99, fontWeight: 700, fontSize: '0.8125rem' }}>
                          <BookMarked size={12} /> {t.publishCount}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>{t.projectCount}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.8125rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.latestPub ?? <span style={{ color: 'var(--color-text-light)' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── Teacher personal stats ───────────────────────────────────────── */}
      {isTeacher && teacherStats && (
        <>
          {teacherStats.headline && (
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem 1.125rem', background: 'var(--color-primary-light)', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <GraduationCap size={16} color="var(--color-primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500 }}>{teacherStats.headline}</span>
              {teacherStats.department && <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: 'auto' }}>{teacherStats.department}</span>}
            </div>
          )}

          {/* Primary stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {[
              { label: 'Publications', value: teacherStats.publications, icon: <BookMarked size={20} />, color: '#4F46E5' },
              { label: 'Research Projects', value: teacherStats.projects, icon: <FlaskConical size={20} />, color: '#059669' },
              { label: 'Qualifications', value: teacherStats.qualifications, icon: <GraduationCap size={20} />, color: '#1D4ED8' },
              { label: 'Subjects Taught', value: teacherStats.subjects, icon: <BookOpen size={20} />, color: '#D97706' },
              { label: 'Attachments', value: teacherStats.attachments, icon: <Paperclip size={20} />, color: '#7C3AED' },
              { label: 'Video Links', value: teacherStats.videoEmbeds, icon: <FileText size={20} />, color: '#DB2777' },
            ].map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-card-icon" style={{ background: `${s.color}14`, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="stat-card-value">{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Derived / insight cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {teacherStats.mostPublishedYear && (
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div className="stat-card-icon" style={{ background: '#FEF3C714', color: '#D97706', flexShrink: 0 }}><Calendar size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Published Year</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{teacherStats.mostPublishedYear}</div>
                </div>
              </div>
            )}
            {teacherStats.mostActiveProjectYear && (
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div className="stat-card-icon" style={{ background: '#D1FAE514', color: '#059669', flexShrink: 0 }}><TrendingUp size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Most Active Project Year</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{teacherStats.mostActiveProjectYear}</div>
                </div>
              </div>
            )}
            {teacherStats.distinctJournals > 0 && (
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div className="stat-card-icon" style={{ background: '#EDE9FE14', color: '#7C3AED', flexShrink: 0 }}><Newspaper size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distinct Journals</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>{teacherStats.distinctJournals}</div>
                </div>
              </div>
            )}
            {teacherStats.latestPub && (
              <div className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div className="stat-card-icon" style={{ background: '#FEE2E214', color: '#DC2626', flexShrink: 0 }}><Award size={18} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Publication ({teacherStats.latestPub.year})</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{teacherStats.latestPub.title}</div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Module tiles ─────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Access</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {modules.map((m) => (
          <button
            key={m.to}
            className="card"
            onClick={() => navigate(m.to)}
            style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', border: '1px solid var(--color-border)', textAlign: 'left', transition: 'box-shadow 0.15s', background: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-lg)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
          >
            <div className="stat-card-icon" style={{ width: 40, height: 40 }}>{m.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}>{m.label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{m.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
