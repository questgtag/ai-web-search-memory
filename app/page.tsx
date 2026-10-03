import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getUserMemories, saveUserMemory } from '@/lib/store';

export async function GET() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const memories = await getUserMemories(session.userId);
  return NextResponse.json({ memories });
}

export async function POST(request: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const topic = String(body.topic || 'Saved fact').trim();
    const content = String(body.content || '').trim();

    if (!content) {
      return NextResponse.json({ error: 'Memory content is required' }, { status: 400 });
    }

    const memory = await saveUserMemory(session.userId, topic, content);
    return NextResponse.json({ memory });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Could not save memory' }, { status: 500 });
  }
}
