const mongoose = require('mongoose');
require('dotenv').config();

async function fixUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // First, let's see what fields exist
        const user = await users.findOne({ phoneNumber: '745678901' });
        console.log('?? Current user fields:', Object.keys(user));
        
        // Update the user with proper MongoDB operators
        const result = await users.updateOne(
            { phoneNumber: '745678901' },
            {
                $set: {
                    "active": true,
                    "isActive": true,
                    "status": "active"
                }
            }
        );
        
        console.log('? Update result:', result.modifiedCount > 0 ? 'Updated' : 'No changes');
        
        // Verify the update
        const updatedUser = await users.findOne({ phoneNumber: '745678901' });
        console.log('\n?? User status now:');
        console.log('   active:', updatedUser.active);
        console.log('   isActive:', updatedUser.isActive);
        console.log('   status:', updatedUser.status);
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

fixUser();
