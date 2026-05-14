const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function forceActivateUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // Delete the existing user completely
        await users.deleteOne({ phoneNumber: '745678901' });
        console.log('? Deleted existing user');
        
        // Hash PIN fresh
        const hashedPin = await bcrypt.hash('123456', 10);
        
        // Create a brand new user with EVERY possible field set to active
        const newUser = {
            phoneNumber: '745678901',
            fullName: 'Test User',
            pin: hashedPin,
            language: 'en',
            role: 'patient',
            dataConsent: true,
            
            // All possible active fields
            isActive: true,
            active: true,
            status: 'active',
            accountStatus: 'active',
            userStatus: 'active',
            activationStatus: 'active',
            account_state: 'active',
            user_status: 'active',
            
            // Deactivation flags all false
            isDeleted: false,
            deleted: false,
            isDisabled: false,
            disabled: false,
            isLocked: false,
            locked: false,
            isSuspended: false,
            suspended: false,
            isBanned: false,
            banned: false,
            isArchived: false,
            archived: false,
            
            // Timestamps
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            activatedAt: new Date(),
            
            // Verification
            emailVerified: true,
            phoneVerified: true
        };
        
        const result = await users.insertOne(newUser);
        console.log('? Brand new user created with ID:', result.insertedId);
        console.log('\n?? Login credentials:');
        console.log('   Phone: 745678901');
        console.log('   PIN:   123456');
        
        // Verify all fields
        const user = await users.findOne({ phoneNumber: '745678901' });
        console.log('\n? Verification - User has', Object.keys(user).length, 'fields');
        console.log('   isActive:', user.isActive);
        console.log('   active:', user.active);
        console.log('   status:', user.status);
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

forceActivateUser();
