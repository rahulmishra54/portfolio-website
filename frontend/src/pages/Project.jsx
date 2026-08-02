import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [related, setRelated] = useState([]);
  const [previousProject, setPreviousProject] = useState(null);
  const [nextProject, setNextProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setLoading(true);
      setError('');
      setProject(null);
      setSelectedImage(null);

      try {
        const [projectRes, projectsRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get('/projects'),
        ]);

        if (!active) return;

        const data = projectRes.data;
        const allProjects = Array.isArray(projectsRes.data) ? projectsRes.data : [];

        setProject(data);
        setSelectedImage(data.images?.[0] || null);
        setRelated(allProjects.filter((item) => item._id !== id).slice(0, 3));

        const currentIndex = allProjects.findIndex((item) => item._id === id);
        setPreviousProject(currentIndex > 0 ? allProjects[currentIndex - 1] : null);
        setNextProject(currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load project details.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();
    return () => {
      active = false;
    };
  }, [id]);

  const imageCount = project?.images?.length || 0;

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to projects
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Project detail</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{project.title}</h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Live status</p>
                <p className="mt-3 text-base font-semibold text-white">{project.featured ? 'Featured case study' : 'Product delivery'}</p>
              </div>
              <div className="rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Published</p>
                <p className="mt-3 text-base font-semibold text-white">{project.liveUrl ? 'Live demo available' : 'No live demo'}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {project.techStack?.length ? project.techStack.map((tech) => (
                  <span key={tech} className="rounded-full border border-[#27354E] bg-[#0D1424] px-3 py-1 text-xs text-[#B6C2D9]">{tech}</span>
                )) : <span className="rounded-full border border-[#27354E] bg-[#0D1424] px-3 py-1 text-xs text-[#7C879C]">No tech stack defined</span>}
              </div>

              <p className="text-slate-400 leading-8">{project.description || 'Project details are being prepared for publication.'}</p>
            </div>

            {project.features?.length ? (
              <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-6">
                <h2 className="text-xl font-semibold text-white">Highlights</h2>
                <ul className="mt-4 space-y-3 text-slate-400">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />{feature}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={project.liveUrl || '#'}
                target={project.liveUrl ? '_blank' : undefined}
                rel={project.liveUrl ? 'noreferrer' : undefined}
                className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${project.liveUrl ? 'bg-sky-500 text-slate-950 hover:bg-sky-400' : 'cursor-not-allowed bg-slate-800 text-slate-500'}`}
                aria-disabled={!project.liveUrl}
              >
                <ExternalLink className="h-4 w-4" />
                Live demo
              </a>
              <a
                href={project.githubUrl || '#'}
                target={project.githubUrl ? '_blank' : undefined}
                rel={project.githubUrl ? 'noreferrer' : undefined}
                className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition ${project.githubUrl ? 'border-[#27354E] bg-[#0D1424] text-[#B6C2D9] hover:border-[#3B82F6] hover:text-white' : 'cursor-not-allowed border-slate-800 bg-slate-800 text-slate-500'}`}
                aria-disabled={!project.githubUrl}
              >
                <ExternalLink className="h-4 w-4" />
                Code
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt={`${project.title} screenshot`} loading="lazy" className="h-full min-h-[320px] w-full object-cover" />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center bg-[#0D1424] p-6 text-[#7C879C]">Screenshot unavailable</div>
              )}
            </div>

            {imageCount > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {project.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-2xl border p-0 transition ${selectedImage === image ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-[#27354E]'}`}
                  >
                    <img src={image} alt={`${project.title} thumbnail ${index + 1}`} loading="lazy" className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}

            {imageCount > 0 ? (
              <p className="text-sm text-slate-500">{project.images.indexOf(selectedImage) + 1} / {imageCount}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {previousProject ? (
            <Link to={`/projects/${previousProject._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 transition hover:border-sky-500 hover:text-white">
              <div className="flex items-center gap-2 text-sky-300"><ChevronLeft className="h-4 w-4" /> Previous</div>
              <p className="mt-3 font-semibold text-white">{previousProject.title}</p>
            </Link>
          ) : null}
          {nextProject ? (
            <Link to={`/projects/${nextProject._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm text-slate-300 transition hover:border-sky-500 hover:text-white">
              <div className="flex items-center gap-2 text-sky-300">Next <ChevronRight className="h-4 w-4" /></div>
              <p className="mt-3 font-semibold text-white">{nextProject.title}</p>
            </Link>
          ) : null}
        </div>

        {related.length > 0 ? (
          <div className="mt-10 space-y-5">
            <h2 className="text-2xl font-semibold text-white">Related projects</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item._id} to={`/projects/${item._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-4 transition hover:border-sky-500 hover:bg-slate-950">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Related</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description?.slice(0, 90) || 'Project summary not available.'}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
