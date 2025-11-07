import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes for table
import userRouter from './routes/users.js';
import useItemlist from './routes/asstMasterlist.js';
import referentialsRoute from './routes/referentials.js';


// Express Pool
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'adminGel',
    database: 'ams1',
})

const app = express();

// to hande localhost:3000
// server.js (Cleaned up)
app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/login', userRouter);
app.use('/itemlist', useItemlist);
app.use('/referentials', referentialsRoute);

app.listen(3000, () => {
    console.log('Server is running on 3000');
});