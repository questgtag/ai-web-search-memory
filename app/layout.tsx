'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type MemoryItem = {
  id: string;
  topic: string;
  content: string;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMemories() {
      const res = await fetch('/api/memory');
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      } else {
        router.push('/login');
      }
    }

    loadMemories();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('question', question);

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    setAnswer(data.answer || 'No answer generated.');

    const memoryRes = await fetch('/api/memory');
    if (memoryRes.ok) {
      const memoryData = await memoryRes.json();
      setMemories(memoryData.memories || []);
    }

    setQuestion('');
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="page-shell">
      <div className="dashboard-header card">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Ask the AI</h1>
        </div>
        <button className="secondary-button" onClick={handleLogout} type="button">Log out</button>
      </div>

      <div className="dashboard-grid">
        <section className="card chat-panel">
          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea
              name="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask anything... Type 'remember ...' to save a fact to your memory"
              required
            />
            <div className="button-row">
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>
            {error ? <p className="error-message">{error}</p> : null}
          </form>

          {answer ? (
            <div className="answer-box">
              <h3>Answer</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
            </div>
          ) : null}
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
