  import express from 'express';
  import {db} from '../server.js';

  const router = express.Router();

  // Get Asset lost Details
  router.get('/', (req, res) => {
    
    db.getConnection((err, connection) => {
        if (err) {
        return res.status(500).json({error: 'Database connection error'});
        }

        const sql = 'SELECT * FROM assetlostd';

        connection.query(sql, (err, results) => {
          connection.release();
            if(err){
                return res.status(500).json({err: 'Error fetching the data'})
            }
            res.json(results);
        });
    });
  });


  // Get single assestaccd details
  router.get('/:AAFNo', (req, res) => {
    const {AAFNo} = req.params;

    const decodedAAFNo = decodeURIComponent(AAFNo);
    const cleanAAFNo = decodedAAFNo
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/\s/g, '') // Remove normal whitespace
      .toUpperCase();

    db.getConnection((err, connection) => {
      if(err){
        return res.status(500).json({err: 'Database connection failed assestaccd'})
      }

      const sql = 'SELECT * FROM assetlostd WHERE AAFNo = ?';

      connection.query(sql, [cleanAAFNo], (error, result)=>{
        connection.release();

        if(error){
          return res.status(500).json({error: 'Database query failed assestaccd'})
        }

        if(result.length === 0){
          return res.status(404).json({error: 'AAF details not found'})
        }

        res.json(result[0]);
      });
    });
  });

  export default router;

  //Update the Asset Lost Details