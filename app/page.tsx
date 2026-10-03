import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="page-shell centered">
      <div className="card hero-card">
        <p className="eyebrow">AI research assistant</p>
        <h1>Search the web and remember what matters</h1>
        <p className="lead">
          Log in, ask anything, get live answers with web search, and save personal facts to memory.
        </p>
        <div className="button-row">
          <Link href="/login" className="primary-button">
            Sign in
          </Link>
          <Link href="/register" className="secondary-button">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
