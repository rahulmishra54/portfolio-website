import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock3 } from 'lucide-react';
import api from '../services/api';

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/blogs/${id}`);
        if (active) {
          setBlog(response.data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load the article.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBlog();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">Loading article…</div>;
  }

  if (error) {
    return <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-8 py-12 text-rose-200">{error}</div>;
  }

  if (!blog) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">The article could not be found.</div>;
  }

  return (
    <div className="space-y-8">
      <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to articles
      </Link>

      <article className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <BookOpen className="h-4 w-4 text-sky-400" />
          <span>{blog.category || 'Writing'}</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{blog.readingTime ? `${blog.readingTime} min read` : 'Quick read'}</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-white">{blog.title}</h1>
        <div className="mt-8 prose prose-invert max-w-none text-slate-400 leading-8">
          {blog.content ? <p>{blog.content}</p> : <p>The full article content is not available yet.</p>}
        </div>
      </article>
    </div>
  );
}
