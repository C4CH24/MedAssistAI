const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/medications', require('./medication.routes'));
router.use('/reminders', require('./reminder.routes'));
router.use('/ai', require('./ai.routes'));

router.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

module.exports = router;
