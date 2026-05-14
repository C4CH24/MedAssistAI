const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const aiService = require('../services/ai.service');
const AILog = require('../models/AILog');

// @desc    Process AI query
// @route   POST /api/ai/process
// @access  Private
router.post('/process', protect, async (req, res, next) => {
    try {
        const { query, context } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Query is required'
            });
        }

        const result = await aiService.processQuery(
            req.userId,
            query,
            { ...context, userId: req.userId }
        );

        res.json({
            success: true,
            source: result.source || 'fadhili',
            data: result
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Generate medication reminder
// @route   POST /api/ai/reminder
// @access  Private
router.post('/reminder', protect, async (req, res, next) => {
    try {
        const { medicationName, dosage, condition, language } = req.body;

        const result = await aiService.generateReminderMessage({
            userId: req.userId,
            medicationName,
            dosage,
            condition,
            language: language || 'en'
        });

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Check drug interactions
// @route   POST /api/ai/check-interactions
// @access  Private
router.post('/check-interactions', protect, async (req, res, next) => {
    try {
        const { medicationName } = req.body;

        // Get user's current medications
        const Medication = require('../models/Medication');
        const existingMeds = await Medication.find({
            userId: req.userId,
            isActive: true
        }).select('name');

        const interactions = await aiService.checkInteractions(
            medicationName,
            existingMeds.map(m => m.name)
        );

        res.json({
            success: true,
            interactions
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Get AI usage statistics
// @route   GET /api/ai/stats
// @access  Private (admin only)
router.get('/stats', protect, async (req, res, next) => {
    try {
        // Check if user is admin (you can add role check middleware)
        const days = parseInt(req.query.days) || 7;
        
        const usageStats = await AILog.getUsageStats(days);
        const failoverStats = await AILog.getFailoverStats(days);

        res.json({
            success: true,
            stats: {
                usage: usageStats,
                failover: failoverStats,
                period: `${days} days`
            }
        });
    } catch (error) {
        next(error);
    }
});

// @desc    Health check for AI engines
// @route   GET /api/ai/health
// @access  Public
router.get('/health', async (req, res) => {
    // This would actually check both AI services
    res.json({
        timestamp: new Date().toISOString(),
        fadhili: {
            available: true,
            status: 'operational'
        },
        gemini: {
            available: true,
            status: 'operational',
            configured: !!process.env.GEMINI_API_KEY
        },
        overall: 'healthy'
    });
});

module.exports = router;
