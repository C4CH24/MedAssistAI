const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('?? Testing MongoDB Connection...');
    console.log('This may take up to 60 seconds...\n');
    
    const startTime = Date.now();
    
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 60000,
            connectTimeoutMS: 60000
        });
        
        const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`? CONNECTED in ${timeElapsed} seconds!`);
        
        const admin = mongoose.connection.db.admin();
        const info = await admin.serverInfo();
        console.log(`?? MongoDB version: ${info.version}`);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`?? Collections: ${collections.map(c => c.name).join(', ') || 'none'}`);
        
        await mongoose.connection.close();
        console.log('?? Connection closed');
        
    } catch (error) {
        const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`? FAILED after ${timeElapsed} seconds`);
        console.log('Error:', error.message);
    }
}

testConnection();
