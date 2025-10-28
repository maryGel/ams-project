import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRouter from './routes/users.js';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'adminGel',
    database: 'AMSDataBase',
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

// to route /api/
app.use('/login', userRouter);

app.listen(3000, () => {
    console.log('Server is running on 3000');
});