const mongoose = require('mongoose');
require('dotenv').config();
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 MongoDB Atlas Connection Helper');
console.log('==================================\n');

// Ask for connection string
rl.question('📝 Paste your connection string from Atlas: ', (connectionString) => {
    
    // Ask for password
    rl.question('🔑 Enter your database user password: ', async (password) => {
        
        // Replace <password> placeholder with actual password
        const finalConnectionString = connectionString.replace('<password>', password);
        
        console.log('\n🔌 Testing connection...');
        
        try {
            await mongoose.connect(finalConnectionString);
            console.log('✅ SUCCESS! Connected to MongoDB Atlas!');
            
            const db = mongoose.connection.db;
            console.log(`📊 Database: ${db.databaseName}`);
            console.log(`🌍 Host: ${mongoose.connection.host}`);
            
            await mongoose.connection.close();
            console.log('\n✅ Update your .env file with:');
            console.log(`MONGODB_URI=${finalConnectionString}`);
            
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
            
            if (error.message.includes('Authentication failed')) {
                console.log('\n💡 Common fixes:');
                console.log('   1. Password might be wrong - reset it in Database Access');
                console.log('   2. Username might be wrong - check it\'s "medassist_user"');
                console.log('   3. Special characters in password need URL encoding');
                console.log('      - @ becomes %40');
                console.log('      - ! becomes %21');
                console.log('      - # becomes %23');
                console.log('      - $ becomes %24');
            }
        }
        
        rl.close();
    });
});
