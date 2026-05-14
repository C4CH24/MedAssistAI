const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medassist', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('MongoDB Connected: ' + conn.connection.host);
        console.log('Database: ' + conn.connection.name);

        // --- one‑time migration check ------------------------------------------------
        try {
            const User = require('../models/User');
            const result = await User.updateMany(
                { isActive: { $exists: false } },
                { $set: { isActive: true } }
            );
            if (result.modifiedCount > 0) {
                console.log(`? Startup migration: added isActive to ${result.modifiedCount} users`);
            }
        } catch (mErr) {
            console.error('! Migration check failed:', mErr.message);
        }
        // -----------------------------------------------------------------------------
        
        return conn;
    } catch (error) {
        console.error('MongoDB Connection Error: ' + error.message);
        console.log('Server will start but database features will not work until MongoDB is connected');
        return null;
    }
};

module.exports = connectDB;
