import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'My Profile',
  '/cv-export': 'CV Export',
  '/directory': 'Faculty Directory',
  '/managerial-export': 'Data Export',
  '/hierarchy': 'Org Hierarchy',
};

export default function Topbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'Prof CV';

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Navigation Sidebar"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
        >
          <Menu size={24} color="var(--color-text)" />
        </button>
        <h1 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8125rem',
            fontWeight: 700,
            flexShrink: 0,
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          {user?.photo ? (
            <img src={user.photo} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ fontSize: '0.8125rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{user?.name}</div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{user?.email}</div>
        </div>
      </div>
    </header>
  );
}
