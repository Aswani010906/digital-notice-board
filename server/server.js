const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
const startArchiver = require('./utils/archiveScheduler');

const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Start the cron scheduler
startArchiver();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Digital Notice Board API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
