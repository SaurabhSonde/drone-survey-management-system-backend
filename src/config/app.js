const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const missionScheduler = require('../services/missionScheduler');


// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
};


const createApp = () => {
    const app = express();

    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    missionScheduler.initializeSocket(io);

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes
    const missionRoutes = require('../routes/missionRoutes');
    const droneRoutes = require('../routes/droneRoutes');
    const organizationRoutes = require('../routes/organizationRoutes');

    app.use('/api/missions', missionRoutes);
    app.use('/api/drones', droneRoutes);
    app.use('/api/organizations', organizationRoutes);

    // Global error handler
    app.use(errorHandler);

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            message: 'Endpoint not found',
            status: 404
        });
    });

    return server;
};


// Database connection
const connectDatabase = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
const handleUncaughtExceptions = () => {
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
};

// Start server
const startServer = (app, port = 4000) => {
    // Connect to database before starting server
    connectDatabase();

    // Handle uncaught exceptions
    handleUncaughtExceptions();

    // Start listening
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    return server;
};

module.exports = {
    createApp,
    startServer
};