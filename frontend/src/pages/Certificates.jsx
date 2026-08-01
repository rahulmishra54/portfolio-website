import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import api from '../services/api';

export default function CertificatesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCertificates() {
      setLoading(true);
      setError('');

      try {
        const response = await api.get('/certificates');
        if (active) {
          setItems(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load certificates.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCertificates();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Certificates</p>
        <h1 className="text-4xl font-semibold text-white">Professional credentials and learning milestones.</h1>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">Loading certificates…</div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 px-8 py-12 text-rose-200">{error}</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 px-8 py-12 text-slate-500">No certificates are available yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sky-400">
                  <Award className="h-5 w-5" />
                </div>
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-400">{item.issuer}</p>
              {item.issueDate && <p className="mt-4 text-sm text-slate-500">Issued {new Date(item.issueDate).toLocaleDateString()}</p>}
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
