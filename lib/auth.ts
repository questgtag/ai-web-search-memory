import jwt, { type JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const SESSION_COOKIE_NAME = 'ai_session';

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
};

export function createSessionToken(user: SessionUser) {
  return jwt.sign(user, process.env.AUTH_SECRET || 'dev-secret-change-me', { expiresIn: '7d' });
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET || 'dev-secret-change-me');
    if (typeof payload === 'string') {
      return null;
    }
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    redirect('/login');
  }

  const session = verifySessionToken(token);
  if (!session) {
    redirect('/login');
  }

  return session;
}
