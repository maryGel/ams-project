  import express from 'express';
  import {db} from '../server.js';

  const router = express.Router();

  // Get JO work order
  router.get('/', (req, res) => {
    
    db.getConnection((err, connection) => {
        if (err) {
        return res.status(500).json({error: 'Database connection error'});
        }

        const sql = 'SELECT * FROM jo_woe';

        connection.query(sql, (err, results) => {
          connection.release();
            if(err){
                return res.status(500).json({err: 'Error fetching the data'})
            }
            res.json(results);
        });
    });
  });


  // Get single jo_woe 
  router.get('/:workNo', (req, res) => {
    const {workNo} = req.params;

    const decodedJONo = decodeURIComponent(workNo);
    const cleanJONo = decodedJONo
      .replace(/\u00A0/g, '') // Remove NBSP
      .replace(/\s/g, '') // Remove normal whitespace
      .toUpperCase();

    db.getConnection((err, connection) => {
      if(err){
        return res.status(500).json({err: 'Database connection failed jo_woe'})
      }

      const sql = 'SELECT * FROM jo_woe WHERE workNo = ?';

      connection.query(sql, [cleanJONo], (error, result)=>{
        connection.release();

        if(error){
          return res.status(500).json({error: 'Database query failed jo_woe'})
        }

        if(result.length === 0){
          return res.status(404).json({error: 'JO header not found'})
        }

        res.json(result[0]);
      });
    });
  });

  export default router;

  //Update the JO workOrder xpost