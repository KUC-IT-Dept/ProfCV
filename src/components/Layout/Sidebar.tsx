import React, { useState, useEffect } from 'react';
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
  X
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

export default function Sidebar({ isOpen, isMobile, closeSidebar }: { isOpen: boolean; isMobile: boolean; closeSidebar: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <nav className="sidebar" aria-label="Main navigation">
 

 
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', overflow: 'hidden' }}>
            <GraduationCap size={24} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span className="sidebar-logo-title hidden-on-collapse text-truncate">Prof CV</span>
          </div>
          <div className="sidebar-logo-sub hidden-on-collapse text-truncate">Academic Portfolio Platform</div>
          {isMobile && (
            <button onClick={closeSidebar} style={{ position: 'absolute', right: '1rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="sidebar-nav">
          <div className="sidebar-nav-section hidden-on-collapse">Navigation</div>
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => { if (isMobile) closeSidebar(); }}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              title={(!isOpen && !isMobile) ? item.label : undefined}
            >
              <div style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</div>
              <span className="hidden-on-collapse" style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* User info + logout */}
        <div className="logout-section">
          <div className="hidden-on-collapse" style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }} title={user?.name}>
              {user?.name}
            </div>
            <div style={{
              fontSize: '0.75rem', color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}>
              {user ? ROLE_LABELS[user.role] : ''}
              {user?.department ? ` · ${user.department}` : ''}
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={() => setShowLogoutModal(true)}
            aria-label="Sign Out"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLogoutModal(false)} aria-label="Close modal">
              <X size={20} />
            </button>
            <div className="modal-icon-wrapper">
              <LogOut size={28} color="#ef4444" />
            </div>
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to sign out?</p>

            <div className="modal-actions">
              <button
                className="modal-btn modal-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-logout-btn"
                onClick={handleConfirmLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
