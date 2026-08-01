import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  FolderTree,
  BookOpen,
  Archive,
  CalendarDays,
  Award,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { to: '/admin/projects', label: 'Projects', icon: FolderTree },
  { to: '/admin/blogs', label: 'Blogs', icon: BookOpen },
  { to: '/admin/skills', label: 'Skills', icon: Archive },
  { to: '/admin/experience', label: 'Experience', icon: CalendarDays },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/resume', label: 'Resume', icon: FileText },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('token');
    onClose();
    navigate('/');
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-800 bg-slate-950 text-slate-100 transition-transform duration-200 md:static md:translate-x-0 md:flex ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex h-full flex-col justify-between p-5">
        <div>
          <div className="mb-8">
            <div className="text-xl font-semibold tracking-tight text-white">Admin panel</div>
            <p className="mt-1 text-sm text-slate-500">Manage portfolio content and messages.</p>
          </div>

          <nav className="space-y-1" aria-label="Admin navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                      isActive ? 'bg-slate-900 text-white shadow-sm shadow-slate-950/40' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`
                  }
                  onClick={onClose}
                >
                  <Icon className="h-4 w-4 flex-none" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6">
          <div className="border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-white"
            >
              <LogOut className="h-4 w-4 flex-none" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
