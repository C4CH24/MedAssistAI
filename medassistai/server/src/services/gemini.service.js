const axios = require('axios');

class GeminiService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        // Using gemini-2.0-flash (free tier, fast, and available)
        this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    }

    async processQuery(query, context = {}) {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
            console.log('?? Gemini API key not configured');
            return null;
        }

        try {
            const language = context.language || 'en';
            const type = context.type || 'general';
            
            let prompt = query;
            
            // Enhance prompt based on type
            if (type === 'interaction') {
                prompt = `Analyze drug interactions for: ${query}. Provide a brief response about potential interactions.`;
            } else if (type === 'reminder') {
                prompt = `Create a friendly medication reminder for: ${query}. Keep it under 100 characters.`;
            } else if (type === 'tip') {
                prompt = `Provide a brief health tip about: ${query}. Keep it practical and under 100 characters.`;
            } else if (type === 'suggestion') {
                prompt = `Provide optimal timing advice for: ${query}. Consider food and sleep schedule.`;
            }
            
            if (language === 'sw') {
                prompt = `Jibu kwa Kiswahili kwa ufupi: ${prompt}`;
            }

            const response = await axios.post(
                `${this.endpoint}?key=${this.apiKey}`,
                {
                    contents: [{ 
                        parts: [{ text: prompt }] 
                    }],
                    generationConfig: { 
                        temperature: 0.7, 
                        maxOutputTokens: 200,
                        topP: 0.8
                    }
                },
                { timeout: 8000 }
            );

            const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!text) {
                throw new Error('No response from Gemini');
            }
            
            return {
                success: true,
                text: text.trim(),
                source: 'gemini'
            };
        } catch (error) {
            console.error('Gemini error:', error.response?.data?.error?.message || error.message);
            return { success: false, error: error.message };
        }
    }

    async healthCheck() {
        if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
            return { available: false, reason: 'No API key configured' };
        }
        return { available: true };
    }
}

module.exports = new GeminiService();
