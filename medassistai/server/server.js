const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking)
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`\n?? Server running on port ${PORT}`);
    console.log(`?? Local: http://localhost:${PORT}`);
    console.log(`?? API: http://localhost:${PORT}/api`);
    console.log(`?? Health: http://localhost:${PORT}/api/health`);
    console.log(`?? Database: ${mongoose.connection.readyState === 1 ? '? Connected' : '? Connecting...'}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        mongoose.connection.close(false).then(() => {
            console.log('Database connection closed');
            process.exit(0);
        });
    });
});

module.exports = app;
