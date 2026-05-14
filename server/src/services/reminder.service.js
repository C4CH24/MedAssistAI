const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Medication = require('../models/Medication');
const User = require('../models/User');
const smsService = require('./sms.service');
const aiService = require('./ai.service');
const logger = require('../utils/logger');

class ReminderService {
    constructor() {
        this.initializeScheduler();
    }

    initializeScheduler() {
        // Run every minute
        cron.schedule('* * * * *', async () => {
            try {
                await this.processDueReminders();
            } catch (error) {
                logger.error('Reminder processing error:', error);
            }
        });

        // Run daily at 2 AM for cleanup
        cron.schedule('0 2 * * *', async () => {
            try {
                await this.cleanupOldReminders();
            } catch (error) {
                logger.error('Reminder cleanup error:', error);
            }
        });

        logger.info('Reminder scheduler initialized');
    }

    async processDueReminders() {
        const dueReminders = await Reminder.findDueReminders();
        
        if (dueReminders.length === 0) return;

        logger.info(`Processing ${dueReminders.length} due reminders`);

        for (const reminder of dueReminders) {
            try {
                await this.sendReminder(reminder);
            } catch (error) {
                logger.error(`Failed to process reminder ${reminder._id}:`, error);
                reminder.metadata = {
                    ...reminder.metadata,
                    errorMessage: error.message,
                    retryCount: (reminder.metadata?.retryCount || 0) + 1
                };
                await reminder.save();
            }
        }
    }

    async sendReminder(reminder) {
        const user = reminder.userId;
        const medication = reminder.medicationId;

        if (!user || !medication) {
            reminder.status = 'cancelled';
            await reminder.save();
            return;
        }

        // Check quiet hours
        if (this.isQuietHours(user)) {
            logger.info(`Skipping reminder for user ${user._id} during quiet hours`);
            return;
        }

        // Generate personalized message using AI
        let message = '';
        let aiSource = 'fadhili';

        try {
            const aiResponse = await aiService.generateReminderMessage({
                userName: user.fullName,
                medicationName: medication.name,
                dosage: medication.dosage,
                language: user.language,
                condition: medication.conditionTreated
            });
            message = aiResponse.message;
            aiSource = aiResponse.source;
        } catch (error) {
            logger.error('AI reminder generation failed:', error);
            // Fallback to basic message
            message = user.language === 'sw' 
                ? `Wakati wa kuchukua dawa yako: ${medication.name} ${medication.dosage}`
                : `Time to take your medication: ${medication.name} ${medication.dosage}`;
            aiSource = 'rule-based';
        }

        // Send based on user preferences
        reminder.status = 'sent';
        reminder.aiSource = aiSource;
        reminder.personalizedMessage = message;

        if (user.notificationPreferences?.sms && this.shouldSendSMS(user)) {
            const result = await smsService.sendSMS(
                user.phoneNumber,
                message
            );
            
            reminder.metadata = {
                ...reminder.metadata,
                sentVia: 'sms',
                deliveryStatus: result.success ? 'delivered' : 'failed',
                messageId: result.messageId
            };

            if (result.success) {
                reminder.deliveredAt = new Date();
                logger.info(`SMS reminder sent to ${user.phoneNumber}`);
            }
        }

        await reminder.save();

        // Schedule follow-up if not taken within 30 minutes
        setTimeout(async () => {
            await this.checkReminderStatus(reminder._id);
        }, 30 * 60 * 1000);
    }

    async checkReminderStatus(reminderId) {
        const reminder = await Reminder.findById(reminderId)
            .populate('userId medicationId');

        if (!reminder || reminder.status !== 'sent') return;

        // If still not taken, mark as missed
        reminder.status = 'missed';
        await reminder.save();

        // Send follow-up SMS
        if (reminder.userId?.notificationPreferences?.sms) {
            const followUpMessage = reminder.userId.language === 'sw'
                ? 'Umekosa kuchukua dawa yako. Tafadhali ichukue sasa.'
                : 'You missed taking your medication. Please take it now.';

            await smsService.sendSMS(
                reminder.userId.phoneNumber,
                followUpMessage
            );
        }

        logger.info(`Reminder ${reminderId} marked as missed`);
    }

    isQuietHours(user) {
        if (!user.notificationPreferences?.quietHoursStart) return false;

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const [startHour, startMinute] = user.notificationPreferences.quietHoursStart.split(':').map(Number);
        const [endHour, endMinute] = user.notificationPreferences.quietHoursEnd.split(':').map(Number);

        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (startTime < endTime) {
            return currentTime >= startTime && currentTime <= endTime;
        } else {
            // Spans midnight
            return currentTime >= startTime || currentTime <= endTime;
        }
    }

    shouldSendSMS(user) {
        // Check if user has been inactive in the app
        if (!user.lastActive) return true;

        const hoursSinceActive = (Date.now() - user.lastActive) / (1000 * 60 * 60);
        return hoursSinceActive > 24; // Send SMS if inactive for 24+ hours
    }

    async cleanupOldReminders() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await Reminder.deleteMany({
            status: { $in: ['taken', 'missed', 'cancelled'] },
            scheduledTime: { $lt: thirtyDaysAgo }
        });

        logger.info('Old reminders cleaned up');
    }
}

// Generate reminder schedule for a medication
async function generateReminderSchedule(medication) {
    const reminders = [];
    const startDate = new Date(medication.startDate);
    const endDate = medication.endDate ? new Date(medication.endDate) : null;
    const now = new Date();

    // Start from today if start date is in the past
    const currentDate = startDate > now ? startDate : now;
    
    // Generate for next 30 days
    const maxDate = new Date(currentDate);
    maxDate.setDate(maxDate.getDate() + 30);

    while (currentDate <= maxDate && (!endDate || currentDate <= endDate)) {
        for (const timeStr of medication.times) {
            const [hours, minutes] = timeStr.split(':');
            const scheduledTime = new Date(currentDate);
            scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            if (scheduledTime > now) {
                reminders.push({
                    userId: medication.userId,
                    medicationId: medication._id,
                    scheduledTime,
                    channel: 'both',
                    aiGenerated: true
                });
            }
        }

        // Move to next day based on frequency
        switch (medication.frequency) {
            case 'daily':
            case 'twice_daily':
            case 'three_times':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'as_needed':
                // Don't generate automatic reminders for as-needed meds
                return [];
        }
    }

    if (reminders.length > 0) {
        await Reminder.insertMany(reminders);
    }

    return reminders;
}

module.exports = {
    reminderService: new ReminderService(),
    generateReminderSchedule
};
