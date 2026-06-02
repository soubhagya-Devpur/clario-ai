const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Calls Google Gemini REST API and returns structured slide data for the given topic.
 * @param {string} question - The user's question/doubt.
 * @returns {Promise<Array<{title: string, content: string}>>}
 */
async function getExplanationSlides(question, mode = 'explain') {
  const prompt = mode === 'code'
    ? `You are Clario, a friendly AI tutor and code-generation assistant. The user requested code or output. Answer directly with working code examples, clear explanations, and sample output for any code you generate.

User question: ${question}

Format your response as a JSON array with 1 to 3 items. Each item must include a title and markdown-friendly content:
[
  { "title": "...", "content": "..." }
]

When including code, add a clear 'Output:' section after the code block showing the expected program output or command result. The content may include markdown code fences for code blocks. Always produce a final answer, do not ask the user to ask again. Return ONLY the JSON array and nothing else.`
    : `You are Clario, a friendly AI tutor and code-generation assistant. The user requested theoretical information. Answer clearly and directly in slide form.

User question: ${question}

Format your response as a JSON array of 3 to 5 slides. Each slide object must include a title and content:
[
  { "title": "...", "content": "..." },
  { "title": "...", "content": "..." }
]

The content may include markdown code fences when returning examples. Always produce a final answer, do not ask the user to ask again. Return ONLY the JSON array and nothing else.`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    max_tokens: 1024,
  });

  const rawContent = completion.choices[0]?.message?.content?.trim();
  const jsonContent = extractJsonArray(rawContent) || rawContent;

  const slides = parseSlides(jsonContent, rawContent);
  return slides;
}

function extractJsonArray(rawContent) {
  const startIndex = rawContent.indexOf('[');
  if (startIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = startIndex; i < rawContent.length; i++) {
    const char = rawContent[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (char === '[') {
      depth += 1;
    }
    if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return rawContent.slice(startIndex, i + 1);
      }
    }
  }
  return null;
}

function isSlideArray(value) {
  return Array.isArray(value) && value.length > 0 && value.every(item => {
    return item && typeof item === 'object' && typeof item.title === 'string' && typeof item.content === 'string';
  });
}

function parseSlides(jsonString, rawContent) {
  try {
    const parsed = JSON.parse(jsonString);
    if (isSlideArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    // Fall through to fallback below
  }

  return [
    {
      title: 'Answer',
      content: rawContent,
    },
  ];
}

module.exports = { getExplanationSlides };
