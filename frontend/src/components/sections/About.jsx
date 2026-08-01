import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Mail, Phone, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function About() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/settings');
        if (mounted) {
          setSettings(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load about content.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const summary = settings?.heroDescription;
  const description = settings?.aboutMe;
  const email = settings?.email;
  const phone = settings?.phone;

  return (
    <section id="about" className="relative overflow-hidden rounded-[2.25rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative grid gap-10 xl:grid-cols-[1.15fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-sky-300">
            <Sparkles className="h-5 w-5" /> About
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Engineering product experiences with precision, speed, and empathy.</h2>
          <p className="max-w-3xl text-lg leading-9 text-slate-300">
            {loading
              ? 'Loading about content…'
              : error
              ? error
              : description || 'A product-focused software engineer building interfaces, platforms, and launch-ready execution systems.'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Core belief</p>
              <p className="mt-4 text-slate-300 leading-8">Good engineering is invisible until it’s missed. I prioritize clarity, maintainability, and product results.</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/10">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Process</p>
              <ul className="mt-4 space-y-3 text-slate-400">
                <li>• Product-first planning with measurable outcomes</li>
                <li>• Design system consistency in UI and code</li>
                <li>• Fast feedback loops for realistic iteration</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-slate-950/30"
        >
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-slate-500">
            <Briefcase className="h-5 w-5" /> Profile snapshot
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-[1.75rem] bg-slate-950 p-6">
              <p className="text-sm text-slate-500">Current focus</p>
              <p className="mt-3 text-xl font-semibold text-white">Senior engineering leadership for product-driven teams</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="mt-2 text-slate-300">{email || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <p className="mt-2 text-slate-300">{phone || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Experience highlight</p>
              <p className="mt-4 text-slate-300">Building platform-level interfaces, content workflows, and launch-ready marketing experiences with reliability and polish.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
