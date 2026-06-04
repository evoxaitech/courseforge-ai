const MODEL = 'claude-sonnet-4-20250514';

export async function callClaude(prompt, system = '') {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: system || 'You are an expert instructional designer.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Invalid API key on server.');
    if (res.status === 429) throw new Error('Rate limit hit. Wait a moment.');
    throw new Error(err?.error?.message || `Error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.find(b => b.type === 'text')?.text || '';
}

export function buildPrompt({ topic, audience, level, duration, includes, notes }) {
  return `Create a complete professional course curriculum.

TOPIC: ${topic}
AUDIENCE: ${audience || 'General learners'}
LEVEL: ${level}
DURATION: ${duration}
CONTENT TYPES: ${includes}
${notes ? `NOTES: ${notes}` : ''}

Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "Course Title",
  "tagline": "One compelling outcome sentence",
  "totalHours": 12,
  "totalLessons": 28,
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "objective": "By end of module, students will...",
      "duration": "2 hours",
      "lessons": [
        {
          "id": "1.1",
          "title": "Lesson Title",
          "type": "video",
          "duration": "15 min",
          "description": "What this lesson covers"
        }
      ]
    }
  ],
  "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
  "prerequisites": ["Prereq 1"],
  "targetAudience": "Who this is for"
}

Types: video, quiz, assignment, reading, project, live
Generate 5-7 modules with 3-6 lessons each. Be specific and practical.`;
}