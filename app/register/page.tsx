import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';

export default function RegisterPage() {
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
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <form action="/api/auth/register" method="POST" className="form-stack">
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
          <button className="primary-button" type="submit">Create account</button>
        </form>
        <p className="subtle-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </main>
  );
}
