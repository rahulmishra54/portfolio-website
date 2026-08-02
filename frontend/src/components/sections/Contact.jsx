import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import api from '../../services/api';

export default function ContactSection() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(values) {
    setStatus('');
    setSubmitting(true);

    try {
      await api.post('/messages', values);
      setStatus('Thanks for reaching out. Your message is on its way.');
      reset();
    } catch (err) {
      setStatus(err.message || 'Unable to send your message right now.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden rounded-[2rem] border border-[#27354E] bg-[#0D1424]/80 p-8 sm:p-10">
      <div className="pointer-events-none absolute -right-12 top-12 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-[#27354E] bg-[#141C2E]/90 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#3B82F6]">
            Let’s start with your product question
          </div>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">A calm, direct way to begin collaboration.</h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            Share the scope of the challenge and I’ll reply with a concise plan for delivery, tradeoffs, and next steps.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">When to reach out</p>
              <p className="mt-4 text-[#B6C2D9] leading-7">If you need polished product experiences, better frontend delivery, or platform-level consistency.</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-[#7C879C]">Response</p>
              <p className="mt-4 text-[#B6C2D9] leading-7">Expect a thoughtful reply with practical next steps and a shared understanding of scope.</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 rounded-[1.75rem] border border-[#27354E] bg-[#141C2E] p-8 shadow-sm shadow-[#000000]/20"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Name</span>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full rounded-3xl border border-[#27354E] bg-[#0D1424] px-4 py-3 text-[#B6C2D9] outline-none transition focus:border-[#3B82F6]"
              />
              {errors.name && <p className="mt-2 text-sm text-rose-400">{errors.name.message}</p>}
            </label>

            <label className="text-sm text-slate-300">
              <span className="mb-2 block">Email</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                })}
                className="w-full rounded-3xl border border-[#27354E] bg-[#0D1424] px-4 py-3 text-[#B6C2D9] outline-none transition focus:border-[#3B82F6]"
              />
              {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
            </label>
          </div>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Subject</span>
            <input
              {...register('subject', { required: 'Subject is required' })}
              className="w-full rounded-3xl border border-[#27354E] bg-[#0D1424] px-4 py-3 text-[#B6C2D9] outline-none transition focus:border-[#3B82F6]"
            />
            {errors.subject && <p className="mt-2 text-sm text-rose-400">{errors.subject.message}</p>}
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Message</span>
            <textarea
              rows="5"
              {...register('message', { required: 'Message is required' })}
              className="w-full rounded-3xl border border-[#27354E] bg-[#0D1424] px-4 py-3 text-[#B6C2D9] outline-none transition focus:border-[#3B82F6]"
            />
            {errors.message && <p className="mt-2 text-sm text-rose-400">{errors.message.message}</p>}
          </label>

          {status && <p className="text-sm text-slate-400">{status}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

