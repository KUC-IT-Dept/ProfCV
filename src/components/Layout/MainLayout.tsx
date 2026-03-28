import { useState, useEffect, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props { children: ReactNode; }

export default function MainLayout({ children }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebarOnMobile = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} closeSidebar={closeSidebarOnMobile} />
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          onClick={closeSidebarOnMobile}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 30, transition: 'opacity 0.3s' }}
          aria-hidden="true"
        />
      )}

      <div className="main-content">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="page-content" onClick={closeSidebarOnMobile}>{children}</main>
      </div>
    </div>
  );
}
