import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import api from '../../services/api';

export default function CertificatesSection() {
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
    <section id="certificates" className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-8 sm:p-10">
      <div className="pointer-events-none absolute -left-12 top-14 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Certificates</p>
          <h2 className="text-4xl font-semibold text-white sm:text-5xl">Proof of practice and ongoing learning.</h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-400">
            {loading
              ? 'Loading certificates…'
              : error
              ? error
              : 'Verified credentials that back the craft of building well-architected and reliable software experiences.'}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Recent learning</p>
              <p className="mt-4 text-slate-300 leading-7">Keeping current on modern tooling, architecture, and product delivery practices.</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Verification</p>
              <p className="mt-4 text-slate-300 leading-7">Every credential here represents a practical milestone in engineering or product systems.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-5"
        >
          {loading ? (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">Loading certificates…</div>
          ) : error ? (
            <div className="rounded-[1.75rem] border border-rose-500/30 bg-rose-500/5 p-12 text-rose-200">{error}</div>
          ) : !items.length ? (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-12 text-slate-500">No certificates are available yet.</div>
          ) : (
            items.slice(0, 4).map((item, index) => (
              <article key={item._id} className="grid gap-4 rounded-[1.75rem] border border-slate-800 bg-slate-900 p-6 shadow-sm shadow-slate-950/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-800 text-sky-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-500">{item.issuer}</p>
                    </div>
                  </div>
                  {item.credentialUrl && (
                    <a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {item.issueDate && <p className="text-sm text-slate-400">Issued {new Date(item.issueDate).toLocaleDateString()}</p>}
              </article>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
