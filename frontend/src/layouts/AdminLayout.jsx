import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-900 text-slate-100">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex-1 flex flex-col">
        <Topbar onToggleSidebar={toggleSidebar} />

        {sidebarOpen ? (
          <button
            type="button"
            onClick={closeSidebar}
            className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
            aria-label="Close sidebar"
          />
        ) : null}

        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
