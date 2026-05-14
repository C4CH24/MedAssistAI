const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');

router.get('/', (req, res) => {
    const healthcheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: {
            status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
            name: mongoose.connection.name,
            host: mongoose.connection.host
        },
        system: {
            memory: {
                free: os.freemem(),
                total: os.totalmem(),
                usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%'
            },
            cpu: os.cpus().length,
            loadavg: os.loadavg(),
            platform: os.platform(),
            uptime: os.uptime()
        },
        ai: {
            fadhili: isConfigured(process.env.FADHILI_API_KEY) ? 'available' : 'unconfigured',
            gemini: isConfigured(process.env.GEMINI_API_KEY) ? 'available' : 'unconfigured'
        }
    };

    res.status(200).json(healthcheck);
});

router.get('/deep', async (req, res) => {
    // Deep health check - test database connection
    try {
        await mongoose.connection.db.admin().ping();
        
        res.status(200).json({
            status: 'OK',
            database: 'responsive',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            database: 'unreachable',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

function isConfigured(key) {
    return key && key.trim() !== '' && !key.includes('your_');
}

module.exports = router;
