# Drone Survey Management System Backend

A scalable enterprise platform for managing drone surveys, missions, and organizations.

## Features

- **Organization Management**: Create and manage multiple organizations
- **Drone Fleet Management**: Track drone status, battery levels, and maintenance
- **Mission Planning**: Schedule one-time and recurring survey missions
- **Real-time Updates**: Socket.IO integration for live mission status updates
- **Advanced Filtering**: Complex queries for drones and missions
- **Geospatial Support**: Location-based tracking and mission planning

## Architecture

### Backend Stack
- Node.js + Express.js for REST API
- MongoDB for data persistence
- Socket.IO for real-time updates
- Node-cron for mission scheduling

### Project Structure
```
├── src/
│   ├── config/        # App configuration
│   ├── controllers/   # Route handlers
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
├── tests/
│   ├── integration/   # Integration tests
│   └── unit/         # Unit tests
└── server.js         # Application entry point
```

## Setup Instructions

1. **Prerequisites**
   ```bash
   - Node.js >= 20.0.0
   - MongoDB
   ```

2. **Environment Setup**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd drone-survey-management-system

   # Install dependencies
   npm install

   # Create .env file
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations` - List organizations
- `GET /api/organizations/:id` - Get organization details
- `GET /api/organizations/statistics/:organizationId` - Get organization statistics

### Drones
- `POST /api/drones` - Register new drone
- `GET /api/drones` - List drones
- `PATCH /api/drones/:id/status` - Update drone status
- `DELETE /api/drones/:id` - Remove drone

### Missions
- `POST /api/missions` - Create mission
- `GET /api/missions` - List missions
- `PATCH /api/missions/:id/status` - Update mission status

## Design Decisions

1. **Microservices-Ready Architecture**
   - Modular design allows easy separation into microservices
   - Clear separation of concerns between controllers, services, and models

2. **Real-time Updates**
   - Socket.IO integration for instant mission status updates
   - Event-driven architecture for mission scheduling

3. **Geospatial Support**
   - MongoDB's geospatial indexes for location-based queries
   - Efficient drone and mission location tracking

4. **Scalability Considerations**
   - Pagination implemented for large datasets
   - Efficient database indexing
   - Stateless API design

## Development Tools & AI Integration

1. **GitHub Copilot**
   - Assisted in code generation and documentation
   - Improved development speed and code quality
   - Helped maintain consistent coding patterns

2. **ChatGPT**
   - Code optimization and refactoring
   - Best practices recommendations
   - API design discussions
   - Performance optimization suggestions

3. **Development Tools**
   - ESLint for code quality
   - Nodemon for development
   - Express-validator for input validation


