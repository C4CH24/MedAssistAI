const mongoose = require('mongoose');

const medicationKnowledgeBaseSchema = new mongoose.Schema({
  drugName: {
    type: String,
    required: true,
    index: true
  },
  genericName: {
    type: String,
    index: true
  },
  category: {
    type: String,
    enum: ['antibiotic', 'pain_reliever', 'antihypertensive', 'antidiabetic', 'antidepressant', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    required: true
  },
  indications: [String],
  contraindications: [String],
  sideEffects: [String],
  dosage: {
    adult: String,
    pediatric: String
  },
  interactions: [String],
  storage: String,
  kenyanAvailability: {
    type: Boolean,
    default: true
  },
  localAlternatives: [String],
  culturalNotes: String, // For Kenyan cultural context
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'manual'
  },
  verified: {
    type: Boolean,
    default: false
  }
});

// Add text index for search
medicationKnowledgeBaseSchema.index({
  drugName: 'text',
  genericName: 'text',
  description: 'text',
  indications: 'text'
});

module.exports = mongoose.model('MedicationKnowledgeBase', medicationKnowledgeBaseSchema);