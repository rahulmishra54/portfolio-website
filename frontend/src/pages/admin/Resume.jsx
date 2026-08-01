import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import FileUploader from '../../components/admin/FileUploader';

export default function AdminResumePage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadResume() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/resume');
      setResume(response.data);
    } catch (err) {
      if (err.message && !err.message.includes('404')) {
        setError(err.message || 'Unable to load resume.');
      }
      setResume(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResume();
  }, []);

  async function handleDelete() {
    try {
    if (!window.confirm('Delete resume?')) return;
      await api.delete('/resume');
      await loadResume();
    } catch (err) {
      setError(err.message || 'Unable to delete resume.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Resume</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Upload or replace the resume associated with the portfolio’s hero section and public profile.</p>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div>
        ) : null}

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <FileUploader
            label="Upload resume"
            description="Upload a PDF resume for the public portfolio."
            value={resume}
            onChange={(fileData) => setResume(fileData)}
            uploadPath="/upload/resume"
            accept=".pdf"
            allowedTypes={['application/pdf']}
            buttonLabel={resume ? 'Replace resume' : 'Upload resume'}
            onDelete={handleDelete}
          />
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-500">Loading resume…</p>
        ) : resume?.url ? (
          <motion.a
            href={resume.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 inline-flex items-center gap-2 text-sm text-sky-400 transition hover:text-sky-300"
          >
            Open current resume
          </motion.a>
        ) : null}
      </div>
    </div>
  );
}
