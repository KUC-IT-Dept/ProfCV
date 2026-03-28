import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  Share2,
  Download,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard', roles: ['SUPERADMIN', 'VC', 'HOD', 'TEACHER'] },
  { to: '/profile', icon: <User />, label: 'My Profile', roles: ['TEACHER'] },
  { to: '/cv-export', icon: <FileText />, label: 'CV Export', roles: ['TEACHER'] },
  { to: '/directory', icon: <Users />, label: 'Faculty Directory', roles: ['HOD', 'VC', 'SUPERADMIN'] },
  { to: '/managerial-export', icon: <Download />, label: 'Data Export', roles: ['HOD', 'VC', 'SUPERADMIN'] },
  { to: '/hierarchy', icon: <Share2 />, label: 'Org Hierarchy', roles: ['HOD', 'VC', 'SUPERADMIN'] },
];

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  VC: 'Vice Chancellor',
  HOD: 'Head of Department',
  TEACHER: 'Faculty',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="sidebar" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <GraduationCap size={20} color="var(--color-primary)" />
          <span className="sidebar-logo-title">Prof CV</span>
        </div>
        <div className="sidebar-logo-sub">Academic Portfolio Platform</div>
      </div>

      {/* Nav */}
      <div className="sidebar-nav">
        <div className="sidebar-nav-section">Navigation</div>
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User info + logout */}
      <div
        style={{
          padding: '0.875rem 1rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.625rem',
          position: 'sticky',
          bottom: 0,
          background: 'var(--color-surface)',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {user ? ROLE_LABELS[user.role] : ''}
            {user?.department ? ` · ${user.department}` : ''}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout} style={{ justifyContent: 'flex-start', padding: '0.375rem 0' }}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
