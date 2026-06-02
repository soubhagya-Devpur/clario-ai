const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  slides: {
    type: Array,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('History', HistorySchema);
