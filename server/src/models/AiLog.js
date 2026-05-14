const mongoose = require('mongoose');

const aiLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    requestId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    engine: {
        type: String,
        enum: ['fadhili', 'gemini', 'rule-based'],
        required: true,
        index: true
    },
    queryType: {
        type: String,
        enum: ['reminder', 'interaction', 'suggestion', 'health-tip', 'general'],
        required: true
    },
    query: {
        type: String,
        required: true
    },
    response: mongoose.Schema.Types.Mixed,
    responseTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'fallback'],
        required: true
    },
    fallbackReason: String,
    tokensUsed: Number,
    confidence: {
        type: Number,
        min: 0,
        max: 100
    },
    metadata: {
        modelVersion: String,
        temperature: Number,
        maxTokens: Number,
        language: String
    },
    errorDetails: {
        code: String,
        message: String,
        stack: String
    }
}, {
    timestamps: true
});

// Indexes
aiLogSchema.index({ userId: 1, createdAt: -1 });
aiLogSchema.index({ engine: 1, status: 1 });
aiLogSchema.index({ queryType: 1, createdAt: -1 });

// Get usage statistics
aiLogSchema.statics.getUsageStats = async function(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const stats = await this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    engine: '$engine',
                    status: '$status'
                },
                count: { $sum: 1 },
                avgResponseTime: { $avg: '$responseTime' },
                totalTokens: { $sum: '$tokensUsed' }
            }
        },
        {
            $group: {
                _id: '$_id.engine',
                statuses: {
                    $push: {
                        status: '$_id.status',
                        count: '$count',
                        avgResponseTime: '$avgResponseTime',
                        totalTokens: '$totalTokens'
                    }
                },
                total: { $sum: '$count' }
            }
        }
    ]);
    
    return stats;
};

// Get failover statistics
aiLogSchema.statics.getFailoverStats = async function(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const stats = await this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
                status: 'fallback'
            }
        },
        {
            $group: {
                _id: {
                    fallbackReason: '$fallbackReason',
                    queryType: '$queryType'
                },
                count: { $sum: 1 },
                avgResponseTime: { $avg: '$responseTime' }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    
    return stats;
};

module.exports = mongoose.model('AILog', aiLogSchema);
