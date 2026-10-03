import { NextResponse } from 'next/server';
import { createSessionToken, verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getUserByEmail, createUser } from '@/lib/store';
import bcrypt from 'bcryptjs';

export async function POST() {
  return NextResponse.json({ message: 'This route is not used.' }, { status: 405 });
}

export async function createAccount(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('An account already exists for that email');
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  };

  await createUser(user);
  const token = createSessionToken({ userId: user.id, email: user.email, name: user.name });
  return { token, user };
}

export async function loginAccount(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password');
  }

  const token = createSessionToken({ userId: user.id, email: user.email, name: user.name });
  return { token, user };
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  };
}
