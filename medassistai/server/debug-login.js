const mongoose = require('mongoose');
require('dotenv').config();

async function debugLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // Get the user with PIN field (like login controller does)
        const user = await users.findOne(
            { phoneNumber: '745678901' },
            { projection: { pin: 1, isActive: 1, fullName: 1, phoneNumber: 1 } }
        );
        
        console.log('?? User from database:');
        console.log('   fullName:', user.fullName);
        console.log('   phoneNumber:', user.phoneNumber);
        console.log('   isActive:', user.isActive);
        console.log('   type of isActive:', typeof user.isActive);
        console.log('   pin exists:', !!user.pin);
        console.log('   pin length:', user.pin.length);
        
        // Now simulate the login controller logic
        if (!user) {
            console.log('? User not found');
        } else if (!user.isActive) {
            console.log('? Account is deactivated - this is the error we are getting!');
            console.log('   isActive value:', user.isActive);
            console.log('   type of isActive:', typeof user.isActive);
        } else {
            console.log('? Account is active - login should work!');
        }
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

debugLogin();
