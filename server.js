require('dotenv').config();
const { createApp, startServer } = require('./src/config/app');

// Create Express app
const app = createApp();

// Start server
const server = startServer(app, process.env.PORT || 3000);

// Optional: Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});
