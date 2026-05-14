const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');
        
        // Check your user
        const yourUser = await users.findOne({ phoneNumber: '745678901' });
        console.log('\nYOUR USER (745678901):');
        if (yourUser) {
            console.log('   _id:', yourUser._id);
            console.log('   isActive:', yourUser.isActive);
            console.log('   type:', typeof yourUser.isActive);
            console.log('   fullName:', yourUser.fullName);
        } else {
            console.log('   User not found!');
        }
        
        // Check the test user
        const testUser = await users.findOne({ phoneNumber: '712345678' });
        console.log('\nTEST USER (712345678):');
        if (testUser) {
            console.log('   _id:', testUser._id);
            console.log('   isActive:', testUser.isActive);
            console.log('   type:', typeof testUser.isActive);
            console.log('   fullName:', testUser.fullName);
        } else {
            console.log('   User not found!');
        }
        
        // Check all users
        const allUsers = await users.find({}).toArray();
        console.log(`\nTotal users in database: ${allUsers.length}`);
        
        allUsers.forEach((u, i) => {
            console.log(`\nUser ${i + 1}:`);
            console.log(`   phone: ${u.phoneNumber}`);
            console.log(`   isActive: ${u.isActive}`);
            console.log(`   name: ${u.fullName || 'No name'}`);
        });
        
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkUsers();
