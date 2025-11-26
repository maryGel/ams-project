import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Your routes imports...
import useItemlist from './routes/asstMasterlist.js';
import referentialsRoute from './routes/referentials.js';
import refCategoryRoute from './routes/refCatRoute.js';
import refBrandRoute from './routes/refBrandRoute.js';
import refUnitRoute from './routes/refUnitRoute.js';
import refItemClassRoute from './routes/refClassRoute.js';
import refLocationRoute from './routes/refLocationRoute.js';
import refDeptRoute from './routes/refDeptRoute.js';
import authRoute from './routes/authRoute.js';

// Configure CORS
const allowedOrigins = [ 
  'https://ams-project-sandy.vercel.app', 
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Database configuration - Use environment variables
const getDbConfig = () => {
  // If we're in production (Render), use production DB
  if (process.env.NODE_ENV === 'production') {
    return {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 4000,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
      ssl: {
        rejectUnauthorized: false
      }
    };
  } else {
    // Local development - use local MySQL
    return {
      host: 'localhost',
      user: 'root',
      password: 'adminGel',
      database: 'ams1',
      port: 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 30000,
    };
  }
};

export const db = mysql.createPool(getDbConfig());

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('🔧 Current DB Configuration:');
    console.log('- Environment:', process.env.NODE_ENV || 'development');
    console.log('- Host:', getDbConfig().host);
    console.log('- Database:', getDbConfig().database);
    console.log('- Port:', getDbConfig().port);
  } else {
    console.log('✅ Successfully connected to database');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('📊 Database:', getDbConfig().database);
    connection.release();
  }
});

const app = express();

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// Additional CORS headers as fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Other middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to attach database to request
app.use((req, res, next) => {
  req.db = db;
  console.log(`📍 ${req.method} ${req.path} from: ${req.headers.origin || 'unknown origin'}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is up and running!',
    environment: process.env.NODE_ENV || 'development',
    database: getDbConfig().database,
    server: 'Render Production Server',
    timestamp: new Date().toISOString()
  });
});

// Database health check endpoint
app.get('/health', (req, res) => {
  db.query("SELECT 1 as test", (err, results) => {
    if (err) {
      console.error('❌ Database health check failed:', err.message);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: err.message,
        environment: process.env.NODE_ENV || 'development',
        server: 'Render Production Server'
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      environment: process.env.NODE_ENV || 'development',
      database: getDbConfig().database,
      server: 'Render Production Server',
      timestamp: new Date().toISOString()
    });
  });
});

// API routes
app.use('/login', authRoute);
app.use('/itemlist', useItemlist);
app.use('/referentials', referentialsRoute);
app.use('/api/refCat', refCategoryRoute);
app.use('/refBrand', refBrandRoute);
app.use('/api/refUnit', refUnitRoute);
app.use('/refItemClass', refItemClassRoute);
app.use('/refLocation', refLocationRoute);
app.use('/refDepartment', refDeptRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    server: 'Render Production Server'
  });
});

// Global error handling
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy blocked this request',
      allowedOrigins: allowedOrigins,
      server: 'Render Production Server'
    });
  }
  
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    server: 'Render Production Server'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${getDbConfig().database}`);
  console.log(`✅ CORS enabled for:`, allowedOrigins);
  console.log('='.repeat(60));
});