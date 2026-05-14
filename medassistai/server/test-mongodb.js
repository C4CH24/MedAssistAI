const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('?? Testing MongoDB Connection...');
    console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('? Successfully connected to MongoDB!');
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('?? Collections:', collections.map(c => c.name).join(', '));
        
        await mongoose.connection.close();
        console.log('?? Connection closed');
    } catch (error) {
        console.error('? Connection failed:', error.message);
        console.log('\nPossible solutions:');
        console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
        console.log('2. Verify username and password are correct');
        console.log('3. Make sure the database name is correct');
        console.log('4. Check if you have network access to MongoDB Atlas');
    }
}

testConnection();
