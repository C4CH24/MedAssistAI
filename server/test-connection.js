const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔌 Testing MongoDB Atlas Connection...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas!');
        
        // Get database info
        const db = mongoose.connection.db;
        console.log(`📊 Database: ${db.databaseName}`);
        console.log(`🌍 Host: ${mongoose.connection.host}`);
        
        // Create a test document
        console.log('\n📝 Testing write operation...');
        const testCollection = db.collection('test');
        await testCollection.insertOne({ 
            message: 'MedAssistAI connected!',
            timestamp: new Date()
        });
        console.log('✅ Write successful!');
        
        // Clean up
        await testCollection.drop();
        console.log('🧹 Test collection cleaned up');
        
        await mongoose.connection.close();
        console.log('\n✅ Your database is working perfectly!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.log('\n💡 Check your username and password in MONGODB_URI');
        } else if (error.message.includes('getaddrinfo')) {
            console.log('\n💡 Check your cluster address in MONGODB_URI');
        }
    }
}

testConnection();
