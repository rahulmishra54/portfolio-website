import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUp, ExternalLink, GitBranch, Mail, Sparkles } from 'lucide-react';
import { getToken, isTokenExpired } from '../../services/auth';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#27354E] bg-[#0D1424] text-[#B6C2D9]">
      <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#3B82F6] opacity-40" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#27354E] bg-[#141C2E]/80 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-[#3B82F6]/10">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">&lt;/&gt;</span>
            Premium portfolio experience
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-white">Built for makers, founders, and product leaders.</h2>
            <p className="max-w-xl text-sm leading-7 text-[#B6C2D9]">
              A polished frontend and API experience with strong design, clean architecture, and a premium feel across every section.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-[#7C879C]">
            <span className="rounded-full border border-[#27354E] bg-[#141C2E]/80 px-4 py-2">React</span>
            <span className="rounded-full border border-[#27354E] bg-[#141C2E]/80 px-4 py-2">Tailwind</span>
            <span className="rounded-full border border-[#27354E] bg-[#141C2E]/80 px-4 py-2">Framer Motion</span>
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#7C879C]">© {new Date().getFullYear()} Portfolio</p>
        </div>

        <div className="grid gap-6 sm:justify-end">
          <div className="grid gap-3 text-sm text-[#B6C2D9]">
            <Link to="/" className="transition hover:text-white">Home</Link>
            <Link to="/projects" className="transition hover:text-white">Projects</Link>
            <Link to="/blogs" className="transition hover:text-white">Blog</Link>
            <Link to="/contact" className="transition hover:text-white">Contact</Link>
          </div>

          <div className="rounded-[1.75rem] border border-[#27354E] bg-[#141C2E]/80 p-5 shadow-[0_24px_50px_rgba(3,12,34,0.35)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#7C879C]">Connect</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <SocialLink href="https://github.com" label="GitHub">
                <GitBranch className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <ExternalLink className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="mailto:hello@example.com" label="Email">
                <Mail className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <Sparkles className="h-5 w-5" />
              </SocialLink>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center gap-2 rounded-full border border-[#27354E] bg-[#0D1424] px-4 py-2 text-sm text-[#B6C2D9] transition hover:border-[#3B82F6] hover:text-white">
                <ArrowUp className="h-4 w-4" /> Back to top
              </button>
              <AdminLink />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ children, href, label }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" title={label} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#27354E] bg-[#141C2E] text-[#B6C2D9] transition duration-200 hover:border-[#3B82F6] hover:bg-[#3B82F6]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]">
      {children}
    </a>
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
    <button onClick={handleClick} className="inline-flex items-center justify-center rounded-full border border-[#27354E] bg-[#141C2E] px-4 py-2 text-sm text-[#B6C2D9] transition hover:border-[#3B82F6] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]" aria-label="Admin login">
      Admin
    </button>
  );
}
