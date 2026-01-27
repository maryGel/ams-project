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

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection error'});
    }

    const sqlSelect = 'SELECT * FROM refdepartment';

    connection.query(sqlSelect, (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    }) 
  })
})

// Get single Department id 
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.getConnection((error, connection) => {
    if(error){
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('SELECT * FROM refdepartment where id = ?', [id], (error, result) => {
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

// Post create new Department

router.post('/', (req, res) => {
  const {Department} = req.body;

  if(!Department){
    return res.status(400).json({error: 'Department is required'})
  }

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    const sql = 'INSERT INTO refdepartment (Department) VALUES (?)';
    const params = [Department || '']

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Database query failed', details: error.message, sql: sql});
      }

      res.json({
        message: 'New Department has been created',
        id: result.insertId,
        Department: Department || ''
      });
    });
  });
});


// PUT update Department
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {Department} = req.body;

  if(!Department){
    return res.status(400).json({error: 'Department is required'})
  }

  db.getConnection((error, connection) => {

    if(error){
      return res.status(500).json({error: ' Database connection failed'});
    }

    const sql = 'UPDATE refdepartment SET Department = ? where id = ?';
    const params = [Department || '', id];

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error) {
        return res.status(500).json({error: 'Database query failed'});
      }
  
      if(result.affectedRows === 0 ){
        return res.status(404).json({error: 'Department not found'});
      }

      res.json({message : 'Department updates has been successfully'});
    });
  });
});



//Delete nit

router.delete('/:id', (req,res) => {
  const { id } = req.params;

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('Delete from refdepartment where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        return res.status(500).json({error: 'Database query failed'});
      }

      if(result.affectedRows === 0){
        return res.status(404).json({ error: 'Department not found'});
      }

      res.json({message: 'Department has been deleted successfully'});
    });
  });
});

export default router;
