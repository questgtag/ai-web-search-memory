import OpenAI from 'openai';

export type SearchResult = {
  title: string;
  url: string;
  content: string;
};

export async function fetchWebSearchResults(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return [
      {
        title: 'Search not configured',
        url: 'https://example.com',
        content: 'TAVILY_API_KEY is missing. Add your API key to enable live web search.',
      },
    ];
  }

  const response = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: 'advanced',
      max_results: 5,
      include_answer: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Web search failed: ${response.status}`);
  }

  const data = (await response.json()) as { results?: Array<{ title?: string; url?: string; content?: string; }> ; answer?: string };

  const results = (data.results ?? []).map((item) => ({
    title: item.title ?? 'Untitled result',
    url: item.url ?? 'https://example.com',
    content: item.content ?? item.title ?? 'No summary available.',
  }));

  if (results.length === 0 && typeof data.answer === 'string') {
    return [{ title: 'Search result', url: 'https://example.com', content: data.answer }];
  }

  return results;
}

export async function generateAnswer(question: string, memory: string[], searchResults: SearchResult[]) {
  const prompt = `
You are a helpful AI assistant. Answer the user's question using only the supplied evidence and personal memory when relevant.

User question:
${question}

User memory:
${memory.length ? memory.map((item) => `- ${item}`).join('\n') : 'No saved memory for this user.'}

Web search results:
${searchResults.map((result, index) => `\n[${index + 1}] ${result.title}\nURL: ${result.url}\nSummary: ${result.content}`).join('\n')}

Provide a direct answer, include the most relevant sources as markdown links, and mention if the answer is uncertain.
  `;

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return `I could not reach the model because OPENAI_API_KEY is not set. Based on the available web results and memory, the best answer is: ${searchResults[0]?.content ?? 'Please add your OpenAI key to enable full AI responses.'}`;
  }

  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a careful AI assistant that answers using live web search results and user memory. Cite sources clearly when available.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
  });

  return completion.choices[0]?.message?.content ?? 'I am unable to generate an answer right now.';
}
