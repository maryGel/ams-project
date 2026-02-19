import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Route imports
import useItemlist from './routes/asstMasterlist.js';
import referentialsRoute from './routes/referentials.js';
import refCategoryRoute from './routes/refCatRoute.js';
import refBrandRoute from './routes/refBrandRoute.js';
import refUnitRoute from './routes/refUnitRoute.js';
import refItemClassRoute from './routes/refClassRoute.js';
import refLocationRoute from './routes/refLocationRoute.js';
import refDeptRoute from './routes/refDeptRoute.js';
import authRoute from './routes/authRoute.js';
import usersRoute from './routes/usersRoute.js';
import accessRoute from './routes/accessRoute.js';
import colorsRoute from './routes/refColorRoute.js';
import sectionsRoute from './routes/refSecRoute.js';
import approvalRoute from './routes/refApprovalRoute.js';


const app = express();

// --- CORS CONFIGURATION ---
// Focused strictly on local development to avoid "split-brain" issues
const allowedOrigins = [ 
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Cache-Control',
    'Pragma',
    'Expires'
  ]
};

app.use(cors(corsOptions));


// --- DATABASE CONFIGURATION ---
// Hardcoded to ensure Node always talks to the same DB as SQLyog
const dbConfig = {
  host: '192.168.64.5',
  user: 'myuser101',
  password: 'MmFjbV69',
  database: 'ams1',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
};

export const db = mysql.createPool(dbConfig);

// Test database connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ VM Database connection failed:', err.message);
    console.log('🔧 Attempting to connect to:', dbConfig.host);
  } else {
    console.log('✅ Successfully connected to VM Database at 192.168.64.5');
    console.log('📊 Database Name:', dbConfig.database);
    connection.release();
  }
});

// --- MIDDLEWARE ---
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Attach database pool to every request
app.use((req, res, next) => {
  req.db = db;
  next();
});

// --- ROUTES ---

// Health check endpoint
app.get('/health', (req, res) => {
  db.query("SELECT 1 as test", (err) => {
    if (err) return res.status(500).json({ status: 'error', error: err.message });
    res.json({ status: 'ok', database: 'Connected to VM' });
  });
});

// API Routes
app.use('/login', authRoute);
app.use('/users', usersRoute);
app.use('/itemlist', useItemlist);
app.use('/referentials', referentialsRoute);
app.use('/api/refCat', refCategoryRoute);
app.use('/refBrand', refBrandRoute);
app.use('/api/refUnit', refUnitRoute);
app.use('/refItemClass', refItemClassRoute);
app.use('/refLocation', refLocationRoute);
app.use('/refDepartment', refDeptRoute);
app.use('/accessRights', accessRoute);
app.use('/colorsRoute', colorsRoute);
app.use('/secRoutes', sectionsRoute);
app.use('/approvalRoute', approvalRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Local Server running on http://localhost:${PORT}`);
  console.log(`📡 Target DB Host: 192.168.64.5`);
  console.log('='.repeat(50));
});         