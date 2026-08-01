import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Layers, MessageSquare, Sparkles, BookOpen, Award, Star } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const stats = [
  { key: 'projects', label: 'Projects', icon: Layers },
  { key: 'blogs', label: 'Blogs', icon: BookOpen },
  { key: 'skills', label: 'Skills', icon: Sparkles },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/dashboard');
        if (mounted) {
          setData(response.data);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Unable to load dashboard data.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-8 text-rose-200">
        <p className="text-sm font-semibold">Dashboard error</p>
        <p className="mt-2 text-sm text-rose-200">{error}</p>
      </div>
    );
  }

  const recentProjects = data?.latestProjects || [];
  const recentBlogs = data?.latestBlogs || [];
  const recentMessages = data?.latestMessages || [];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Portfolio overview</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Updated from the backend data source</div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/admin/projects')} className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-200">New Project</button>
              <button onClick={() => navigate('/admin/blogs')} className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-200">New Blog</button>
              <button onClick={() => navigate('/admin/skills')} className="rounded-full bg-slate-900 px-3 py-2 text-sm text-slate-200">New Skill</button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{data?.[item.key] ?? 0}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-sky-400">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent projects</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Latest work</h2>
            </div>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>

          {recentProjects.length ? (
            <ul className="space-y-4">
              {recentProjects.map((project) => (
                <li key={project._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">{project.title}</p>
                  <p className="mt-2 text-base font-medium text-white line-clamp-2">{project.summary || project.description || 'No description available.'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No recent projects available.</p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent blogs</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Latest posts</h2>
            </div>
            <BookOpen className="h-5 w-5 text-slate-400" />
          </div>

          {recentBlogs.length ? (
            <ul className="space-y-4">
              {recentBlogs.map((blog) => (
                <li key={blog._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">{blog.title}</p>
                  <p className="mt-2 text-base font-medium text-white line-clamp-2">{blog.summary || blog.excerpt || 'No summary available.'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No recent blogs available.</p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent messages</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Incoming contacts</h2>
            </div>
            <MessageSquare className="h-5 w-5 text-slate-400" />
          </div>

          {recentMessages.length ? (
            <ul className="space-y-4">
              {recentMessages.map((message) => (
                <li key={message._id} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">{message.name} · {new Date(message.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2 text-base font-medium text-white line-clamp-2">{message.subject || message.message || 'No message preview.'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No recent messages available.</p>
          )}
        </section>
      </div>
    </div>
  );
}
