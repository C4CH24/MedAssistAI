const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');

// All reminder routes are protected
router.use(protect);

// Get all reminders for the current user
router.get('/', async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.userId })
            .populate('medicationId')
            .sort({ scheduledTime: 1 });
        
        res.json({
            success: true,
            reminders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get today's reminders
router.get('/today', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const reminders = await Reminder.find({
            userId: req.userId,
            scheduledTime: { $gte: startOfDay, $lte: endOfDay }
        }).populate('medicationId');
        
        res.json({
            success: true,
            reminders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Mark reminder as taken
router.put('/:id/taken', async (req, res) => {
    try {
        const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.userId });
        
        if (!reminder) {
            return res.status(404).json({ success: false, error: 'Reminder not found' });
        }
        
        reminder.isTaken = true;
        reminder.takenTime = new Date();
        await reminder.save();
        
        res.json({ success: true, reminder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
