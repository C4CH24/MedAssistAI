const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

// route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const medicationRoutes = require('./routes/medication.routes');
const reminderRoutes = require('./routes/reminder.routes');
const aiRoutes = require('./routes/ai.routes');
const healthRoutes = require('./routes/health.routes');

const notFound = require('./middleware/notFound.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Global middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5001'],
    credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);

// Root/basic endpoints
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to MedAssist API',
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
