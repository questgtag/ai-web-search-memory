import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getUserMemories, saveUserMemory } from '@/lib/store';
import { fetchWebSearchResults, generateAnswer } from '@/lib/ai';

export async function POST(request: Request) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const question = String(formData.get('question') || '').trim();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const memoryMatch = question.match(/(?:remember|save(?:\s+to)?(?:\s+my)?\s+memory|note\s+that|store\s+this)(?:\s+(?:that|this))?[:\-]?\s*(.+)/i);
    if (memoryMatch && memoryMatch[1]) {
      await saveUserMemory(session.userId, 'Saved fact', memoryMatch[1].trim());
    }

    const memorySummary = (await getUserMemories(session.userId)).map((m) => `${m.topic}: ${m.content}`);
    const searchResults = await fetchWebSearchResults(question);
    const answer = await generateAnswer(question, memorySummary, searchResults);

    return NextResponse.json({ answer, citations: searchResults.slice(0, 5) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
