import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { setToken, getToken, isTokenExpired } from '../../services/auth';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  React.useEffect(() => {
    const t = getToken();
    if (t && !isTokenExpired(t)) {
      navigate(from, { replace: true });
    }
  }, []);

  async function onSubmit(data) {
    setErrorMessage('');
    setSubmitting(true);

    try {
      const response = await api.post('/auth/login', data);
      const token = response.data?.token;

      if (token) {
        setToken(token);
        navigate(from, { replace: true });
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-xl shadow-slate-950/40">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin login</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Access dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to manage portfolio content and messages.</p>
        </div>

        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-3 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-3 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400"
              {...register('password', {
                required: 'Password is required',
              })}
            />
            {errors.password && <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p>}
          </div>

          {errorMessage && <p className="text-sm text-rose-400">{errorMessage}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
