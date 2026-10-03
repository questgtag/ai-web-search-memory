import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from '@/lib/auth';
import { getUserMemories, getUserProfile } from '@/lib/store';

export default async function DashboardPage() {
  const token = cookies().get('ai_session')?.value;
  const session = token ? verifySessionToken(token) : null;

  if (!session) {
    redirect('/login');
  }

  const user = await getUserProfile(session.userId);
  const memories = await getUserMemories(session.userId);

  return (
    <main className="page-shell">
      <div className="dashboard-header card">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome, {user?.name ?? 'friend'}</h1>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="secondary-button" type="submit">Log out</button>
        </form>
      </div>

      <div className="dashboard-grid">
        <section className="card chat-panel">
          <ChatForm />
        </section>

        <aside className="card memory-panel">
          <h2>Saved memory</h2>
          {memories.length === 0 ? (
            <p className="empty-state">No saved memories yet.</p>
          ) : (
            <ul className="memory-list">
              {memories.map((memory) => (
                <li key={memory.id}>
                  <strong>{memory.topic}</strong>
                  <span>{memory.content}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  );
}

function ChatForm() {
  return (
    <div className="chat-form-wrapper">
      <h2>Ask the AI</h2>
      <form className="chat-form" action="/api/chat" method="POST">
        <textarea name="question" rows={6} placeholder="Ask anything..." required />
        <div className="button-row">
          <button className="primary-button" type="submit">Ask AI</button>
        </div>
      </form>
    </div>
  );
}
