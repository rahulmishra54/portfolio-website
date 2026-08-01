import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminCertificatesPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const imageUrl = watch('imageUrl') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/certificates');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load certificates.');
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
      const payload = { ...values, issueDate: values.issueDate || null };
      if (editingId) {
        await api.put(`/certificates/${editingId}`, payload);
      } else {
        await api.post('/certificates', payload);
      }
      reset();
      setEditingId(null);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to save certificate.');
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setValue('title', item.title || '');
    setValue('issuer', item.issuer || '');
    setValue('issueDate', item.issueDate ? item.issueDate.split('T')[0] : '');
    setValue('credentialUrl', item.credentialUrl || '');
    setValue('imageUrl', item.imageUrl || '');
  }

  async function removeItem(id) {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await api.delete(`/certificates/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete certificate.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Certificates</h1>
          </div>
          <button type="button" onClick={() => { setEditingId(null); reset(); }} className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
            <Plus className="h-4 w-4" />
            New certificate
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-4 lg:grid-cols-2">
          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Title</span>
            <input {...register('title', { required: 'Title is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.title && <p className="mt-2 text-sm text-rose-400">{errors.title.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Issuer</span>
            <input {...register('issuer', { required: 'Issuer is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.issuer && <p className="mt-2 text-sm text-rose-400">{errors.issuer.message}</p>}
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Issue date</span>
            <input type="date" {...register('issueDate')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <label className="text-sm text-slate-300">
            <span className="mb-2 block">Credential URL</span>
            <input {...register('credentialUrl')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
          </label>

          <div className="col-span-full">
            <ImageUploader
              label="Upload certificate image"
              description="Upload the certificate image shown in the public portfolio."
              value={imageUrl}
              onChange={(url) => setValue('imageUrl', url)}
              multiple={false}
            />
            <input type="hidden" {...register('imageUrl')} />
          </div>

          <div className="col-span-full flex items-center gap-3">
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Saving…' : editingId ? 'Update certificate' : 'Create certificate'}
            </button>
            {editingId ? <button type="button" onClick={() => { setEditingId(null); reset(); }} className="text-sm text-slate-400">Cancel</button> : null}
          </div>
        </form>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading certificates…</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No certificates yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-slate-400">{item.issuer}</p>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.title}</h2>
                  {item.issueDate ? <p className="mt-3 text-sm text-slate-500">Issued {new Date(item.issueDate).toLocaleDateString()}</p> : null}
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
