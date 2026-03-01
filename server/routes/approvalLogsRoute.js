  import express from 'express';
  import {db} from '../server.js';

  const router = express.Router();

  // Get JO Approval logs
  router.get('/', (req, res) => {
    
    db.getConnection((err, connection) => {
        if (err) {
        return res.status(500).json({error: 'Database connection error'});
        }

        const sql = 'SELECT * FROM approval_logs';

        connection.query(sql, (err, results) => {
          connection.release();
            if(err){
                return res.status(500).json({err: 'Error fetching the data: approval_logs'})
            }
            res.json(results);
        });
    });
  });


  // Get single approval logs
  router.get('/:TRNO', (req, res) => {
    const {TRNO} = req.params;

    const decodedTRNO = decodeURIComponent(TRNO);
    const cleanTRNO = decodedTRNO
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/\s/g, '') // Remove normal whitespace
      .toUpperCase();

    db.getConnection((err, connection) => {
      if(err){
        return res.status(500).json({err: 'Database connection failed jo_h'})
      }

      const sql = 'SELECT * FROM approval_logs WHERE TRNO = ?';

      connection.query(sql, [cleanJONo], (error, result)=>{
        connection.release();

        if(error){
          return res.status(500).json({error: 'Database query failed jo_h'})
        }

        if(result.length === 0){
          return res.status(404).json({error: 'appoval logs not found'})
        }

        res.json(result[0]);
      });
    });
  });

  export default router;

 