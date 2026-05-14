const mongoose = require('mongoose');
require('dotenv').config();

async function forceActive() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // Force set isActive as a boolean
        const result = await users.updateOne(
            { phoneNumber: '745678901' },
            { 
                $set: { 
                    isActive: true,
                    active: true,
                    status: "active"
                } 
            }
        );
        
        console.log('? Update result:', result.modifiedCount > 0 ? 'Updated' : 'No changes');
        
        // Verify the type
        const user = await users.findOne({ phoneNumber: '745678901' });
        console.log('\n?? Verification:');
        console.log('   isActive:', user.isActive);
        console.log('   type of isActive:', typeof user.isActive);
        console.log('   isActive === true:', user.isActive === true);
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

forceActive();
