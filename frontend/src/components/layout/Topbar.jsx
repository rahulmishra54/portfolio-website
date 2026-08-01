import React from 'react';
import { Moon, Sun, Bell, LayoutGrid } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

export default function Topbar({ onToggleSidebar = () => {} }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white md:hidden"
            aria-label="Toggle sidebar"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Dashboard</p>
            <h1 className="text-xl font-semibold text-slate-100">Overview</h1>
            <div className="mt-1">
              <Breadcrumbs />
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
            aria-label="Theme toggle"
          >
            <Moon className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200">
            Admin
          </div>
        </div>
      </div>
    </header>
  );
}
