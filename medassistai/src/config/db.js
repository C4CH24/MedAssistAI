const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // For local MongoDB (if you have MongoDB installed locally)
        const conn = await mongoose.connect('mongodb://localhost:27017/medassist', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log(MongoDB Connected: );
        console.log(Database: );
    } catch (error) {
        console.error(Error connecting to MongoDB: );
        process.exit(1);
    }
};

module.exports = connectDB;
