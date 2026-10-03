import { NextResponse } from 'next/server';
import { getUserProfile, getUserMemories, saveUserMemory } from '@/lib/store';
import { createSessionToken, SESSION_COOKIE_NAME, type SessionUser } from '@/lib/auth';
import { getUserByEmail } from '@/lib/store';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST() {
  return NextResponse.json({ message: 'Use the auth routes instead.' }, { status: 405 });
}

export async function registerUser(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('An account already exists with that email');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await createUser(newUser);
  return newUser;
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const user = await getUserByEmail(email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password');

  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });
  return { token, user };
}

export async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET || 'dev-secret-change-me');
    if (typeof payload === 'string') {
      return null;
    }
    const profile = await getUserProfile(String(payload.userId));
    return profile ? { ...profile, token } : null;
  } catch {
    return null;
  }
}

export async function ensureMemoryFromQuestion(userId: string, question: string) {
  const memoryPattern = /(?:remember|save(?: to)?(?: my)? memory|note that|store this)(?:\s+(?:that|this))?[:\-]?\s*(.+)/i;
  const match = question.match(memoryPattern);

  if (!match) {
    return null;
  }

  const fact = match[1]?.trim();
  if (!fact) {
    return null;
  }

  const memory = await saveUserMemory(userId, 'Saved fact', fact);
  return memory;
}

export async function getMemorySummary(userId: string) {
  const memory = await getUserMemories(userId);
  return memory.map((item) => `${item.topic}: ${item.content}`);
}
