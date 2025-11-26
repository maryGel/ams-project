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
  'https://ams-project-sandy.vercel.app/', 
  'https://ams-project-sandy.vercel.app',
  'http://localhost:5173' 
];

const corsOptions = {
  origin: allowedOrigins, // <--- Use array directly
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Database configuration with better error handling
export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  
  // SSL configuration for TiDB Cloud
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection with better logging
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.log('🔧 Current DB Configuration:');
    console.log('- Host:', process.env.DB_HOST || 'not set');
    console.log('- User:', process.env.DB_USER || 'not set');
    console.log('- Database:', process.env.DB_NAME || 'not set');
    console.log('- Port:', process.env.DB_PORT || 'not set');
  } else {
    console.log('✅ Successfully connected to TiDB Cloud database');
    console.log('📊 Connected to database:', process.env.DB_NAME);
    connection.release();
  }
});

const app = express();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is up and running!',
    database: process.env.DB_NAME ? 'Configured' : 'Not configured'
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
        error: err.message 
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      database: process.env.DB_NAME,
      timestamp: new Date().toISOString()
    });
  });
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});