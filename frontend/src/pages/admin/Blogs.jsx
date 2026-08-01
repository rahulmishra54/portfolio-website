import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminBlogsPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const thumbnail = watch('thumbnail') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/blogs');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load blog posts.');
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
      if (editingId) {
        await api.put(`/blogs/${editingId}`, values);
      } else {
        await api.post('/blogs', values);
      }
      reset();
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save blog post.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setValue('title', item.title || '');
    setValue('slug', item.slug || '');
    setValue('content', item.content || '');
    setValue('category', item.category || '');
    setValue('thumbnail', item.thumbnail || '');
    setValue('tags', (item.tags || []).join(', '));
    setValue('readingTime', item.readingTime || 0);
    setValue('published', Boolean(item.published));
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete blog post.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Blogs</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            <Plus className="h-4 w-4" />
            New blog
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Title</span>
            <input {...register('title', { required: 'Title is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.title && <p className="mt-2 text-sm text-rose-400">{errors.title.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Slug</span>
            <input {...register('slug', { required: 'Slug is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.slug && <p className="mt-2 text-sm text-rose-400">{errors.slug.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Category</span>
            <input {...register('category')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full">
            <ImageUploader
              label="Upload cover image"
              description="Upload a cover image for the blog post."
              value={thumbnail}
              onChange={(url) => setValue('thumbnail', url)}
              multiple={false}
            />
            <input type="hidden" {...register('thumbnail')} />
          </div>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Tags (comma separated)</span>
            <input {...register('tags')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Reading time (minutes)</span>
            <input type="number" {...register('readingTime')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Published</span>
            <input type="checkbox" {...register('published')} className="mt-3 h-4 w-4 rounded border-slate-700 bg-slate-900" />
          </label>

          <label className="col-span-full text-sm text-slate-300">
            <span className="mb-2 block">Content</span>
            <textarea rows="6" {...register('content')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update post' : 'Create post'}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); reset(); }} className="text-sm text-slate-400">Cancel</button> : null}
          </div>
        </form>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading blog posts…</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No blog posts yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.category || 'Writing'}</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{item.content?.slice(0, 180) || 'No preview yet.'}</p>
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
      )}
    </div>
  );
}
