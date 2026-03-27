import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface Props { children: React.ReactNode; }

export default function MainLayout({ children }: Props) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
