const History = require('../models/History');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

// Helper to initialize local DB
const initLocalDB = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
  }
};

const getLocalHistory = () => {
  initLocalDB();
  const data = fs.readFileSync(HISTORY_FILE, 'utf8');
  return data ? JSON.parse(data) : [];
};

const saveLocalHistory = (historyArr) => {
  initLocalDB();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyArr, null, 2));
};

const isMongooseConnected = () => mongoose.connection.readyState === 1;

// Exported helper for explainController to save new history item
const addHistoryItem = async (userId, question, slides) => {
  if (!userId) return null;
  
  try {
    if (isMongooseConnected()) {
      return await History.create({ userId, question, slides });
    } else {
      const historyArr = getLocalHistory();
      const newHistory = {
        _id: Date.now().toString(),
        userId,
        question,
        slides,
        createdAt: new Date().toISOString()
      };
      historyArr.push(newHistory);
      saveLocalHistory(historyArr);
      return newHistory;
    }
  } catch (err) {
    console.error('Error saving history:', err.message);
    return null;
  }
};

// @desc    Get user history
// @route   GET /api/history/:userId
// @access  Public
const getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (isMongooseConnected()) {
      const history = await History.find({ userId }).sort({ createdAt: -1 });
      return res.json(history);
    } else {
      const historyArr = getLocalHistory();
      const userHistory = historyArr
        .filter(h => h.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(userHistory);
    }
  } catch (err) {
    console.error('History Error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  addHistoryItem,
  getHistory
};
