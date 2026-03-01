  import express from 'express';
  import {db} from '../server.js';

  const router = express.Router();

  // Get all ad_d
  router.get('/', (req, res) => {
    
    db.getConnection((err, connection) => {
        if (err) {
        return res.status(500).json({error: 'Database connection error'});
        }

        const sql = 'SELECT * FROM ad_d';

        connection.query(sql, (err, results) => {
          connection.release();
            if(err){
                return res.status(500).json({err: 'Error fetching the data: ad_d'})
            }
            res.json(results);
        });
    });
  });


  // Get single ad_d
  router.get('/:AD_No', (req, res) => {
    const {TRNO} = req.params;

    const decodedAD_No = decodeURIComponent(TRNO);
    const cleanAD_No = decodedAD_No
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/\s/g, '') // Remove normal whitespace
      .toUpperCase();

    db.getConnection((err, connection) => {
      if(err){
        return res.status(500).json({err: 'Database connection failed ad_d'})
      }

      const sql = 'SELECT * FROM ad_d WHERE AD_No = ?';

      connection.query(sql, [cleanJONo], (error, result)=>{
        connection.release();

        if(error){
          return res.status(500).json({error: 'Database query failed ad_d'})
        }

        if(result.length === 0){
          return res.status(404).json({error: 'ad_d not found'})
        }

        res.json(result[0]);
      });
    });
  });

  export default router;

 