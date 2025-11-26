import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes for table
// import userRouter from './routes/users.js';
import useItemlist from './routes/asstMasterlist.js';
import referentialsRoute from './routes/referentials.js';
import refCategoryRoute from './routes/refCatRoute.js';
import refBrandRoute from './routes/refBrandRoute.js';
import refUnitRoute from './routes/refUnitRoute.js';
import refItemClassRoute from './routes/refClassRoute.js';
import refLocationRoute from './routes/refLocationRoute.js'
import refDeptRoute from './routes/refDeptRoute.js';
import authRoute from './routes/authRoute.js'

// Configure CORS
const allowedOrigins = [
  'https://ams-project-phi.vercel.app', // <-- Replace with your Vercel domain!
  'http://localhost:5173' // for local development if needed
];
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  // You may need to specify methods and headers if you use custom ones
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};


// Use environment variables if available, fallback to local development
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'adminGel',
  database: process.env.DB_NAME || 'ams1',
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  // CRUCIAL: Enable SSL/TLS for TiDB Cloud
  ssl: {
    rejectUnauthorized: false, // or false, depending on driver setup
    // You typically don't need a CA cert download for TiDB Starter
  },
});


const app = express();

// to hande localhost:3000
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

//   Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/login', authRoute);
app.use('/itemlist', useItemlist);
app.use('/referentials', referentialsRoute);
app.use('/api/refCat', refCategoryRoute );
app.use('/refBrand', refBrandRoute);
app.use('/api/refUnit', refUnitRoute);
app.use('/refItemClass', refItemClassRoute);
app.use('/refLocation', refLocationRoute);
app.use('/refDepartment', refDeptRoute);


// In your server.js (at the very end)
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});