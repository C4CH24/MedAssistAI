const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const {
    getMedications,
    getMedication,
    createMedication,
    updateMedication,
    deleteMedication,
    getMedicationStats
} = require('../controllers/medication.controller');

// Validation rules
const medicationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Medication name is required')
        .isLength({ max: 100 })
        .withMessage('Medication name cannot exceed 100 characters'),
    body('dosage')
        .trim()
        .notEmpty()
        .withMessage('Dosage is required'),
    body('frequency')
        .isIn(['daily', 'twice_daily', 'three_times', 'weekly', 'as_needed'])
        .withMessage('Invalid frequency'),
    body('times')
        .optional()
        .isArray()
        .withMessage('Times must be an array'),
    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date')
        .custom((value, { req }) => {
            if (value && req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];

// Apply auth middleware to all routes
router.use(protect);

// Routes
router.get('/', getMedications);
router.get('/stats', getMedicationStats);
router.get('/:id', getMedication);
router.post('/', medicationValidation, createMedication);
router.put('/:id', medicationValidation, updateMedication);
router.delete('/:id', deleteMedication);

module.exports = router;
