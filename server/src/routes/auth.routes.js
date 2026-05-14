const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth.middleware');
const {
    register,
    login,
    sendPin,
    verifyPin,
    getMe,
    logout,
    changePin
} = require('../controllers/auth.controller');

// Validation rules
const registerValidation = [
    body('phoneNumber')
        .matches(/^[0-9]{9}$/)
        .withMessage('Please enter a valid 9-digit phone number'),
    body('fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('pin')
        .isLength({ min: 6, max: 6 })
        .withMessage('PIN must be exactly 6 digits')
        .isNumeric()
        .withMessage('PIN must contain only numbers'),
    body('dataConsent')
        .custom((value) => value === true || value === 'true')
        .withMessage('Data consent is required'),
    body('conditions')
        .optional()
        .isArray(),
    body('language')
        .optional()
        .isIn(['en', 'sw'])
        .withMessage('Language must be either en or sw')
];

const loginValidation = [
    body('phoneNumber')
        .matches(/^[0-9]{9}$/)
        .withMessage('Please enter a valid 9-digit phone number'),
    body('pin')
        .isLength({ min: 6, max: 6 })
        .withMessage('PIN must be exactly 6 digits')
        .isNumeric()
        .withMessage('PIN must contain only numbers')
];

const pinValidation = [
    body('phoneNumber')
        .matches(/^[0-9]{9}$/)
        .withMessage('Please enter a valid 9-digit phone number'),
    body('pin')
        .isLength({ min: 6, max: 6 })
        .withMessage('PIN must be exactly 6 digits')
        .isNumeric()
        .withMessage('PIN must contain only numbers')
];

const changePinValidation = [
    body('currentPin')
        .isLength({ min: 6, max: 6 })
        .withMessage('Current PIN must be exactly 6 digits'),
    body('newPin')
        .isLength({ min: 6, max: 6 })
        .withMessage('New PIN must be exactly 6 digits')
        .isNumeric()
        .withMessage('New PIN must contain only numbers')
        .custom((value, { req }) => {
            if (value === req.body.currentPin) {
                throw new Error('New PIN must be different from current PIN');
            }
            return true;
        })
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/send-pin', [body('phoneNumber').matches(/^[0-9]{9}$/)], sendPin);
router.post('/verify-pin', pinValidation, verifyPin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-pin', protect, changePinValidation, changePin);

module.exports = router;
