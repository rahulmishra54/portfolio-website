import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock3 } from 'lucide-react';
import api from '../../services/api';

export default function Experience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadExperience() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/experience');
        if (active) {
          setItems(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load experience.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadExperience();
    return () => {
      active = false;
    };
  }, []);

  const formatDate = (value) => {
    if (!value) return 'Present';
    const date = new Date(value);
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <section id="experience" className="relative overflow-hidden rounded-[2.5rem] border border-[#27354E] bg-[#0D1424]/80 p-8 shadow-[0_40px_100px_rgba(3,12,34,0.25)] sm:p-10">
      <div className="pointer-events-none absolute -left-14 top-12 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-[#7C3AED]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-24 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#3B82F6]/10 blur-3xl" />

      <div className="relative space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#3B82F6]">Experience</p>
          <h2 className="text-4xl font-semibold text-white">A product-focused timeline of leadership, delivery, and product velocity.</h2>
          <p className="max-w-3xl text-lg leading-8 text-[#B6C2D9]">
            {loading
              ? 'Loading experience timeline…'
              : error
              ? 'There was an issue loading your experience history.'
              : 'Roles and collaborations that showcase where product outcomes met strong execution.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">Loading experience…</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-[#E11D48]/30 bg-[#63171B]/10 p-12 text-[#F9A8D4]">{error}</div>
        ) : !items.length ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">Experience entries are not available yet.</div>
        ) : (
          <div className="relative border-l border-[#27354E] pl-8 md:pl-12">
            <div className="absolute left-0 top-0 h-full w-px bg-[#27354E]" />
            <div className="absolute left-0 top-0 flex h-full w-full justify-center">
              <div className="h-full w-2 rounded-full bg-gradient-to-b from-[#3B82F6] via-transparent to-[#7C3AED]/10" />
            </div>

            <div className="space-y-8">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="relative overflow-hidden rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-8 shadow-[0_24px_60px_rgba(3,12,34,0.2)]"
                >
                  <span className="absolute left-[-1.5rem] top-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#27354E] bg-[#0D1424] text-[#3B82F6] shadow-sm shadow-[#3B82F6]/15">
                    <Briefcase className="h-5 w-5" />
                  </span>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[#7C3AED]">
                        <span>{item.company || 'Company'}</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-semibold text-white">{item.role}</h3>
                      <p className="mt-4 text-[#B6C2D9] leading-7">{item.description || 'Delivered product-facing experiences with robust front-end architecture and cross-functional clarity.'}</p>
                    </div>
                    <div className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6 text-[#B6C2D9]">
                      <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Tenure</p>
                      <p className="mt-2 text-base font-semibold text-white">{formatDate(item.startDate)} — {item.currentlyWorking ? 'Present' : formatDate(item.endDate)}</p>
                      {item.technologies?.length ? (
                        <div className="mt-5">
                          <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Tech used</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.technologies.map((tech) => (
                              <span key={tech} className="rounded-full border border-[#27354E] bg-[#141C2E] px-3 py-1 text-xs text-[#B6C2D9]">{tech}</span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      <div className="mt-5 flex items-center gap-2 text-sm text-[#7C879C]">
                        <Clock3 className="h-4 w-4" />
                        <span>{item.currentlyWorking ? 'Active role' : 'Completed engagement'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

