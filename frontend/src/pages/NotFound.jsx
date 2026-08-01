import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 px-6 py-16 text-center">
      <div className="max-w-xl space-y-5">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">404</p>
        <h1 className="text-4xl font-semibold text-white">The page you’re looking for is unavailable.</h1>
        <p className="text-slate-400 leading-7">The route may have moved, or the content has not been published yet. Return home to continue browsing the portfolio.</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Return home
        </Link>
      </div>
    </div>
  );
}
