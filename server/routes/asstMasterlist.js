import express from 'express';
import { db } from '../server.js';

const router = express.Router();

router.get('/assetMasterlist', (req, res) => {

  const sqlSelect = 'SELECT * FROM itemlist';
    
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error:'Database connection error'});
    }

    connection.query(sqlSelect, (error,results, fields) => {
      connection.release(); // release connection back to pool

      if (error){
        console.error('Error executing query:' + error.stack);
        return res.status(500).json({error: 'Error fetching the data'});
      }

      res.json(results);
    })
  })
})

export default router;