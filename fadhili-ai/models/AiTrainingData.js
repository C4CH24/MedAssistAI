const mongoose = require('mongoose');

const aiTrainingDataSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    index: true
  },
  response: {
    type: String
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  source: {
    type: String,
    enum: ['user_query', 'ai_response', 'manual_entry'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  tags: [String],
  language: {
    type: String,
    default: 'en'
  }
});

// Add text index for search
aiTrainingDataSchema.index({ query: 'text', response: 'text' });

module.exports = mongoose.model('AiTrainingData', aiTrainingDataSchema);