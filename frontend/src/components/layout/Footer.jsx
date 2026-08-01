import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired } from '../../services/auth';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900/60 bg-slate-950 text-slate-400">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-white hover:text-sky-300">
            DevCraft
          </Link>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Product-quality developer experiences, built to help teams ship polished software with clarity, speed, and durability.
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-600">© {new Date().getFullYear()} DevCraft.</p>
        </div>

        <div className="grid gap-4 sm:justify-end">
          <div className="grid gap-2 text-sm">
            <Link to="/" className="text-slate-400 transition hover:text-white">Home</Link>
            <Link to="/projects" className="text-slate-400 transition hover:text-white">Projects</Link>
            <Link to="/contact" className="text-slate-400 transition hover:text-white">Contact</Link>
            <Link to="/blogs" className="text-slate-400 transition hover:text-white">Articles</Link>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <a href="https://github.com" className="transition hover:text-white">GitHub</a>
            <a href="https://linkedin.com" className="transition hover:text-white">LinkedIn</a>
            <a href="mailto:hello@example.com" className="transition hover:text-white">Email</a>
            <a href="#top" className="rounded-full border border-slate-800 px-3 py-2 text-slate-300 transition hover:border-slate-700 hover:text-white">Back to top</a>
            <AdminLink />
          </div>
        </div>
      </div>
    </footer>
  );
}

function AdminLink() {
  const navigate = useNavigate();

  function handleClick(e) {
    e.preventDefault();
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  }

  return (
    <button onClick={handleClick} className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:text-white" aria-label="Admin login">
      Admin
    </button>
  );
}
