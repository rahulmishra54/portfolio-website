import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  if (!parts.length) return null;

  const items = parts.map((part, idx) => {
    const to = '/' + parts.slice(0, idx + 1).join('/');
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    return { to, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex text-sm text-slate-400">
      {items.map((it, i) => (
        <span key={it.to} className="flex items-center gap-2">
          <Link to={it.to} className="hover:text-white">{it.label}</Link>
          {i < items.length - 1 ? <span className="text-slate-600">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
