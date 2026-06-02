require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const explainRoutes = require('./routes/explain');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware — allow any localhost origin (Vite may use 5173, 5174, etc.)
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api', explainRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Clario API is running 🚀' });
});

// Quick API key test — open http://localhost:5000/api/test-key in browser
app.get('/api/test-key', async (req, res) => {
  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say "API key works!" in 5 words max.' }],
      model: 'llama-3.1-8b-instant',
    });
    const text = completion.choices[0]?.message?.content;
    return res.json({ success: true, response: text });
  } catch (err) {
    console.error('Test key error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clario').then(() => {
  console.log('✅ MongoDB Connected');
}).catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`🔑 GROQ_API_KEY loaded: ${process.env.GROQ_API_KEY ? 'YES ✅' : 'NO ❌'}`);
});
