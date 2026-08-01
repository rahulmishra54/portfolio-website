import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/projects/${id}`);
        if (active) {
          setProject(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load project details.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProject();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">Loading project details…</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-8 py-12 text-rose-200">{error}</div>;
  }

  if (!project) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">The project you requested could not be found.</div>;
  }

  return (
    <div className="space-y-8">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Project detail</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{project.title}</h1>
          </div>
          <div className="flex gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800">
                <ExternalLink className="h-4 w-4" />
                Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                <ExternalLink className="h-4 w-4" />
                Live demo
              </a>
            )}
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-slate-400 leading-8">{project.description || 'Project details are being prepared for publication.'}</p>

        {project.techStack?.length ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span key={tech} className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">{tech}</span>
            ))}
          </div>
        ) : null}

        {project.features?.length ? (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white">Highlights</h2>
            <ul className="mt-4 space-y-3 text-slate-400">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3"><span className="mt-2 h-2 w-2 rounded-full bg-sky-400" />{feature}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {project.images?.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {project.images.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${project.title} view ${index + 1}`} className="h-64 w-full rounded-3xl border border-slate-800 object-cover" />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
