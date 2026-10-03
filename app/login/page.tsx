import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';

export default function LoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('ai_session')?.value;

  if (token) {
    const session = verifySessionToken(token);
    if (session) {
      redirect('/dashboard');
    }
  }

  return (
    <main className="page-shell centered">
      <div className="card auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <form action="/api/auth/login" method="POST" className="form-stack">
          <label>
            Email
            <input type="email" name="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" name="password" required placeholder="••••••••" />
          </label>
          <button className="primary-button" type="submit">Sign in</button>
        </form>
        <p className="subtle-link">
          Need an account? <a href="/register">Create one</a>
        </p>
      </div>
    </main>
  );
}
