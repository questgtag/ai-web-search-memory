import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import { getUserMemories, saveUserMemory } from '@/lib/store';
import { fetchWebSearchResults, generateAnswer } from '@/lib/ai';

export async function POST(request: Request) {
  const token = cookies().get('ai_session')?.value;
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

    const memoryPattern = /(?:remember|save(?:\s+to)?(?:\s+my)?\s+memory|note\s+that|store\s+this)(?:\s+(?:that|this))?[:\-]?\s*(.+)/i;
    const match = question.match(memoryPattern);
    if (match) {
      const fact = match[1]?.trim();
      if (fact) {
        await saveUserMemory(session.userId, 'Saved fact', fact);
      }
    }

    const memories = await getUserMemories(session.userId);
    const memorySummary = memories.map((memory) => `${memory.topic}: ${memory.content}`);
    const searchResults = await fetchWebSearchResults(question);
    const answer = await generateAnswer(question, memorySummary, searchResults);

    return NextResponse.json({ answer, citations: searchResults.slice(0, 5) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
