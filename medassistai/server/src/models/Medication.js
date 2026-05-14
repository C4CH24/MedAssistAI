const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    name: {
        type: String,
        required: [true, 'Medication name is required'],
        trim: true,
        maxlength: [100, 'Medication name cannot exceed 100 characters']
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required'],
        trim: true
    },
    frequency: {
        type: String,
        required: [true, 'Frequency is required'],
        enum: ['daily', 'twice_daily', 'three_times', 'weekly', 'as_needed']
    },
    times: [{
        type: String,
        match: [/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
    }],
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now
    },
    endDate: {
        type: Date
    },
    conditionTreated: {
        type: String,
        trim: true
    },
    instructions: {
        type: String,
        maxlength: [500, 'Instructions cannot exceed 500 characters']
    },
    sideEffects: [String],
    interactions: [{
        medicationName: String,
        severity: {
            type: String,
            enum: ['low', 'medium', 'high']
        },
        description: String
    }],
    refillReminder: {
        enabled: { type: Boolean, default: false },
        quantity: Number,
        refillDate: Date,
        reminderDays: { type: Number, default: 7 }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    metadata: {
        source: { type: String, enum: ['user', 'fadhili', 'gemini'], default: 'user' },
        confidence: { type: Number, min: 0, max: 100 }
    }
}, {
    timestamps: true
});

// Indexes
medicationSchema.index({ userId: 1, isActive: 1 });
medicationSchema.index({ name: 'text', conditionTreated: 'text' });
medicationSchema.index({ startDate: 1, endDate: 1 });

// Check if medication is active
medicationSchema.methods.isCurrentlyActive = function() {
    const now = new Date();
    const startValid = !this.startDate || this.startDate <= now;
    const endValid = !this.endDate || this.endDate >= now;
    return startValid && endValid && this.isActive;
};

// Get today's doses
medicationSchema.methods.getTodaysDoses = function() {
    if (!this.isCurrentlyActive()) return [];
    
    if (this.frequency === 'daily' || this.frequency === 'twice_daily' || this.frequency === 'three_times') {
        return this.times;
    } else if (this.frequency === 'weekly') {
        // For weekly, check if today matches the day of week
        const today = new Date().getDay();
        return this.times.filter(time => {
            // This assumes times are stored with day info, e.g., "1-08:00" for Monday 8am
            const [day, timeStr] = time.split('-');
            return parseInt(day) === today;
        }).map(t => t.split('-')[1]);
    }
    return [];
};

// Virtual for full medication info
medicationSchema.virtual('details').get(function() {
    return {
        id: this._id,
        name: this.name,
        dosage: this.dosage,
        frequency: this.frequency,
        times: this.times,
        conditionTreated: this.conditionTreated,
        instructions: this.instructions,
        isActive: this.isActive,
        startDate: this.startDate,
        endDate: this.endDate
    };
});

module.exports = mongoose.model('Medication', medicationSchema);
