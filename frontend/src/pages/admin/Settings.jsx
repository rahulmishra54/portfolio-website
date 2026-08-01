import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import api from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import FileUploader from '../../components/admin/FileUploader';

export default function AdminSettingsPage() {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const profileUrl = watch('profileUrl') || '';
  const photoUrl = watch('photoUrl') || '';
  const resumeUrl = watch('resumeUrl') || '';
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadSettings() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/settings');
      const settings = response.data || {};
      setValue('heroTitle', settings.heroTitle || '');
      setValue('heroDescription', settings.heroDescription || '');
      setValue('aboutMe', settings.aboutMe || '');
      setValue('github', settings.github || '');
      setValue('linkedin', settings.linkedin || '');
      setValue('email', settings.email || '');
      setValue('phone', settings.phone || '');
      setValue('profileUrl', settings.profileUrl || '');
      setValue('photoUrl', settings.photoUrl || '');
      setValue('resumeUrl', settings.resumeUrl || '');
    } catch (err) {
      if (!String(err.message).includes('404')) {
        setError(err.message || 'Unable to load settings.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, [setValue]);

  async function onSubmit(values) {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/settings', values);
      setSuccess('Portfolio settings updated.');
    } catch (err) {
      setError(err.message || 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Settings</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Control the public portfolio copy and profile links that power the homepage.</p>
        </div>

        {error ? <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}
        {success ? <div className="mt-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-emerald-200">{success}</div> : null}

        {loading ? (
          <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-400">Loading settings…</div>
        ) : (
          <motion.form onSubmit={handleSubmit(onSubmit)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-4 lg:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Hero title</span>
              <input {...register('heroTitle')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Hero description</span>
              <input {...register('heroDescription')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <label className="col-span-full text-sm text-slate-300">
              <span className="mb-2 block">About me</span>
              <textarea rows="5" {...register('aboutMe')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">GitHub</span>
              <input {...register('github')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">LinkedIn</span>
              <input {...register('linkedin')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Email</span>
              <input {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
              {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Phone</span>
              <input {...register('phone')} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            </label>

            <div className="col-span-full">
              <ImageUploader
                label="Upload profile image"
                description="This image appears in the hero section."
                value={profileUrl}
                onChange={(url) => setValue('profileUrl', url)}
                multiple={false}
              />
            </div>

            <div className="col-span-full">
              <ImageUploader
                label="Upload about photo"
                description="This image can be used to highlight the about section."
                value={photoUrl}
                onChange={(url) => setValue('photoUrl', url)}
                multiple={false}
              />
            </div>

            <div className="col-span-full">
              <FileUploader
                label="Upload resume"
                description="Upload a PDF for your public portfolio resume link."
                value={resumeUrl}
                onChange={(fileData) => setValue('resumeUrl', fileData?.url || fileData || '')}
                uploadPath="/upload/resume"
                accept=".pdf"
                allowedTypes={['application/pdf']}
                buttonLabel={resumeUrl ? 'Replace resume' : 'Upload resume'}
              />
            </div>

            <input type="hidden" {...register('profileUrl')} />
            <input type="hidden" {...register('photoUrl')} />
            <input type="hidden" {...register('resumeUrl')} />

            <div className="col-span-full">
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
}
