import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSkills() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/skills');
        if (active) {
          setSkills(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load skills.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSkills();
    return () => {
      active = false;
    };
  }, []);

  const groups = skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const categoryKeys = Object.keys(groups);

  return (
    <section id="skills" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-16 top-12 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Skills</p>
          <h2 className="text-4xl font-semibold text-white">The technical craft powering modern products.</h2>
          <p className="text-lg leading-8 text-slate-400">
            {loading
              ? 'Loading skill set…'
              : error
              ? 'There was an issue retrieving skills.'
              : 'Key tools, languages, and systems grouped by the ways I solve product problems.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Loading skills…</div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-12 text-rose-200">{error}</div>
        ) : !skills.length ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">No skills are available yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {categoryKeys.map((category, index) => (
              <motion.article
                key={category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-8 shadow-sm shadow-slate-950/10"
              >
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{category}</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{groups[category].length} skill{groups[category].length === 1 ? '' : 's'}</h3>
                <div className="mt-6 grid gap-3">
                  {groups[category].map((skill) => (
                    <div key={skill._id} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
                      <p className="text-base font-semibold text-white">{skill.name}</p>
                      {skill.icon && <p className="mt-2 text-sm text-slate-400">{skill.icon}</p>}
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
