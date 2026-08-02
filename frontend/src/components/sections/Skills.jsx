import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

function getSkillStrength(name) {
  const score = Math.min(95, Math.max(60, name.length * 8 + (name.charCodeAt(0) % 10) * 2));
  return score;
}

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
    <section id="skills" className="relative overflow-hidden rounded-[2.5rem] border border-[#27354E] bg-[#0D1424]/80 p-8 shadow-[0_40px_100px_rgba(3,12,34,0.25)] sm:p-10">
      <div className="pointer-events-none absolute -right-14 top-10 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-24 h-60 w-60 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="relative space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#3B82F6]">Skills</p>
          <h2 className="text-4xl font-semibold text-white">The technical craft powering premium product delivery.</h2>
          <p className="text-lg leading-8 text-[#B6C2D9]">
            {loading
              ? 'Loading skill set…'
              : error
              ? 'There was an issue retrieving skills.'
              : 'A modern toolkit of systems, frameworks, and workflows used to move product from concept to launch.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">Loading skills…</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-[#E11D48]/30 bg-[#63171B]/10 p-12 text-[#F9A8D4]">{error}</div>
        ) : !skills.length ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">No skills are available yet.</div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {categoryKeys.map((category, index) => (
              <motion.article
                key={category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-8 shadow-[0_24px_60px_rgba(3,12,34,0.2)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#7C3AED]">{category}</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{groups[category].length} skill{groups[category].length === 1 ? '' : 's'}</h3>
                  </div>
                  <div className="rounded-3xl bg-[#0D1424] px-4 py-3 text-sm text-[#B6C2D9]">Fast-moving stack</div>
                </div>

                <div className="mt-6 space-y-4">
                  {groups[category].map((skill) => {
                    const strength = getSkillStrength(skill.name);
                    return (
                      <motion.div
                        key={skill._id}
                        whileHover={{ y: -4 }}
                        className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-5 transition-shadow hover:shadow-[0_20px_60px_rgba(59,130,246,0.18)]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-base font-semibold text-white">{skill.name}</p>
                            {skill.icon && <p className="mt-2 text-sm text-[#B6C2D9]">{skill.icon}</p>}
                          </div>
                          <span className="rounded-full bg-[#0D1424] px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#7C879C]">{strength}%</span>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#0D1424]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] transition-all" style={{ width: `${strength}%` }} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

