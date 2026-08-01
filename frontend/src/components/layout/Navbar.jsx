import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import api from '../../services/api';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/#about', section: 'about' },
  { label: 'Skills', to: '/#skills', section: 'skills' },
  { label: 'Experience', to: '/#experience', section: 'experience' },
  { label: 'Contact', to: '/#contact', section: 'contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await api.get('/settings');
        if (mounted) {
          setSettings(response.data);
        }
      } catch {
        // Keep navbar lightweight even if settings fail.
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('home');
      return;
    }

    const sectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'certificates', 'blogs', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.intersectionRatio < b.intersectionRatio ? 1 : -1))[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id);
        }
      },
      { threshold: [0.4] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  const navigate = useNavigate();

  function handleSectionClick(e, item) {
    if (!item.section) return;
    e?.preventDefault();
    setMenuOpen(false);

    const scrollTo = () => {
      const el = document.getElementById(item.section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollTo, 120);
    } else {
      scrollTo();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur transition-shadow shadow-slate-950/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-lg font-semibold tracking-tight text-white">
            Portfolio
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-200 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav
          className={`flex flex-col gap-2 rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl shadow-slate-950/20 transition-all md:flex-row md:items-center md:border-none md:bg-transparent md:p-0 md:shadow-none ${menuOpen ? 'block' : 'hidden'} md:block`}
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = item.section
              ? activeSection === item.section && location.pathname === '/'
              : location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-slate-900 text-white shadow-sm shadow-slate-950/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={(e) => {
                  setMenuOpen(false);
                  handleSectionClick(e, item);
                }}
              >
                {item.label}
              </NavLink>
            );
          })}

          <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-800 pt-3 md:mt-0 md:flex-row md:border-none md:pt-0">
            {settings?.github && (
              <a href={settings.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-700 hover:text-white">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .296c-6.63 0-12 5.37-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.468-2.381 1.235-3.221-.123-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.003-.403c1.018.005 2.042.138 3.003.403 2.29-1.552 3.296-1.23 3.296-1.23.653 1.653.241 2.874.118 3.176.77.84 1.233 1.911 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.37.823 1.102.823 2.222 0 1.605-.014 2.898-.014 3.293 0 .321.216.694.825.576C20.565 22.092 24 17.592 24 12.296c0-6.63-5.373-12-12-12"/>
                </svg>
                GitHub
              </a>
            )}
            {settings?.resumeUrl && (
              <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                <FileText className="h-4 w-4" /> Resume
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
