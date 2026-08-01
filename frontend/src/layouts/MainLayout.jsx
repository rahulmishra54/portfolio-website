import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 w-full">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="mx-auto relative max-w-6xl px-4 py-10 md:py-12">
            <Outlet />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
