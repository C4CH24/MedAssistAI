const axios = require('axios');
const AILog = require('../models/AILog');
const { v4: uuidv4 } = require('uuid');

class AIService {
    constructor() {
        this.fadhiliEndpoint = process.env.FADHILI_API_URL || 'http://localhost:5002';
        this.timeout = 8000;
    }

    async processQuery(userId, query, context = {}) {
        const startTime = Date.now();
        const requestId = uuidv4();

        // Try Fadhili AI first
        try {
            console.log(`[AI Router] Trying Fadhili AI for: ${query.substring(0, 50)}`);
            
            const fadhiliResponse = await this.callFadhili(query, context);
            
            // Extract text from Fadhili response
            let responseText = '';
            if (fadhiliResponse.data?.text) {
                responseText = fadhiliResponse.data.text;
            } else if (fadhiliResponse.text) {
                responseText = fadhiliResponse.text;
            } else {
                responseText = 'Unable to generate response';
            }
            
            // Log success
            await this.logAIUsage({
                userId,
                requestId,
                engine: 'fadhili',
                status: 'success',
                queryType: context.type || 'general',
                success: true,
                responseTime: Date.now() - startTime,
                query,
                context
            });

            // Return FLAT response structure
            return {
                success: true,
                source: 'fadhili',
                text: responseText,
                confidence: 0.95
            };
        } catch (fadhiliError) {
            console.log(`[AI Router] Fadhili failed: ${fadhiliError.message}`);
            
            // Return rule-based response
            const ruleResponse = this.getRuleBasedResponse(query, context);
            return {
                success: true,
                source: ruleResponse.source,
                text: ruleResponse.data.text,
                confidence: 0.8
            };
        }
    }

    async callFadhili(query, context) {
        const response = await axios.post(`${this.fadhiliEndpoint}/process`, {
            query,
            type: context.type || 'general',
            context: {
                language: context.language || 'en',
                medication: context.medication,
                condition: context.condition
            }
        }, {
            timeout: this.timeout,
            headers: { 'Content-Type': 'application/json' }
        });
        
        return response.data;
    }

    getRuleBasedResponse(query, context) {
        const language = context.language || 'en';
        const type = context.type || 'general';
        
        const responses = {
            en: {
                reminder: "Please take your medication as prescribed.",
                interaction: "Please consult your healthcare provider about drug interactions.",
                tip: "Remember to stay hydrated and take medications on time.",
                general: "For health advice, please consult your doctor."
            },
            sw: {
                reminder: "Tafadhali chukua dawa yako kama ilivyoagizwa.",
                interaction: "Tafadhali wasiliana na daktari wako kuhusu mwingiliano wa dawa.",
                tip: "Kumbuka kunywa maji mengi na kuchukua dawa kwa wakati.",
                general: "Kwa ushauri wa afya, tafadhali wasiliana na daktari wako."
            }
        };
        
        return {
            source: 'rule-based',
            data: { text: responses[language][type] || responses[language].general }
        };
    }

    async logAIUsage(logData) {
        try {
            const aiLog = new AILog(logData);
            await aiLog.save();
        } catch (error) {
            console.error('Failed to log AI usage:', error.message);
        }
    }
}

module.exports = new AIService();
