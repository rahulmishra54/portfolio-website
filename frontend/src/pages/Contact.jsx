import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import api from '../services/api';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values) {
    setStatus('');
    setSubmitting(true);

    try {
      await api.post('/messages', values);
      setStatus('Thanks for reaching out. Your message has been received.');
      reset();
    } catch (err) {
      setStatus(err.message || 'Unable to send your message right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Contact</p>
        <h1 className="text-4xl font-semibold text-white">Make the next step straightforward.</h1>
        <p className="max-w-2xl text-slate-400">Share the scope of your product or platform challenge and I’ll follow up with a thoughtful response.</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid gap-8 rounded-3xl border border-slate-800 bg-slate-950 p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-semibold text-white">Open to senior frontend and product delivery conversations.</h2>
          <p className="text-slate-400 leading-7">I work with teams that value clarity, speed, and durable implementation decisions from the first sprint onward.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Name</span>
              <input {...register('name', { required: 'Name is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
              {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Email</span>
              <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' } })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
              {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
            </label>
          </div>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Subject</span>
            <input {...register('subject', { required: 'Subject is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.subject && <p className="mt-2 text-sm text-rose-400">{errors.subject.message}</p>}
          </label>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Message</span>
            <textarea rows="5" {...register('message', { required: 'Message is required' })} className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400" />
            {errors.message && <p className="mt-2 text-sm text-rose-400">{errors.message.message}</p>}
          </label>
          {status && <p className="text-sm text-slate-400">{status}</p>}
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
            <Send className="h-4 w-4" />
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
