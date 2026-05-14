const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedDatabase() {
    console.log('🌱 Seeding MedAssistAI database...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = mongoose.connection.db;
        
        // Hash PIN for test user
        const hashedPin = await bcrypt.hash('123456', 10);
        
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ phoneNumber: '712345678' });
        
        if (existingUser) {
            console.log('⚠️ Test user already exists, skipping...');
        } else {
            // Insert test user
            const userResult = await db.collection('users').insertOne({
                phoneNumber: '712345678',
                fullName: 'Test Patient',
                pin: hashedPin,
                language: 'en',
                conditions: ['hypertension', 'diabetes'],
                dataConsent: true,
                consentGivenAt: new Date(),
                notificationPreferences: {
                    inApp: true,
                    sms: true,
                    quietHoursStart: '22:00',
                    quietHoursEnd: '07:00'
                },
                role: 'patient',
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            console.log('✅ Test user created!');
            
            const userId = userResult.insertedId;
            
            // Insert sample medications
            await db.collection('medications').insertMany([
                {
                    userId: userId,
                    name: 'Metformin',
                    dosage: '500mg',
                    frequency: 'twice_daily',
                    times: ['08:00', '20:00'],
                    conditionTreated: 'diabetes',
                    instructions: 'Take with food',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userId,
                    name: 'Lisinopril',
                    dosage: '10mg',
                    frequency: 'daily',
                    times: ['08:00'],
                    conditionTreated: 'hypertension',
                    instructions: 'Take in the morning',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userId: userId,
                    name: 'Amlodipine',
                    dosage: '5mg',
                    frequency: 'daily',
                    times: ['20:00'],
                    conditionTreated: 'hypertension',
                    instructions: 'Take in the evening',
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            
            console.log('✅ Sample medications created!');
        }
        
        console.log('\n📝 Login credentials:');
        console.log('   Phone: 712345678');
        console.log('   PIN: 123456');
        
        await mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seedDatabase();
