const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const MedicationKnowledgeBase = require('../models/MedicationKnowledgeBase');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'Fadhili AI is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// Process AI queries
router.post('/process', async (req, res) => {
    try {
        const { query, type, context } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Simple response for now
        let response = {
            text: `I understand you're asking about: "${query}". I'm your Fadhili AI assistant.`,
            confidence: 0.95,
            source: 'fadhili'
        };

        res.json({
            success: true,
            ...response,
            processingTime: 100
        });

    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get medication information
router.post('/medication-info', async (req, res) => {
    try {
        const { medicationName } = req.body;
        
        // Mock response for now
        res.json({
            found: true,
            medication: {
                drugName: medicationName,
                genericName: medicationName,
                category: 'general',
                description: 'Common medication',
                sideEffects: ['Consult your doctor']
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check drug interactions
router.post('/check-interactions', async (req, res) => {
    try {
        const { medications } = req.body;
        
        res.json({
            interactions: [],
            severity: 'none',
            recommendations: ['No interactions found']
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;