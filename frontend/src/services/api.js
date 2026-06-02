import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for AI responses
});

/**
 * Send a question to the backend and receive slide data.
 * @param {string} question
 * @param {string} [userId] - Optional user ID for saving history
 * @returns {Promise<Array<{title: string, content: string}>>}
 */
export async function explainQuestion(question, userId, mode = 'explain') {
  const response = await api.post('/explain', { question, userId, mode });
  return response.data.slides;
}

/**
 * Fetch a user's explanation history
 * @param {string} userId
 * @returns {Promise<Array<any>>}
 */
export async function getUserHistory(userId) {
  const response = await api.get(`/history/${userId}`);
  return response.data;
}
