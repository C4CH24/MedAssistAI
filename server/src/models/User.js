const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        match: [/^[0-9]{9}$/, 'Please enter a valid 9-digit phone number']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    pin: {
        type: String,
        required: [true, 'PIN is required'],
        select: false
    },
    language: {
        type: String,
        enum: ['en', 'sw'],
        default: 'en'
    },
    conditions: [{
        type: String
    }],
    emergencyContact: String,
    role: {
        type: String,
        enum: ['patient', 'caregiver', 'provider', 'admin'],
        default: 'patient'
    },
    dataConsent: {
        type: Boolean,
        default: false,
        required: [true, 'Data consent is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash PIN before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('pin')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update timestamps on save
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Compare PIN method
userSchema.methods.comparePin = async function(enteredPin) {
    return await bcrypt.compare(enteredPin, this.pin);
};

// ADD THE MISSING METHOD - updateLastActive
userSchema.methods.updateLastActive = async function() {
    this.lastActive = new Date();
    await this.save();
    return this.lastActive;
};

// Virtual for profile (without sensitive data)
userSchema.virtual('profile').get(function() {
    return {
        _id: this._id,
        phoneNumber: this.phoneNumber,
        fullName: this.fullName,
        language: this.language,
        role: this.role,
        conditions: this.conditions,
        isActive: this.isActive,
        lastActive: this.lastActive
    };
});

// Ensure virtuals are included in JSON
userSchema.set('toJSON', {
    virtuals: true,
    transform: function(doc, ret, options) {
        delete ret.pin;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
