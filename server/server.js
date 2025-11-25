import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes for table
import userRouter from './routes/users.js';
import useItemlist from './routes/asstMasterlist.js';
import referentialsRoute from './routes/referentials.js';
import refCategoryRoute from './routes/refCatRoute.js';
import refBrandRoute from './routes/refBrandRoute.js';
import refUnitRoute from './routes/refUnitRoute.js';
import refItemClassRoute from './routes/refClassRoute.js';


// Express Pool
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'adminGel',
    database: 'ams1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

const app = express();

// to hande localhost:3000
app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

//   Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/login', userRouter);
app.use('/itemlist', useItemlist);
app.use('/referentials', referentialsRoute);
app.use('/api/refCat', refCategoryRoute );
app.use('/refBrand', refBrandRoute);
app.use('/api/refUnit', refUnitRoute);
app.use('/refItemClass', refItemClassRoute)

app.listen(3000, () => {
    console.log('Server is running on 3000');
});