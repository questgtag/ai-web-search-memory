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
        content: 'Add a TAVILY_API_KEY to enable real web search. This app is ready to use with a live search provider.',
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
    throw new Error(`Web search failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    results?: Array<{ title?: string; url?: string; content?: string }>;
    answer?: string;
  };

  const results = (data.results ?? []).map((item) => ({
    title: item.title ?? 'Untitled result',
    url: item.url ?? 'https://example.com',
    content: item.content ?? 'No description available.',
  }));

  if (results.length === 0 && data.answer) {
    return [{ title: 'Web answer', url: 'https://example.com', content: data.answer }];
  }

  return results;
}

export async function generateAnswer(question: string, memory: string[], searchResults: SearchResult[]) {
  const apiKey = process.env.OPENAI_API_KEY;

  const prompt = `
You are a helpful AI assistant.

User question:
${question}

User memory:
${memory.length ? memory.map((item) => `- ${item}`).join('\n') : 'No saved memory for this user.'}

Search results:
${searchResults.map((r, i) => `\n[${i + 1}] ${r.title}\nURL: ${r.url}\nSummary: ${r.content}`).join('\n')}

Answer the user's question clearly and accurately. If the answer is uncertain, say so. Include relevant source links in markdown format.
`;

  if (!apiKey) {
    const fallback = searchResults[0]?.content ?? 'No web answer available.';
    return `I couldn't reach the model because OPENAI_API_KEY is not configured. Based on the available information: ${fallback}`;
  }

  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: 'Answer using the user memory and live web search results. Cite sources clearly when available.',
      },
      { role: 'user', content: prompt },
    ],
  });

  return completion.choices[0]?.message?.content ?? 'I could not generate a response.';
}
