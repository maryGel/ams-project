import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Get all Locations
router.get('/', (req, res) => {

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection error'});
    }

    const sqlSelect = 'SELECT * FROM reflocation';

    connection.query(sqlSelect, (error, result) => {
      connection.release(); 
      if(error){
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    }) 
  })
})

// Get single Location id 
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('SELECT * FROM reflocation where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Database query failed'});
      }
      if(result.length === 0){
        return res.status(404).json({error: 'Brand not found'})
      }

      res.json(result[0]);
    });
  });
});

// Post create new Location
router.post('/', (req, res) => {
  const {LocationName} = req.body;

  if(!LocationName){
    return res.status(400).json({error: 'Location is required'})
  }

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    const sql = 'INSERT INTO reflocation (LocationName) VALUES (?)';
    const params = [LocationName || '']

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Database query failed', details: error.message, sql: sql});
      }

      res.json({
        message: 'New Location has been created',
        id: result.insertId,
        LocationName: LocationName || ''
      });
    });
  });
});


// PUT update Location
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { LocationName } = req.body;

  if(!LocationName){
    return res.status(400).json({error: 'Brand name is required'})
  }

  db.getConnection((error, connection) => {

    if(error){
      return res.status(500).json({error: ' Database connection failed'});
    }

    const sql = 'UPDATE reflocation SET LocationName = ? where id = ?';
    const params = [LocationName || '', id];

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error) {
        return res.status(500).json({error: 'Database query failed'});
      }
  
      if(result.affectedRows === 0 ){
        return res.status(404).json({error: 'Location not found'});
      }

      res.json({message : 'Location updates has been successfully'});
    });
  });
});



//Delete nit

router.delete('/:id', (req,res) => {
  const { id } = req.params;
  // console.log(`DELETE /api/reflocation/${id} - Deleting Location`);

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('Delete from refLocation where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Database query failed'});
      }

      if(result.affectedRows === 0){
        return res.status(404).json({ error: 'Location not found'});
      }

      res.json({message: 'Location has been deleted successfully'});
    });
  });
});

export default router;
