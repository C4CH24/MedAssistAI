const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function debugLoginDirect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('? Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // This is EXACTLY what the login controller does
        const user = await users.findOne(
            { phoneNumber: '745678901' }
        );
        
        console.log('?? User found in database:');
        console.log('   fullName:', user.fullName);
        console.log('   isActive:', user.isActive);
        console.log('   type of isActive:', typeof user.isActive);
        console.log('   isActive === true:', user.isActive === true);
        
        // Check if the field exists and its value
        if (user.isActive === undefined) {
            console.log('??  isActive field is UNDEFINED!');
        } else if (user.isActive === true) {
            console.log('? isActive is TRUE - login should work!');
        } else if (user.isActive === false) {
            console.log('? isActive is FALSE - this would cause deactivation');
        } else {
            console.log('??  isActive is something else:', user.isActive);
        }
        
        // Check for any other fields that might be checked
        console.log('\n?? Checking all boolean fields:');
        Object.keys(user).forEach(key => {
            if (typeof user[key] === 'boolean') {
                console.log(`   ${key}: ${user[key]}`);
            }
        });
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('? Error:', error.message);
    }
}

debugLoginDirect();
