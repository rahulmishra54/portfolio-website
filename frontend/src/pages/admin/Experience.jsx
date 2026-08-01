import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminExperiencePage() {
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
      const response = await api.get('/experience');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load experience.');
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
        technologies: values.technologies ? values.technologies.split(',').map((item) => item.trim()).filter(Boolean) : [],
        startDate: values.startDate || null,
        endDate: values.endDate || null,
        currentlyWorking: Boolean(values.currentlyWorking),
      };

      if (editingId) {
        await api.put(`/experience/${editingId}`, payload);
      } else {
        await api.post('/experience', payload);
      }
      reset();
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save experience.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setValue('company', item.company || '');
    setValue('role', item.role || '');
    setValue('startDate', item.startDate ? item.startDate.split('T')[0] : '');
    setValue('endDate', item.endDate ? item.endDate.split('T')[0] : '');
    setValue('description', item.description || '');
    setValue('technologies', (item.technologies || []).join(', '));
    setValue('currentlyWorking', Boolean(item.currentlyWorking));
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this experience entry?')) return;
    try {
      await api.delete(`/experience/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete experience.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Experience</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            <Plus className="h-4 w-4" />
            New experience
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Company</span>
            <input {...register('company', { required: 'Company is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.company && <p className="mt-2 text-sm text-rose-400">{errors.company.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Role</span>
            <input {...register('role', { required: 'Role is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.role && <p className="mt-2 text-sm text-rose-400">{errors.role.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Start date</span>
            <input type="date" {...register('startDate', { required: 'Start date is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.startDate && <p className="mt-2 text-sm text-rose-400">{errors.startDate.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">End date</span>
            <input type="date" {...register('endDate')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Technologies (comma separated)</span>
            <input {...register('technologies')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Currently working</span>
            <input type="checkbox" {...register('currentlyWorking')} className="mt-3 h-4 w-4 rounded border-slate-700 bg-slate-900" />
          </label>

          <label className="col-span-full text-sm text-slate-300">
            <span className="mb-2 block">Description</span>
            <textarea rows="4" {...register('description')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update experience' : 'Create experience'}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); reset(); }} className="text-sm text-slate-400">Cancel</button> : null}
          </div>
        </form>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading experience…</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No experience entries yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.company}</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.role}</h2>
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
      )}
    </div>
  );
}
