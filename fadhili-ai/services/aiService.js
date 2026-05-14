const OpenAI = require('openai');
const AiTrainingData = require('../models/AiTrainingData');
const MedicationKnowledgeBase = require('../models/MedicationKnowledgeBase');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'ai-service.log' })
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class AIService {
  async processQuery(query, context = {}) {
    try {
      // Log the query for training
      await this.logQueryForTraining(query, context);

      // Get relevant knowledge from database
      const knowledge = await this.getRelevantKnowledge(query);

      // Build prompt with Kenyan healthcare context
      const prompt = this.buildHealthcarePrompt(query, context, knowledge);

      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Fadhili AI, a wise healthcare assistant specializing in medication adherence and Kenyan healthcare practices. Provide accurate, culturally appropriate advice in English or Swahili based on user preference. Always prioritize patient safety and data minimization per Kenyan law.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const response = completion.choices[0].message.content;

      // Store response for learning
      await this.storeResponse(query, response, context);

      return {
        text: response,
        source: 'fadhili-ai',
        confidence: 0.85,
        language: context.language || 'en'
      };

    } catch (error) {
      logger.error('AI processing error:', error);
      return this.getFallbackResponse(query, context);
    }
  }

  buildHealthcarePrompt(query, context, knowledge) {
    const language = context.language || 'en';
    const userProfile = context.userProfile || {};

    let prompt = `Query: ${query}\n`;
    prompt += `Language: ${language}\n`;
    prompt += `Context: ${JSON.stringify(context)}\n`;

    if (knowledge.length > 0) {
      prompt += `Relevant Knowledge:\n${knowledge.map(k => k.content).join('\n')}\n`;
    }

    prompt += `\nProvide a helpful, accurate response focusing on medication adherence and Kenyan healthcare context. Ensure data minimization and patient privacy.`;

    return prompt;
  }

  async getRelevantKnowledge(query) {
    try {
      // Search medication knowledge base
      const medKnowledge = await MedicationKnowledgeBase.find({
        $text: { $search: query }
      }).limit(3);

      // Search training data
      const trainingData = await AiTrainingData.find({
        query: { $regex: query, $options: 'i' }
      }).limit(2);

      return [...medKnowledge, ...trainingData];
    } catch (error) {
      logger.error('Knowledge retrieval error:', error);
      return [];
    }
  }

  async logQueryForTraining(query, context) {
    try {
      const trainingData = new AiTrainingData({
        query,
        context,
        timestamp: new Date(),
        source: 'user_query'
      });
      await trainingData.save();
    } catch (error) {
      logger.error('Training data logging error:', error);
    }
  }

  async storeResponse(query, response, context) {
    try {
      const trainingData = new AiTrainingData({
        query,
        response,
        context,
        timestamp: new Date(),
        source: 'ai_response'
      });
      await trainingData.save();
    } catch (error) {
      logger.error('Response storage error:', error);
    }
  }

  getFallbackResponse(query, context) {
    const language = context.language || 'en';

    const fallbacks = {
      en: {
        medication: "I recommend consulting your healthcare provider for specific medication advice. Remember to take medications as prescribed and set reminders in your MedAssist app.",
        reminder: "Use the reminder feature in MedAssist to stay on track with your medications. If you need help setting up reminders, check the app's medication section.",
        general: "I'm here to help with medication adherence and health questions. Please provide more details about your concern."
      },
      sw: {
        medication: "Ninashauri kushauriana na mhudumu wako wa afya kwa ushauri maalum wa dawa. Kumbuka kuchukua dawa kama ilivyoelekezwa na weka ukumbusho katika programu yako ya MedAssist.",
        reminder: "Tumia kipengele cha ukumbusho katika MedAssist ili ufuate dawa zako. Ikiwa unahitaji msaada wa kuweka ukumbusho, angalia sehemu ya dawa katika programu.",
        general: "Niko hapa kukusaidia na kufuata dawa na maswali ya afya. Tafadhali toa maelezo zaidi kuhusu wasiwasi wako."
      }
    };

    const langFallbacks = fallbacks[language] || fallbacks.en;

    if (query.toLowerCase().includes('medication') || query.toLowerCase().includes('dawa')) {
      return { text: langFallbacks.medication, source: 'fallback', confidence: 0.5 };
    } else if (query.toLowerCase().includes('reminder') || query.toLowerCase().includes('ukumbusho')) {
      return { text: langFallbacks.reminder, source: 'fallback', confidence: 0.5 };
    } else {
      return { text: langFallbacks.general, source: 'fallback', confidence: 0.5 };
    }
  }
}

module.exports = { processQuery: new AIService().processQuery };