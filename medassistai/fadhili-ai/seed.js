const mongoose = require('mongoose');
const MedicationKnowledgeBase = require('./models/MedicationKnowledgeBase');
require('dotenv').config();

const seedMedications = [
  {
    drugName: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'pain_reliever',
    description: 'Common pain reliever and fever reducer',
    indications: ['Pain relief', 'Fever reduction'],
    contraindications: ['Liver disease', 'Alcohol abuse'],
    sideEffects: ['Nausea', 'Skin rash', 'Liver damage (overdose)'],
    dosage: {
      adult: '500mg every 4-6 hours as needed',
      pediatric: '10-15mg/kg every 4-6 hours'
    },
    interactions: ['Warfarin', 'Alcohol'],
    storage: 'Store at room temperature',
    kenyanAvailability: true,
    localAlternatives: ['Panadol', 'Calpol'],
    culturalNotes: 'Widely used in Kenya for malaria-related fever'
  },
  {
    drugName: 'Aspirin',
    genericName: 'Acetylsalicylic acid',
    category: 'pain_reliever',
    description: 'Anti-inflammatory and anti-platelet medication',
    indications: ['Pain', 'Fever', 'Heart attack prevention'],
    contraindications: ['Bleeding disorders', 'Peptic ulcer', 'Children under 12'],
    sideEffects: ['Stomach irritation', 'Bleeding', 'Allergic reactions'],
    dosage: {
      adult: '75-325mg daily for heart protection',
      pediatric: 'Not recommended for children'
    },
    interactions: ['Anticoagulants', 'NSAIDs'],
    storage: 'Cool, dry place',
    kenyanAvailability: true,
    localAlternatives: ['Disprin', 'Aspro'],
    culturalNotes: 'Used traditionally in Kenya for various ailments'
  },
  {
    drugName: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'antibiotic',
    description: 'Broad-spectrum antibiotic',
    indications: ['Bacterial infections', 'Ear infections', 'Urinary tract infections'],
    contraindications: ['Penicillin allergy'],
    sideEffects: ['Diarrhea', 'Nausea', 'Allergic reactions'],
    dosage: {
      adult: '500mg three times daily',
      pediatric: '20-40mg/kg/day divided into 3 doses'
    },
    interactions: ['Oral contraceptives'],
    storage: 'Refrigerate liquid form',
    kenyanAvailability: true,
    localAlternatives: ['Amoxil', 'Trimox'],
    culturalNotes: 'Commonly prescribed in Kenyan health facilities'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medassist');

    console.log('Connected to MongoDB');

    // Clear existing data
    await MedicationKnowledgeBase.deleteMany({});
    console.log('Cleared existing medication data');

    // Insert seed data
    await MedicationKnowledgeBase.insertMany(seedMedications);
    console.log('Seeded medication knowledge base');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();