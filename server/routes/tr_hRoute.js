  import express from 'express';
  import {db} from '../server.js';

  const router = express.Router();

  // Get all tr_d
  router.get('/', (req, res) => {
    
    db.getConnection((err, connection) => {
        if (err) {
        return res.status(500).json({error: 'Database connection error'});
        }

        const sql = 'SELECT * FROM tr_h';

        connection.query(sql, (err, results) => {
          connection.release();
            if(err){
                return res.status(500).json({err: 'Error fetching the data: tr_h'})
            }
            res.json(results);
        });
    });
  });


  // Get single tr_d
  router.get(':TR_No', (req, res) => {
    const {TR_No} = req.params;

    const decodedTR_No = decodeURIComponent(TR_No);
    const cleanTR_No = decodedJONo
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/\s/g, '') // Remove normal whitespace
      .toUpperCase();

    db.getConnection((err, connection) => {
      if(err){
        return res.status(500).json({err: 'Database connection failed tr_h'})
      }

      const sql = 'SELECT * FORM tr_h WHERE TR_No = ?';

      connection.query(sql, [cleanJONo], (error, result)=>{
        connection.release();

        if(error){
          return res.status(500).json({error: 'Database query failed tr_d'})
        }

        if(result.length === 0){
          return res.status(404).json({error: 'JO header not found'})
        }

        res.json(result[0]);
      });
    });
  });
 
  export default router;
