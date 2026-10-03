@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #0b1020;
  --panel: #121c31;
  --border: rgba(148, 163, 184, 0.24);
  --text: #e5eefb;
  --muted: #9fb1d1;
  --primary: #7c9cff;
  --primary-strong: #5d7cee;
  --secondary: #1c2d4d;
  --danger: #ff6b6b;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  min-height: 100%;
  background: radial-gradient(circle at top, #17223e 0%, var(--bg) 42%);
  color: var(--text);
  font-family: 'Inter', sans-serif;
}

body {
  min-height: 100vh;
}

a { color: inherit; text-decoration: none; }

button, input, textarea {
  font: inherit;
}

.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 20px 72px;
}

.centered {
  min-height: 100vh;
  display: grid;
  place-items: center;
}

.card {
  background: rgba(18, 30, 52, 0.9);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.22);
  backdrop-filter: blur(10px);
}

.hero-card, .auth-card {
  width: min(100%, 520px);
  padding: 30px;
}

h1, h2, h3, p { margin-top: 0; }

h1 {
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.1;
  margin-bottom: 16px;
}

h2 { font-size: 1.4rem; margin-bottom: 14px; }

.eyebrow {
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.lead, .empty-state, .subtle-link, .error-message {
  color: var(--muted);
}

.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.primary-button, .secondary-button {
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.primary-button {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: white;
}

.secondary-button {
  background: var(--secondary);
  color: var(--text);
  border: 1px solid var(--border);
}

.primary-button:hover, .secondary-button:hover {
  transform: translateY(-1px);
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
}

input, textarea {
  background: rgba(148, 163, 184, 0.07);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text);
  min-height: 48px;
  padding: 12px 14px;
}

textarea {
  min-height: 180px;
  resize: vertical;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 24px;
  margin-bottom: 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 24px;
}

.chat-panel, .memory-panel {
  padding: 22px;
}

.chat-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.answer-box {
  margin-top: 18px;
  padding: 18px;
  background: rgba(124, 156, 255, 0.08);
  border: 1px solid rgba(124, 156, 255, 0.2);
  border-radius: 14px;
}

.memory-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.memory-list li {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 12px;
  background: rgba(148, 163, 184, 0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.memory-list strong {
  color: var(--primary);
  font-size: 0.9rem;
}

.memory-list span {
  line-height: 1.5;
}

.error-message {
  color: #ffd1d1;
  margin: 0;
}

@media (max-width: 800px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
