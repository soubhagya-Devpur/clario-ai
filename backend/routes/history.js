const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');

// GET /api/history/:userId
router.get('/:userId', getHistory);

module.exports = router;
