import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock3 } from 'lucide-react';
import api from '../services/api';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
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
          setBlogs(Array.isArray(response.data) ? response.data : []);
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
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Articles</p>
        <h1 className="text-4xl font-semibold text-white">Writing on product craft, frontend systems, and practical delivery.</h1>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">Loading articles…</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-8 py-12 text-rose-200">{error}</div>
      ) : !blogs.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">No blog posts are available yet.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {blogs.filter((blog) => blog.published !== false).map((blog, index) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="rounded-3xl border border-slate-800 bg-slate-950 p-6"
            >
              <Link to={`/blogs/${blog._id}`} className="group block">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <BookOpen className="h-4 w-4 text-sky-400" />
                  <span>{blog.category || 'Insight'}</span>
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-white group-hover:text-sky-400">{blog.title}</h2>
                <p className="mt-3 text-slate-400 leading-7">{blog.content?.replace(/<[^>]*>/g, ' ').slice(0, 220) || 'The full article will be shared soon.'}</p>
                <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  <span>{blog.readingTime ? `${blog.readingTime} min read` : 'Quick read'}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
