import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminProjectsPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const images = watch('images') || [];
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/projects');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load projects.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function onSubmit(values) {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...values,
        techStack: values.techStack ? values.techStack.split(',').map((item) => item.trim()).filter(Boolean) : [],
        features: values.features ? values.features.split('\n').map((item) => item.trim()).filter(Boolean) : [],
        featured: Boolean(values.featured),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      reset();
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save project.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setValue('title', item.title || '');
    setValue('description', item.description || '');
    setValue('techStack', (item.techStack || []).join(', '));
    setValue('features', (item.features || []).join('\n'));
    setValue('githubUrl', item.githubUrl || '');
    setValue('liveUrl', item.liveUrl || '');
    setValue('images', item.images || []);
    setValue('featured', Boolean(item.featured));
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this project? This action cannot be undone.')) return;
    try {
      await api.delete(`/projects/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete project.');
    }
  }

  const renderContent = () => {
    if (loading) {
      return <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading projects…</div>;
    }

    if (!items.length) {
      return <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No projects yet.</div>;
    }

    const visible = items
      .filter((it) => !query || (it.title || '').toLowerCase().includes(query.toLowerCase()) || (it.description || '').toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * pageSize, page * pageSize);

    return (
      <div>
        <div className="space-y-4">
          {visible.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{item.featured ? 'Featured' : 'Project'}</span>
                    {item.githubUrl ? <ExternalLink className="h-4 w-4" /> : null}
                    {item.liveUrl ? <ExternalLink className="h-4 w-4" /> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{item.description || 'No description yet.'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => removeItem(item._id)} className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-slate-400">Page {page}</div>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-sm text-slate-200 disabled:opacity-50">Prev</button>
            <button disabled={page * pageSize >= items.filter((it) => !query || (it.title || '').toLowerCase().includes(query.toLowerCase()) || (it.description || '').toLowerCase().includes(query.toLowerCase())).length} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-sm text-slate-200 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Projects</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            <Plus className="h-4 w-4" />
            New project
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search projects" className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
          <div className="text-sm text-slate-400">{items.length} total</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Title</span>
            <input {...register('title', { required: 'Title is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.title && <p className="mt-2 text-sm text-rose-400">{errors.title.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Featured</span>
            <input type="checkbox" {...register('featured')} className="mt-3 h-4 w-4 rounded border-slate-700 bg-slate-900" />
          </label>

          <label className="col-span-full text-sm text-slate-300">
            <span className="mb-2 block">Description</span>
            <textarea rows="4" {...register('description')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Tech stack (comma separated)</span>
            <input {...register('techStack')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">GitHub URL</span>
            <input {...register('githubUrl')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Live URL</span>
            <input {...register('liveUrl')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full">
            <ImageUploader
              label="Project images"
              description="Upload project screenshots or presentation images and preview them here."
              value={images}
              onChange={(urls) => setValue('images', urls)}
              multiple={true}
              maxFiles={8}
            />
            <input type="hidden" {...register('images')} />
          </div>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Features (one per line)</span>
            <textarea rows="3" {...register('features')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update project' : 'Create project'}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); reset(); }} className="text-sm text-slate-400">Cancel</button> : null}
          </div>
        </form>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {renderContent()}
    </div>
  );
}
