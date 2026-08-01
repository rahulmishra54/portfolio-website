import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/projects');
        if (mounted) {
          setProjects(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load projects.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      mounted = false;
    };
  }, []);

  const featuredProjects = projects.filter((project) => project.featured);
  const featuredProject = featuredProjects[0];
  const otherProjects = projects.filter((project) => project._id !== featuredProject?._id).slice(0, 2);

  return (
    <section id="projects" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-12 top-10 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="relative space-y-10">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Projects</p>
          <h2 className="text-4xl font-semibold text-white">Work that blends product clarity with technical precision.</h2>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">
            {loading
              ? 'Loading projects…'
              : error
              ? 'There was an issue loading the project gallery.'
              : 'A curated set of engineering work showing launch-ready experiences, reliable interfaces, and design-driven implementation.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Loading projects…</div>
        ) : error ? (
          <div className="rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-12 text-rose-200">{error}</div>
        ) : !projects.length ? (
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">No projects are available yet.</div>
        ) : (
          <div className="space-y-10">
            {featuredProject && (
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="grid gap-8 rounded-[2rem] border border-slate-800 bg-slate-900 p-8 lg:grid-cols-[1.2fr_0.85fr] xl:p-10"
              >
                <div className="space-y-6">
                  <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Featured work</p>
                  <h3 className="text-3xl font-semibold text-white sm:text-4xl">{featuredProject.title}</h3>
                  <p className="max-w-2xl text-slate-300 leading-8">{featuredProject.description || 'A highlighted project showing product depth, performance, and user experience.'}</p>
                  {featuredProject.techStack?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.techStack.map((tech) => (
                        <span key={tech} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    {featuredProject.githubUrl && (
                      <a
                        href={featuredProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View code
                      </a>
                    )}
                    {featuredProject.liveUrl && (
                      <a
                        href={featuredProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live demo
                      </a>
                    )}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/20">
                  {featuredProject.images?.[0] ? (
                    <img src={featuredProject.images[0]} alt={featuredProject.title} className="h-full min-h-[320px] w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center bg-slate-900 p-8 text-slate-500">Screenshot unavailable</div>
                  )}
                </div>
              </motion.article>
            )}

            <div className="space-y-8">
              {otherProjects.map((project, index) => {
                const reverse = index % 2 === 1;
                return (
                  <motion.article
                    key={project._id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className={`grid gap-6 rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/10 lg:grid-cols-[${reverse ? '0.95fr_1.05fr' : '1.05fr_0.95fr'}] xl:p-8`}
                  >
                    {reverse && project.images?.[0] ? (
                      <div className="order-2 overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
                        <img src={project.images[0]} alt={project.title} className="h-full min-h-[240px] w-full object-cover" />
                      </div>
                    ) : null}

                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-400">
                        {project.featured ? 'Featured' : 'Case study'}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                      <p className="max-w-xl text-slate-400 leading-7">{project.description || 'A polished product effort built with clarity and engineering depth.'}</p>
                      {project.techStack?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="flex flex-wrap gap-3">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Live demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-900"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Code
                          </a>
                        )}
                        <a
                          href={`/projects/${project._id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                        >
                          Preview
                        </a>
                      </div>
                    </div>

                    {!reverse && project.images?.[0] ? (
                      <div className="overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950">
                        <img src={project.images[0]} alt={project.title} className="h-full min-h-[240px] w-full object-cover" />
                      </div>
                    ) : null}
                  </motion.article>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
