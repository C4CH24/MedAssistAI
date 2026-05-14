const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: [true, 'Medication ID is required'],
        index: true
    },
    scheduledTime: {
        type: Date,
        required: [true, 'Scheduled time is required'],
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'taken', 'snoozed', 'missed', 'cancelled'],
        default: 'pending',
        index: true
    },
    takenAt: Date,
    snoozedUntil: Date,
    snoozeCount: {
        type: Number,
        default: 0,
        max: 3
    },
    channel: {
        type: String,
        enum: ['in-app', 'sms', 'both'],
        default: 'both'
    },
    method: {
        type: String,
        enum: ['in-app', 'sms', 'email'],
        default: 'in-app'
    },
    deliveredAt: Date,
    readAt: Date,
    responseTime: Number,
    aiGenerated: {
        type: Boolean,
        default: false
    },
    aiSource: {
        type: String,
        enum: ['fadhili', 'gemini', 'rule-based'],
        default: 'fadhili'
    },
    personalizedMessage: String,
    metadata: {
        sentVia: String,
        deliveryStatus: String,
        errorMessage: String,
        retryCount: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

// Indexes
reminderSchema.index({ scheduledTime: 1, status: 1 });
reminderSchema.index({ userId: 1, status: 1, scheduledTime: -1 });
reminderSchema.index({ medicationId: 1, scheduledTime: 1 });

// Mark as taken
reminderSchema.methods.markAsTaken = function() {
    this.status = 'taken';
    this.takenAt = new Date();
    this.responseTime = Math.round((this.takenAt - this.scheduledTime) / 1000);
    return this.save();
};

// Mark as missed
reminderSchema.methods.markAsMissed = function() {
    if (this.status === 'pending') {
        this.status = 'missed';
        return this.save();
    }
    return Promise.resolve(this);
};

// Snooze reminder
reminderSchema.methods.snooze = function(minutes = 15) {
    if (this.snoozeCount >= 3) {
        throw new Error('Maximum snooze limit reached');
    }
    
    this.status = 'snoozed';
    this.snoozedUntil = new Date(Date.now() + minutes * 60000);
    this.snoozeCount += 1;
    return this.save();
};

// Find due reminders
reminderSchema.statics.findDueReminders = function() {
    const now = new Date();
    return this.find({
        scheduledTime: { $lte: now },
        status: 'pending',
        $or: [
            { snoozedUntil: { $lte: now } },
            { snoozedUntil: { $exists: false } }
        ]
    }).populate('userId medicationId');
};

// Get adherence stats
reminderSchema.statics.getAdherenceStats = async function(userId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const stats = await this.aggregate([
        {
            $match: {
                userId: mongoose.Types.ObjectId(userId),
                scheduledTime: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                taken: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'taken'] }, 1, 0]
                    }
                },
                missed: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'missed'] }, 1, 0]
                    }
                },
                pending: {
                    $sum: {
                        $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
                    }
                }
            }
        }
    ]);
    
    const result = stats[0] || { total: 0, taken: 0, missed: 0, pending: 0 };
    result.adherenceRate = result.total > 0 
        ? Math.round((result.taken / result.total) * 100) 
        : 0;
    
    return result;
};

module.exports = mongoose.model('Reminder', reminderSchema);
