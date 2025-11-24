import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Test endpoint - verify the route is working
router.get('/test', (req, res) => {
  res.json({
    message: 'refUnit API is working',
    timestamp: new Date().toISOString()
  })
})

// Get all Units
router.get('/', (req, res) => {
  console.log('Get api/refUnit = Fetching all units')

  db.getConnection((error, connection) => {
    if(error){
      console.log('Error getting units from pool:' + error.stack)
      return res.status(500).json({error: 'Database connection error'});
    }

    const sqlSelect = 'SELECT * FROM refUnit';

    connection.query(sqlSelect, (error, result) => {
      connection.release(); //release connecition back to pool

      if(error){
        console.error('Error executing query' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      console.log(`Found ${result.length} units`)
      res.json(result);
    }) 
  })
})

// Get single unit id 
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET/api/refUnit/${id} - Fetching Unit`)

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('SELECT * FROM refunit where id = ?', [id], (error, result) => {
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

// Post create new Unit

router.post('/', (req, res) => {
  const {Unit} = req.body;
  console.log('POST/api/refUnit - Creating Unit', {Unit})

  if(!Unit){
    return res.status(400).json({error: 'Unit is required'})
  }

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    const sql = 'INSERT INTO refunit (Unit) VALUES (?)';
    const params = [Unit || '']

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error:', error);
        return res.status(500).json({error: 'Database query failed', details: error.message, sql: sql});
      }

      res.json({
        message: 'New unit has been created',
        id: result.insertId,
        Unit: Unit || ''
      });
    });
  });
});


// PUT update Unit
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { Unit } = req.body;
  console.log(`PUT/api/refBrand/${id} - Creating brand`, {Unit})

  if(!Unit){
    return res.status(400).json({error: 'Brand name is required'})
  }

  db.getConnection((error, connection) => {

    if(error){
      return res.status(500).json({error: ' Database connection failed'});
    }

    const sql = 'UPDATE refunit SET Unit = ? where id = ?';
    const params = [Unit || '', id];

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error) {
        console.error('Database query error:' , error);
        return res.status(500).json({error: 'Database query failed'});
      }
  
      if(result.affectedRows === 0 ){
        return res.status(404).json({error: 'Unit not found'});
      }

      res.json({message : 'Unit updates has been successfully'});
    });
  });
});



//Delete nit

router.delete('/:id', (req,res) => {
  const { id } = req.params;
  console.log(`DELETE /api/refUnit/${id} - Deleting unit`);

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('Delete from refunit where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error:', error);
        return res.status(500).json({error: 'Database query failed'});
      }

      if(result.affectedRows === 0){
        return res.status(404).json({ error: 'Unit not found'});
      }

      res.json({message: 'Unit has been deleted successfully'});
    });
  });
});

export default router;
