import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminSkillsPage() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/skills');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load skills.');
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
        await api.put(`/skills/${editingId}`, values);
      } else {
        await api.post('/skills', values);
      }
      reset();
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save skill.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setValue('category', item.category || '');
    setValue('name', item.name || '');
    setValue('icon', item.icon || '');
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete skill.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Skills</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            <Plus className="h-4 w-4" />
            New skill
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Category</span>
            <input {...register('category', { required: 'Category is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.category && <p className="mt-2 text-sm text-rose-400">{errors.category.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Name</span>
            <input {...register('name', { required: 'Name is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Icon label</span>
            <input {...register('icon')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update skill' : 'Create skill'}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); reset(); }} className="text-sm text-slate-400">Cancel</button> : null}
          </div>
        </form>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading skills…</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No skills yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-400">{item.category}</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.name}</h2>
                  {item.icon ? <p className="mt-3 text-sm text-slate-500">{item.icon}</p> : null}
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
