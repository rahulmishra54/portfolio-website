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
    <section id="about" className="relative overflow-hidden rounded-[2.25rem] border border-[#27354E] bg-[#0D1424]/80 p-8 sm:p-10">
      <div className="pointer-events-none absolute -left-10 top-8 h-44 w-44 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="relative grid gap-10 xl:grid-cols-[1.15fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-[#3B82F6]">
            <Sparkles className="h-5 w-5" /> About
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Engineering product experiences with precision, speed, and empathy.</h2>
          <p className="max-w-3xl text-lg leading-9 text-[#B6C2D9]">
            {loading
              ? 'Loading about content…'
              : error
              ? error
              : description || 'A product-focused software engineer building interfaces, platforms, and launch-ready execution systems.'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-6 shadow-sm shadow-[#000000]/10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#7C879C]">Core belief</p>
              <p className="mt-4 text-[#B6C2D9] leading-8">Good engineering is invisible until it’s missed. I prioritize clarity, maintainability, and product results.</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-6 shadow-sm shadow-[#000000]/10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#7C879C]">Process</p>
              <ul className="mt-4 space-y-3 text-[#B6C2D9]">
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
          className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-8 shadow-[0_40px_120px_rgba(3,12,34,0.25)]"
        >
          <div className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-[#7C3AED]">
            <Briefcase className="h-5 w-5" /> Profile snapshot
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-[1.75rem] bg-[#0D1424] p-6">
              <p className="text-sm text-[#7C879C]">Current focus</p>
              <p className="mt-3 text-xl font-semibold text-white">Senior engineering leadership for product-driven teams</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#7C879C]">Email</p>
                    <p className="mt-2 text-[#B6C2D9]">{email || 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#7C879C]">Phone</p>
                    <p className="mt-2 text-[#B6C2D9]">{phone || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Experience highlight</p>
              <p className="mt-4 text-[#B6C2D9]">Building platform-level interfaces, content workflows, and launch-ready marketing experiences with reliability and polish.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
