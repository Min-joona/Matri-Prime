const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { initSocketServer } = require('./socket-server');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = initSocketServer(server);

// Enhanced Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://*.firebaseio.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ["http://localhost:3000"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting - Stricter limits for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const skipPaths = ['/health', '/api/health'];
    return skipPaths.includes(req.path);
  }
});

// Create different rate limiters for different endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many authentication attempts' }
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'API rate limit exceeded' }
});

app.use('/api/auth', authLimiter);
app.use('/api/', apiLimiter);
app.use(limiter);

// Body parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// Compression
app.use(compression({
  level: 6, // Balance between speed and compression
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Logging
app.use(morgan('combined', {
  skip: (req) => process.env.NODE_ENV === 'test'
}));

// MongoDB Connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/matriprime', {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      retries += 1;
      console.error(`❌ MongoDB connection error (attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries < maxRetries) {
        console.log(`🔄 Retrying connection in 5 seconds...`);
        setTimeout(connect, 5000);
      } else {
        console.error('❌ Max retries exceeded. Cannot connect to MongoDB.');
        process.exit(1);
      }
    }
  };

  await connect();
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/socket', require('./routes/socket'));

// AI Study Companion Route - stub if not implemented
try {
  app.use('/api/ai', require('./routes/ai-companion'));
} catch (err) {
  const stubRouter = express.Router();
  stubRouter.all('*', (req, res) => {
    res.status(501).json({ error: 'AI Companion feature not yet implemented' });
  });
  app.use('/api/ai', stubRouter);
}

// Community Features Route - stub if not implemented
try {
  app.use('/api/community', require('./routes/community'));
} catch (err) {
  const stubRouter = express.Router();
  stubRouter.all('*', (req, res) => {
    res.status(501).json({ error: 'Community feature not yet implemented' });
  });
  app.use('/api/community', stubRouter);
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Security: Prevent information disclosure
app.disable('x-powered-by');

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't leak error details in production
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? err.message 
    : 'Something went wrong on our end. Please try again later.';
    
  res.status(err.status || 500).json({ 
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Socket.io ready on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };
