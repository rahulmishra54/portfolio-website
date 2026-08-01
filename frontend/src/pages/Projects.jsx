import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/projects');
        if (active) {
          setProjects(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load projects.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Projects</p>
        <h1 className="text-4xl font-semibold text-white">Selected work for product teams and founders.</h1>
        <p className="max-w-2xl text-slate-400">A collection of shipping-level work built with measurable clarity, strong architecture, and thoughtful product decisions.</p>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">Loading projects…</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-8 py-12 text-rose-200">{error}</div>
      ) : !projects.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">No projects are available yet.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="rounded-3xl border border-slate-800 bg-slate-950 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{project.featured ? 'Featured' : 'Case study'}</p>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-white">{project.title}</h2>
              <p className="mt-4 text-slate-400 leading-7">{project.description || 'More detail will be added as the project evolves.'}</p>

              {project.techStack?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{tech}</span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={`/projects/${project._id}`} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                  Read more
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
                    <ExternalLink className="h-4 w-4" />
                    Code
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
