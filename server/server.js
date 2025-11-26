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

// Database configuration - MySQL runs on port 3306
export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'adminGel',
  database: 'ams1',
  port: 3306, // This is the MySQL database port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  // Remove SSL for local MySQL
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('🔧 Current DB Configuration:');
    console.log('- Database Host: localhost:3306');
    console.log('- Database User: root');
    console.log('- Database Name: ams1');
    console.log('💡 Check if MySQL is running and database exists');
  } else {
    console.log('✅ Successfully connected to local MySQL database');
    console.log('📊 Connected to database: ams1 (on port 3306)');
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

// Middleware to attach database to request and log requests
app.use((req, res, next) => {
  req.db = db;
  console.log(`📍 ${req.method} ${req.path} from: ${req.headers.origin || 'unknown origin'}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is up and running!',
    server: 'Local Development Server',
    application: 'Running on port 3000',
    database: 'Connected to MySQL on port 3306',
    environment: 'development',
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
        server: 'Local Development Server (port 3000)',
        database: 'MySQL (port 3306)'
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      application: 'Express server running on port 3000',
      database: 'MySQL database on port 3306',
      server: 'Local Development Server',
      environment: 'development',
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

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    server: 'Local Development Server (port 3000)'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy blocked this request',
      allowedOrigins: allowedOrigins,
      server: 'Local Development Server (port 3000)'
    });
  }
  
  console.error('Global error handler:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    server: 'Local Development Server (port 3000)'
  });
});

// Application PORT - Your Express server runs on this port
const PORT = 3000;
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log(`🚀 Express Server is running on port ${PORT}`);
  console.log(`🗄️  MySQL Database is on port 3306`);
  console.log(`🌐 Environment: development`);
  console.log(`📊 Database: ams1`);
  console.log(`✅ CORS enabled for:`, allowedOrigins);
  console.log(`🔗 Application URL: http://localhost:${PORT}`);
  console.log(`🔗 Database URL: localhost:3306`);
  console.log('='.repeat(60));
});