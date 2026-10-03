'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/auth/login', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Unable to sign in');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="page-shell centered">
      <div className="card auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input type="email" name="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" required placeholder="••••••••" />
          </label>
          {error ? <p className="error-message">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="subtle-link">
          Need an account? <a href="/register">Create one</a>
        </p>
      </div>
    </main>
  );
}
