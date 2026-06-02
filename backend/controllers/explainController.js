const { getExplanationSlides } = require('../services/aiService');
const { addHistoryItem } = require('./historyController');

/**
 * POST /api/explain
 * Body: { question: string }
 * Response: { slides: Array<{title, content}> }
 */
async function generateExplanation(req, res) {
  const { question, userId, mode } = req.body;
  const normalizedMode = mode === 'code' ? 'code' : 'explain';

  // Validate input
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a valid question.' });
  }

  if (question.trim().length < 3) {
    return res.status(400).json({ error: 'Question is too short. Please be more specific.' });
  }

  try {
    const slides = await getExplanationSlides(question.trim(), normalizedMode);
    
    // Save to history if userId is provided
    if (userId) {
      await addHistoryItem(userId, question.trim(), slides);
    }
    
    return res.status(200).json({ slides });
  } catch (err) {
    // Log the FULL error so we can diagnose the real problem
    console.error('=== Groq API Error ===');
    console.error('Message:', err.message);
    console.error('Status:', err.status);
    console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    console.error('=======================');

    const msg = (err.message || '').toLowerCase();

    // Invalid / missing API key
    if (
      err.status === 400 ||
      err.status === 401 ||
      err.status === 403 ||
      msg.includes('api key') ||
      msg.includes('api_key') ||
      msg.includes('invalid') ||
      msg.includes('not valid') ||
      msg.includes('permission')
    ) {
      return res.status(500).json({ error: 'Invalid Groq API key. Please check your .env file.' });
    }
    if (err.status === 429 || msg.includes('quota') || msg.includes('rate')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
    }
    if (err instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse AI response. Please try again.' });
    }

    return res.status(500).json({ error: 'Failed to generate explanation. Please try again.' });
  }
}

module.exports = { generateExplanation };
