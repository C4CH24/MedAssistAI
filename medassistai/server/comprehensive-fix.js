const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function comprehensiveUserFix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // First, let's see what fields the user has
        const user = await users.findOne({ phoneNumber: '745678901' });
        console.log('?? Current user fields:', Object.keys(user));
        
        // Ensure every document has an isActive flag (and related fields) so login logic works
        const result = await users.updateMany(
            { isActive: { $exists: false } },
            {
                $set: {
                    isActive: true
                }
            }
        );
        console.log('? Added isActive=true to', result.modifiedCount, 'documents');
        
        // Set ALL possible active/deactivation fields for the sample user (debugging helper)
        const sampleResult = await users.updateOne(
            { phoneNumber: '745678901' },
            {
                $set: {
                    // Common active fields
                    "active": true,
                    "isActive": true,
                    "status": "active",
                    "accountStatus": "active",
                    "isVerified": true,
                    "verified": true,
                    "isDeleted": false,
                    "deleted": false,
                    "isDisabled": false,
                    "disabled": false,
                    "isLocked": false,
                    "locked": false,
                    "isSuspended": false,
                    "suspended": false,
                    "isBanned": false,
                    "banned": false,
                    "isArchived": false,
                    "archived": false,
                    
                    // Timestamps
                    "activatedAt": new Date(),
                    "lastLogin": null,
                    "deactivatedAt": null,
                    "deletedAt": null,
                    
                    // Additional fields that might be checked
                    "emailVerified": true,
                    "phoneVerified": true,
                    "accountVerified": true,
                    "verificationStatus": "verified"
                },
                $unset: {
                    "deactivationReason": "",
                    "deactivationDate": "",
                    "suspensionReason": "",
                    "lockReason": ""
                }
            }
        );
        
        console.log('? Update result:', result.modifiedCount > 0 ? 'Updated' : 'No changes');
        
        // Verify the update
        const updatedUser = await users.findOne({ phoneNumber: '745678901' });
        console.log('\n?? User updated fields:');
        console.log('   active:', updatedUser.active);
        console.log('   isActive:', updatedUser.isActive);
        console.log('   status:', updatedUser.status);
        console.log('   accountStatus:', updatedUser.accountStatus);
        console.log('   isVerified:', updatedUser.isVerified);
        console.log('   verified:', updatedUser.verified);
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

comprehensiveUserFix();
