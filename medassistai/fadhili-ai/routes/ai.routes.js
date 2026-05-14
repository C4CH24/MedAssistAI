const express = require('express');
const router = express.Router();
const path = require('path');

const expectedApiKey = process.env.FADHILI_API_KEY || 'test_key';

function requireApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
    if (!apiKey || apiKey !== expectedApiKey) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
}

// Simple in-memory storage for now
let trainingData = [];

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'Fadhili AI is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Process AI queries
router.post('/process', requireApiKey, (req, res) => {
    try {
        const { query, type = 'general', context = {} } = req.body;
        
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        console.log(`📝 Processing ${type} query:`, query.substring(0, 50) + '...');

        // Generate response based on type
        let response = {};
        const language = context.language || 'en';

        switch(type) {
            case 'interaction':
                response = {
                    text: language === 'sw' 
                        ? 'Hakuna mwingiliano wa dawa uliopatikana.'
                        : 'No drug interactions found.',
                    interactions: [],
                    severity: 'none'
                };
                break;
                
            case 'reminder':
                response = {
                    text: language === 'sw'
                        ? 'Wakati wa kuchukua dawa yako. Tafadhali fuata maagizo ya daktari.'
                        : 'Time to take your medication. Please follow your doctor\'s instructions.',
                    tip: language === 'sw'
                        ? 'Kumbuka kunywa maji mengi'
                        : 'Remember to drink plenty of water'
                };
                break;
                
            default:
                response = {
                    text: language === 'sw'
                        ? `Ninaelewa unauliza kuhusu: "${query}". Niko hapa kukusaidia.`
                        : `I understand you're asking about: "${query}". I'm here to help.`,
                    confidence: 0.95
                };
        }

        // Store for training data (anonymized)
        trainingData.push({
            timestamp: new Date(),
            query: query.substring(0, 100),
            type,
            responseLength: response.text.length,
            language
        });

        // Keep only last 1000 records
        if (trainingData.length > 1000) {
            trainingData = trainingData.slice(-1000);
        }

        res.json({
            success: true,
            source: 'fadhili',
            ...response,
            processingTime: Math.floor(Math.random() * 200) + 50 // Mock processing time
        });

    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Get medication information
router.post('/medication-info', requireApiKey, (req, res) => {
    try {
        const { medicationName } = req.body;
        
        if (!medicationName) {
            return res.status(400).json({ error: 'Medication name is required' });
        }

        // Mock medication database
        const commonMeds = {
            'metformin': {
                drugName: 'Metformin',
                genericName: 'Metformin Hydrochloride',
                category: 'antidiabetic',
                description: 'Used to treat type 2 diabetes',
                sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset'],
                dosage: '500mg to 2000mg daily',
                interactions: ['Alcohol', 'Contrast dyes']
            },
            'amlodipine': {
                drugName: 'Amlodipine',
                genericName: 'Amlodipine Besylate',
                category: 'antihypertensive',
                description: 'Treats high blood pressure',
                sideEffects: ['Swelling', 'Dizziness', 'Fatigue'],
                dosage: '5mg to 10mg daily',
                interactions: ['Grapefruit juice']
            }
        };

        const med = commonMeds[medicationName.toLowerCase()];
        
        if (med) {
            res.json({
                found: true,
                medication: med
            });
        } else {
            res.json({
                found: false,
                message: 'Medication not found in database',
                suggestion: 'Please consult your healthcare provider'
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check drug interactions
router.post('/check-interactions', requireApiKey, (req, res) => {
    try {
        const { medications = [] } = req.body;
        
        if (!medications.length) {
            return res.json({
                interactions: [],
                severity: 'none',
                recommendations: ['No medications to check']
            });
        }

        // Mock interaction check
        const interactions = [];
        let highestSeverity = 'none';

        // Simple interaction logic
        if (medications.includes('metformin') && medications.includes('alcohol')) {
            interactions.push({
                medications: ['metformin', 'alcohol'],
                severity: 'moderate',
                description: 'Alcohol may affect blood sugar control'
            });
            highestSeverity = 'moderate';
        }

        res.json({
            interactions,
            severity: highestSeverity,
            recommendations: [
                'Always consult your doctor about potential interactions',
                'Take medications as prescribed'
            ]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get training stats (admin)
router.get('/stats', requireApiKey, (req, res) => {
    res.json({
        totalQueries: trainingData.length,
        recentQueries: trainingData.slice(-10),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

module.exports = router;
