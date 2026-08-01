import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ExternalLink } from 'lucide-react';

import api from '../../services/api';

export default function Hero() {
  const [settings, setSettings] = useState(null);
  const [counts, setCounts] = useState({ projects: 0, skills: 0, certificates: 0, experience: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [settingsRes, projectsRes, skillsRes, certsRes, expRes] = await Promise.all([
          api.get('/settings'),
          api.get('/projects'),
          api.get('/skills'),
          api.get('/certificates'),
          api.get('/experience'),
        ]);

        if (!mounted) return;

        setSettings(settingsRes.data || {});

        setCounts({
          projects: Array.isArray(projectsRes.data) ? projectsRes.data.filter((p) => p.featured).length : 0,
          skills: Array.isArray(skillsRes.data) ? skillsRes.data.length : 0,
          certificates: Array.isArray(certsRes.data) ? certsRes.data.length : 0,
          experience: Array.isArray(expRes.data) ? expRes.data.length : 0,
        });
      } catch (err) {
        // keep silent — UI shows only available fields
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const primaryTech = useMemo(() => {
    if (!settings) return [];
    const tech = settings.primaryTechnologies || settings.techStack || '';
    if (Array.isArray(tech)) return tech.slice(0, 6);
    if (typeof tech === 'string' && tech.length) return tech.split(',').map((s) => s.trim()).slice(0, 6);
    return ['React', 'Node.js', 'TypeScript', 'Tailwind', 'AWS', 'GraphQL'];
  }, [settings]);

  function handleContactClick(e) {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 120);
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section id="hero" aria-busy={loading} className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="pointer-events-none absolute -right-10 top-4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="mx-auto grid gap-10 lg:grid-cols-[1.2fr_0.95fr] xl:max-w-[1200px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-300 shadow-sm shadow-slate-950/20">
            {settings?.badgeText || 'Senior Software Engineer'}
          </div>

          <div className="space-y-5">
            <h1 className="text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.92] font-extrabold tracking-tight text-white">
              {settings?.heroTitle || settings?.name || 'Designing product-grade engineering experiences.'}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              {settings?.heroDescription || 'Building polished, scalable frontend systems and launch-ready products for ambitious teams.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Link to="/projects" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Explore featured work
            </Link>
            <button onClick={handleContactClick} className="inline-flex items-center justify-center rounded-full border border-slate-800 bg-slate-900 px-6 py-4 text-sm font-semibold text-slate-200 transition hover:border-slate-700 hover:text-white">
              Hire me
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Featured work" value={counts.projects} />
            <StatCard label="Technologies" value={counts.skills} />
            <StatCard label="Credentials" value={counts.certificates} />
            <StatCard label="Experience" value={counts.experience} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            {settings?.github && (
              <a href={settings.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
                <ExternalLink className="h-4 w-4" /> GitHub
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
                <ExternalLink className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {settings?.resumeUrl && (
              <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
                <Download className="h-4 w-4" /> Resume
              </a>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/30">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/0 to-slate-950/70" />
          <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute left-0 top-20 h-20 w-20 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative rounded-[1.75rem] border border-slate-800 bg-slate-950 p-4">
            <img src={settings?.profileUrl || '/portrait.svg'} alt={settings?.name || 'Profile portrait'} className="h-[320px] w-full rounded-[1.5rem] object-cover" />
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Availability</p>
              <p className="mt-3 text-base font-semibold text-white">{settings?.status || 'Open to senior engineering partnerships'}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {primaryTech.slice(0, 3).map((tech) => (
                <div key={tech} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-center text-sm text-slate-300">
                  {tech}
                </div>
              ))}
            </div>

            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/75 p-5 text-slate-300">
              <div className="text-xs uppercase tracking-[0.35em] text-slate-500">Profile snapshot</div>
              <p className="mt-3 text-sm leading-7">{settings?.aboutMe || 'A product-minded engineer specializing in polished interfaces, reliable systems, and modern developer experiences.'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-center shadow-sm shadow-slate-950/10">
      <div className="text-3xl font-semibold text-white">{value || '—'}</div>
      <div className="mt-1 text-sm uppercase tracking-[0.35em] text-slate-500">{label}</div>
    </div>
  );
}
