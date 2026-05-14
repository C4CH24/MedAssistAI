const mongoose = require('mongoose');
require('dotenv').config();

async function checkAllFields() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // Get the complete user document
        const user = await users.findOne({ phoneNumber: '745678901' });
        
        if (user) {
            console.log('?? Complete user document:');
            console.log(JSON.stringify(user, null, 2));
            
            // Check for any field that might indicate deactivation
            console.log('\n?? Checking for deactivation-related fields:');
            const deactivationFields = [
                'active', 'isActive', 'status', 'accountStatus', 
                'isDeleted', 'deleted', 'isDisabled', 'disabled',
                'isLocked', 'locked', 'isSuspended', 'suspended',
                'isBanned', 'banned', 'isArchived', 'archived',
                'deactivationReason', 'deactivationDate', 'deactivatedAt',
                'suspensionReason', 'lockReason', 'bannedReason',
                'account_state', 'user_status', 'activation_status'
            ];
            
            deactivationFields.forEach(field => {
                if (field in user) {
                    console.log(`   ${field}: ${user[field]} (${typeof user[field]})`);
                }
            });
        } else {
            console.log('? User not found');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

checkAllFields();
