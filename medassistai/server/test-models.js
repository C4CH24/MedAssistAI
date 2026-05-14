const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Medication = require('./src/models/Medication');

async function testModels() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Find test user
        const user = await User.findOne({ phoneNumber: '712345678' });
        console.log('\n✅ Found test user:', user.fullName);
        
        // Find their medications
        const medications = await Medication.find({ userId: user._id });
        console.log(`\n💊 Found ${medications.length} medications:`);
        medications.forEach(med => {
            console.log(`   - ${med.name} ${med.dosage} (${med.frequency})`);
        });
        
        await mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testModels();
