import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '');

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
    }

    const user = await createUser({
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      createdAt: new Date().toISOString(),
    });

    const token = createSessionToken({ userId: user.id, name: user.name, email: user.email });
    const response = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}
