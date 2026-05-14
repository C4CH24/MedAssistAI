const Medication = require('../models/Medication');
const Reminder = require('../models/Reminder');

// @desc    Get all medications for user
// @route   GET /api/medications
// @access  Private
exports.getMedications = async (req, res, next) => {
    try {
        const { active, condition, search } = req.query;
        
        // Build query
        let query = { userId: req.userId };
        
        if (active !== undefined) {
            query.active = active === 'true';
        }
        
        if (condition) {
            query.conditionTreated = condition;
        }
        
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        const medications = await Medication.find(query).sort({ createdAt: -1 });
        
        res.json(medications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single medication
// @route   GET /api/medications/:id
// @access  Private
exports.getMedication = async (req, res, next) => {
    try {
        const medication = await Medication.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        
        res.json(medication);
    } catch (error) {
        next(error);
    }
};

// @desc    Create medication
// @route   POST /api/medications
// @access  Private
exports.createMedication = async (req, res, next) => {
    try {
        const medication = await Medication.create({
            ...req.body,
            userId: req.userId
        });
        
        // Create reminders based on frequency
        if (medication.frequency && medication.time) {
            const reminder = await Reminder.create({
                userId: req.userId,
                medicationId: medication._id,
                scheduledTime: medication.time,
                frequency: medication.frequency
            });
        }
        
        res.status(201).json(medication);
    } catch (error) {
        next(error);
    }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res, next) => {
    try {
        const medication = await Medication.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        
        res.json(medication);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res, next) => {
    try {
        const medication = await Medication.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });
        
        if (!medication) {
            return res.status(404).json({ message: 'Medication not found' });
        }
        
        // Delete associated reminders
        await Reminder.deleteMany({ medicationId: req.params.id });
        
        res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get medication statistics
// @route   GET /api/medications/stats
// @access  Private
exports.getMedicationStats = async (req, res, next) => {
    try {
        const total = await Medication.countDocuments({ userId: req.userId });
        const active = await Medication.countDocuments({ userId: req.userId, active: true });
        
        res.json({
            total,
            active,
            categories: await Medication.aggregate([
                { $match: { userId: req.userId } },
                { $group: { _id: '$conditionTreated', count: { $sum: 1 } } }
            ])
        });
    } catch (error) {
        next(error);
    }
};
