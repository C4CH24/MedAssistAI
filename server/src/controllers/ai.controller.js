const aiService = require('../services/ai.service');

exports.processQuery = async (req, res, next) => {
    try {
        const { query, type, context } = req.body;
        const userId = req.userId;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query is required'
            });
        }
        
        const result = await aiService.processQuery(userId, query, {
            type: type || 'general',
            language: context?.language || 'en',
            ...context
        });
        
        // Return clean flat response
        res.json({
            success: true,
            source: result.source,
            data: {
                text: result.text
            }
        });
    } catch (error) {
        console.error('AI Controller Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.health = async (req, res) => {
    try {
        let fadhiliAvailable = false;
        try {
            const axios = require('axios');
            const healthCheck = await axios.get('http://localhost:5002/health', { timeout: 2000 });
            fadhiliAvailable = true;
        } catch (e) {
            fadhiliAvailable = false;
        }
        
        res.json({
            status: 'ok',
            fadhili: { available: fadhiliAvailable },
            gemini: { available: true }
        });
    } catch (error) {
        res.json({ status: 'degraded', error: error.message });
    }
};
