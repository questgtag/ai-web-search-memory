'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const res = await fetch('/api/auth/register', { method: 'POST', body: formData });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Unable to create account');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="page-shell centered">
      <div className="card auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Full name
            <input type="text" name="name" required placeholder="Jane Doe" />
          </label>
          <label>
            Email
            <input type="email" name="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" required placeholder="Create a secure password" />
          </label>
          {error ? <p className="error-message">{error}</p> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="subtle-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}
