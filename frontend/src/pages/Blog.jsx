import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock3, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [previousBlog, setPreviousBlog] = useState(null);
  const [nextBlog, setNextBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBlog() {
      setLoading(true);
      setError('');
      setBlog(null);
      setPreviousBlog(null);
      setNextBlog(null);
      setRelated([]);

      try {
        const [blogRes, blogsRes] = await Promise.all([
          api.get(`/blogs/${id}`),
          api.get('/blogs'),
        ]);

        if (!active) return;

        const currentBlog = blogRes.data;
        const allBlogs = Array.isArray(blogsRes.data) ? blogsRes.data.filter((entry) => entry.published !== false) : [];

        setBlog(currentBlog);
        const index = allBlogs.findIndex((entry) => entry._id === id);
        setPreviousBlog(index > 0 ? allBlogs[index - 1] : null);
        setNextBlog(index >= 0 && index < allBlogs.length - 1 ? allBlogs[index + 1] : null);
        setRelated(allBlogs.filter((entry) => entry._id !== id).slice(0, 3));
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load the article.');
      } finally {
        if (active) setLoading(false);
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>
      </div>

      <article className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <BookOpen className="h-4 w-4 text-sky-400" />
          <span>{blog.category || 'Writing'}</span>
          <span className="text-slate-600">•</span>
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />{blog.readingTime ? `${blog.readingTime} min read` : 'Quick read'}</span>
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-white">{blog.title}</h1>

        {blog.thumbnail ? (
          <img src={blog.thumbnail} alt={blog.title} loading="lazy" className="mt-8 rounded-3xl border border-slate-800 object-cover" />
        ) : null}

        <div className="mt-8 prose prose-invert max-w-none text-slate-400 leading-8">
          {blog.content ? <p>{blog.content}</p> : <p>The full article content is not available yet.</p>}
        </div>
      </article>

      {(previousBlog || nextBlog) && (
        <div className="grid gap-4 md:grid-cols-2">
          {previousBlog ? (
            <Link to={`/blogs/${previousBlog._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-sky-500 hover:bg-slate-950">
              <div className="flex items-center gap-2 text-sky-300"><ChevronLeft className="h-4 w-4" /> Previous article</div>
              <p className="mt-3 font-semibold text-white">{previousBlog.title}</p>
            </Link>
          ) : null}

          {nextBlog ? (
            <Link to={`/blogs/${nextBlog._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-sky-500 hover:bg-slate-950">
              <div className="flex items-center gap-2 text-sky-300">Next article <ChevronRight className="h-4 w-4" /></div>
              <p className="mt-3 font-semibold text-white">{nextBlog.title}</p>
            </Link>
          ) : null}
        </div>
      )}

      {related.length ? (
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-white">You may also like</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item._id} to={`/blogs/${item._id}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-sky-500 hover:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Related</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
