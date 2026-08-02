import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

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

  const featuredProject = useMemo(() => projects.find((project) => project.featured), [projects]);
  const sliderProjects = useMemo(
    () => projects.filter((project) => project._id !== featuredProject?._id),
    [projects, featuredProject]
  );

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let frame = null;

    const updateIndex = () => {
      if (!slider) return;
      const cards = Array.from(slider.children);
      const { left: containerLeft } = slider.getBoundingClientRect();
      const distances = cards.map((card) => Math.abs(card.getBoundingClientRect().left - containerLeft));
      const nearest = distances.indexOf(Math.min(...distances));
      setActiveIndex(nearest);
    };

    const handleScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateIndex);
    };

    slider.addEventListener('scroll', handleScroll, { passive: true });
    updateIndex();

    return () => {
      slider.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sliderProjects.length]);

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.children[index];
    if (!card) return;
    slider.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' });
  };

  const handleArrow = (direction) => {
    const nextIndex = Math.max(0, Math.min(activeIndex + direction, sliderProjects.length - 1));
    scrollToIndex(nextIndex);
  };

  return (
    <section id="projects" className="relative overflow-hidden rounded-[2.5rem] border border-[#27354E] bg-[#0D1424]/80 p-8 shadow-[0_40px_100px_rgba(3,12,34,0.25)] sm:p-10">
      <div className="pointer-events-none absolute -right-14 top-8 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-14 h-60 w-60 -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-3xl" />

      <div className="relative space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-[#3B82F6]">Projects</p>
          <h2 className="text-4xl font-semibold text-white">Launch-ready work with polished UI, product clarity, and platform reliability.</h2>
          <p className="max-w-3xl text-lg leading-8 text-[#B6C2D9]">
            {loading
              ? 'Loading projects…'
              : error
              ? 'There was an issue loading the project gallery.'
              : 'A curated showcase of work designed for product teams and founders who need fast, premium experiences.'}
          </p>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">Loading projects…</div>
        ) : error ? (
          <div className="rounded-[2rem] border border-[#E11D48]/30 bg-[#63171B]/10 p-12 text-[#F9A8D4]">{error}</div>
        ) : !projects.length ? (
          <div className="rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-12 text-[#7C879C]">No projects are available yet.</div>
        ) : (
          <>
            {featuredProject && (
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="grid gap-8 overflow-hidden rounded-[2rem] border border-[#27354E] bg-[#141C2E] p-8 lg:grid-cols-[1.2fr_0.9fr] xl:p-10"
              >
                <div className="space-y-5">
                  <span className="inline-flex items-center rounded-full bg-[#0D1424] px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#7C3AED]">Featured Case Study</span>
                  <h3 className="text-3xl font-semibold text-white sm:text-4xl">{featuredProject.title}</h3>
                  <p className="max-w-2xl text-[#B6C2D9] leading-8">{featuredProject.description || 'A high-impact product delivery with polished user experience and measurable technical quality.'}</p>
                  <div className="flex flex-wrap gap-3">
                    {featuredProject.techStack?.map((tech) => (
                      <span key={tech} className="rounded-full border border-[#27354E] bg-[#0D1424] px-3 py-1 text-xs text-[#B6C2D9]">{tech}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {featuredProject.liveUrl && (
                      <a href={featuredProject.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2563EB]">
                        <ExternalLink className="h-4 w-4" /> Live demo
                      </a>
                    )}
                    {featuredProject.githubUrl && (
                      <a href={featuredProject.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#27354E] bg-[#0D1424] px-5 py-3 text-sm font-semibold text-[#B6C2D9] transition hover:border-[#3B82F6] hover:text-white">
                        <ExternalLink className="h-4 w-4" /> Code
                      </a>
                    )}
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] shadow-[0_24px_80px_rgba(3,12,34,0.35)]">
                  {featuredProject.images?.[0] ? (
                    <img src={featuredProject.images[0]} alt={featuredProject.title} className="h-full min-h-[320px] w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-[320px] items-center justify-center bg-[#141C2E] p-8 text-[#7C879C]">Screenshot unavailable</div>
                  )}
                </div>
              </motion.article>
            )}

            {sliderProjects.length > 0 && (
              <div className="relative">
                <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => handleArrow(-1)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#27354E] bg-[#141C2E] text-[#B6C2D9] transition hover:border-[#3B82F6] hover:bg-[#0D1424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50"
                    aria-label="Scroll previous projects"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-[#27354E] bg-[#141C2E] px-4 py-6">
                  <div ref={sliderRef} className="scrollbar-none flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
                    {sliderProjects.map((project, index) => (
                      <motion.article
                        key={project._id}
                        whileHover={{ y: -6 }}
                        className="min-w-[310px] max-w-[340px] snap-start overflow-hidden rounded-[1.75rem] border border-[#27354E] bg-[#0D1424] p-6 shadow-[0_24px_60px_rgba(3,12,34,0.25)]"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.35em] text-[#7C879C]">
                          <span>{project.featured ? 'Featured' : 'Case study'}</span>
                          {project.liveUrl && <ExternalLink className="h-4 w-4 text-[#3B82F6]" />}
                        </div>
                        <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                        <p className="mt-4 text-sm leading-7 text-[#B6C2D9]">{project.description || 'A polished delivery of product and engineering intent.'}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.techStack?.map((tech) => (
                            <span key={tech} className="rounded-full border border-[#27354E] bg-[#0D1424] px-3 py-1 text-xs text-[#B6C2D9]">{tech}</span>
                          ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                          <a href={`/projects/${project._id}`} className="inline-flex items-center gap-2 rounded-full border border-[#27354E] bg-[#141C2E] px-4 py-2 text-sm font-semibold text-[#B6C2D9] transition hover:border-[#3B82F6] hover:text-white">
                            Preview
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>

                <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
                  <button
                    type="button"
                    onClick={() => handleArrow(1)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#27354E] bg-[#141C2E] text-[#B6C2D9] transition hover:border-[#3B82F6] hover:bg-[#0D1424] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50"
                    aria-label="Scroll next projects"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 flex justify-center gap-2">
                  {sliderProjects.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => scrollToIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? 'bg-[#3B82F6] shadow-[0_0_0_4px_rgba(59,130,246,0.15)]' : 'bg-[#27354E]'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-[#27354E] bg-[#141C2E] px-5 py-3 text-sm font-semibold text-[#B6C2D9] transition hover:border-[#3B82F6] hover:text-white"
          >
            View all projects
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

