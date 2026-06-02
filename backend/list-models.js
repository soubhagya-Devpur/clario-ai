require('dotenv').config();
const axios = require('axios');

async function test() {
  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const models = response.data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
    console.log(models.map(m => m.name));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}

test();
