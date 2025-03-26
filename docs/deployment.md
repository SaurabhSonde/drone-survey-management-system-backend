# Deployment Guide

## Prerequisites
- Node.js >= 20.0.0
- MongoDB
- npm or yarn
- PM2 (for production)

## Environment Setup

1. Clone the repository
```bash
git clone [repository-url]
cd drone-survey-management-system
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit .env:
```
MONGODB_URI=your_mongodb_uri
PORT=4000
NODE_ENV=production
CORS_ORIGIN=your_frontend_domain
```

## Development Deployment

1. Start development server
```bash
npm run dev
```

2. Access API at http://localhost:4000



