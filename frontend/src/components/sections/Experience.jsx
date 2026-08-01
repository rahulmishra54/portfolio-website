import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock3, Briefcase } from 'lucide-react';
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
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(value));
  };

  return (
    <section id="experience" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -left-10 top-8 h-64 w-64 rounded-full bg-slate-500/10 blur-3xl" />
      <div className="relative space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Experience</p>
          <h2 className="text-4xl font-semibold text-white">A timeline of engineering leadership, launch decisions, and product velocity.</h2>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">
            {loading
              ? 'Loading experience timeline…'
              : error
              ? 'There was an issue loading your experience history.'
              : 'Roles and collaborations that showcase where product outcomes met strong execution.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Loading experience…</div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-12 text-rose-200">{error}</div>
        ) : !items.length ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Experience entries are not available yet.</div>
        ) : (
          <div className="space-y-10">
            {items.map((item, index) => {
              const reverse = index % 2 === 1;
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className={`grid gap-6 rounded-[1.75rem] border border-slate-800 bg-slate-900 p-8 shadow-sm shadow-slate-950/10 ${reverse ? 'lg:grid-cols-[0.95fr_1.05fr]' : 'lg:grid-cols-[1.05fr_0.95fr]'}`}
                >
                  <div className={`${reverse ? 'order-2 lg:order-1' : 'lg:order-1'}`}>
                    <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-sky-300">
                      <Briefcase className="h-4 w-4" />
                      <span>{item.company || 'Company'}</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">{item.role}</h3>
                    <p className="mt-4 max-w-xl text-slate-400 leading-8">{item.description || 'Delivered product-facing experiences with robust front-end architecture and cross-functional clarity.'}</p>
                  </div>

                  <div className="space-y-6 rounded-[1.75rem] border border-slate-800 bg-slate-950 p-6 text-slate-400">
                    <div className="rounded-3xl bg-slate-900 p-4">
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Tenure</p>
                      <p className="mt-2 text-base font-semibold text-white">{formatDate(item.startDate)} — {item.currentlyWorking ? 'Present' : formatDate(item.endDate)}</p>
                    </div>
                    {item.technologies?.length ? (
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Tech used</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span key={tech} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock3 className="h-4 w-4" />
                      <span>{item.currentlyWorking ? 'Active role' : 'Completed engagement'}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
