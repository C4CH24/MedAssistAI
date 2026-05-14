const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Basic route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MedAssist API' });
});

// API routes (you'll add these later)
// app.use('/api/v1/auth', require('./src/routes/authRoutes'));
// app.use('/api/v1/users', require('./src/routes/userRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(Server running in  mode on port );
});
