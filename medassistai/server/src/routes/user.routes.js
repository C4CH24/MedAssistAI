const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User');

// All user routes are protected
router.use(protect);

// Get current user profile
router.get('/me', async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-pin');
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update user profile
router.put('/profile', async (req, res) => {
    try {
        const updates = req.body;
        // Remove fields that shouldn't be updated directly
        delete updates.pin;
        delete updates.role;
        delete updates._id;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            updates,
            { new: true, runValidators: true }
        ).select('-pin');
        
        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
