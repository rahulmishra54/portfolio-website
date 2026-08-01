import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock3 } from 'lucide-react';
import api from '../../services/api';

export default function BlogsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBlogs() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/blogs');
        if (active) {
          const blogs = Array.isArray(response.data) ? response.data : [];
          setItems(blogs.filter((blog) => blog.published !== false));
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load blog posts.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlogs();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="blogs" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-slate-500/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Writing</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Ideas on product craft, interface systems, and frontend delivery.</h2>
          <p className="max-w-3xl text-lg leading-8 text-slate-400">
            {loading
              ? 'Loading articles…'
              : error
              ? error
              : 'Recent articles that connect product thinking with practical engineering execution.'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Featured thread</p>
              <p className="mt-4 text-slate-300 leading-7">Thoughtful work on product quality and the patterns used to ship better frontend systems.</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Format</p>
              <p className="mt-4 text-slate-300 leading-7">Short, readable posts built for quick insight and confident technical decision-making.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Loading articles…</div>
          ) : error ? (
            <div className="rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-12 text-rose-200">{error}</div>
          ) : !items.length ? (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">No published posts available yet.</div>
          ) : (
            items.slice(0, 3).map((item, index) => (
              <article key={item._id} className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-8 shadow-sm shadow-slate-950/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-slate-400">
                    <BookOpen className="h-4 w-4 text-sky-400" />
                    <span>{item.category || 'Insight'}</span>
                  </div>
                  <div className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.35em] text-slate-400">{item.readingTime ? `${item.readingTime} min` : 'Quick read'}</div>
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-slate-400 leading-8">{item.content?.replace(/<[^>]*>/g, ' ').slice(0, 180) || 'A short essay on product and engineering craft.'}</p>
              </article>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
