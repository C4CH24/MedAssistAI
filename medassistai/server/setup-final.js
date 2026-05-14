const mongoose = require('mongoose');
require('dotenv').config();

async function setupDatabase() {
    console.log('🔧 Setting up MedAssistAI database...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = mongoose.connection.db;
        
        // Create collections with schema validation
        console.log('\n📁 Creating collections...');
        
        // Users collection
        await db.createCollection('users');
        await db.collection('users').createIndex({ phoneNumber: 1 }, { unique: true });
        console.log('   ✅ users collection ready');
        
        // Medications collection
        await db.createCollection('medications');
        await db.collection('medications').createIndex({ userId: 1 });
        await db.collection('medications').createIndex({ name: "text", conditionTreated: "text" });
        console.log('   ✅ medications collection ready');
        
        // Reminders collection
        await db.createCollection('reminders');
        await db.collection('reminders').createIndex({ userId: 1, scheduledTime: 1 });
        await db.collection('reminders').createIndex({ status: 1, scheduledTime: 1 });
        console.log('   ✅ reminders collection ready');
        
        // AI Logs collection
        await db.createCollection('ailogs');
        await db.collection('ailogs').createIndex({ userId: 1, createdAt: -1 });
        await db.collection('ailogs').createIndex({ engine: 1, status: 1 });
        console.log('   ✅ ailogs collection ready');
        
        console.log('\n✅ Database setup complete!');
        console.log(`📊 Database: ${db.databaseName}`);
        
        // List all collections
        const collections = await db.listCollections().toArray();
        console.log('\n📋 Available collections:');
        collections.forEach(c => console.log(`   - ${c.name}`));
        
        await mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Setup failed:', error);
    }
}

setupDatabase();
