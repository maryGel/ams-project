import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Test endpoint - verify the route is working
router.get('/test', (req, res) => {
  res.json({
    message: 'refDepartment API is working',
    timestamp: new Date().toISOString()
  })
})

// Get all Locations
router.get('/', (req, res) => {
  console.log('Get api/refDepartment = Fetching all Locations')

  db.getConnection((error, connection) => {
    if(error){
      console.log('Error getting Locations from pool:' + error.stack)
      return res.status(500).json({error: 'Database connection error'});
    }

    const sqlSelect = 'SELECT * FROM refDepartment';

    connection.query(sqlSelect, (error, result) => {
      connection.release(); //release connecition back to pool

      if(error){
        console.error('Error executing query' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      console.log(`Found ${result.length} Locations`)
      res.json(result);
    }) 
  })
})

// Get single Location id 
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET/refDepartment/${id} - Fetching Location`)

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('SELECT * FROM refDepartment where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        console.log('Database query error', error)
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
  const {Location} = req.body;
  console.log('POST/refDepartment - Creating Location', {Location})

  if(!Location){
    return res.status(400).json({error: 'Location is required'})
  }

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    const sql = 'INSERT INTO refDepartment (Location) VALUES (?)';
    const params = [Department || '']

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error:', error);
        return res.status(500).json({error: 'Database query failed', details: error.message, sql: sql});
      }

      res.json({
        message: 'New Location has been created',
        id: result.insertId,
        Location: Location || ''
      });
    });
  });
});


// PUT update Location
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Location } = req.body;
  console.log(`PUT/api/refDepartment/${id} - Creating brand`, {Location})

  if(!Location){
    return res.status(400).json({error: 'Brand name is required'})
  }

  db.getConnection((error, connection) => {

    if(error){
      return res.status(500).json({error: ' Database connection failed'});
    }

    const sql = 'UPDATE refDepartment SET Department = ? where id = ?';
    const params = [Department || '', id];

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error) {
        console.error('Database query error:' , error);
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
  console.log(`DELETE /api/refDepartment/${id} - Deleting Location`);

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('Delete from refDepartment where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error:', error);
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
