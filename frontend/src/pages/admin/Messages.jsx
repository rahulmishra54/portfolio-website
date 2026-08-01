import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail } from 'lucide-react';
import api from '../../services/api';

export default function AdminMessagesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/messages');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Unable to load messages.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function removeItem(id) {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Unable to delete message.');
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Messages</h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">Review and remove inbound portfolio communications.</p>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-rose-500/30 bg-rose-500/5 p-4 text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">Loading messages…</div>
      ) : !items.length ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-8 text-slate-400">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.article key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4 text-sky-400" />
                    <span>{item.name}</span>
                    <span className="text-slate-600">•</span>
                    <span>{item.email}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.subject}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{item.message}</p>
                </div>
                <button type="button" onClick={() => removeItem(item._id)} className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
