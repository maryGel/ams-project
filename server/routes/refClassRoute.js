// routes/refItemClass.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Test endpoint - verify the route is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'refItemClass API is working!',
    timestamp: new Date().toISOString()
  });
});

// GET all categories
router.get('/', (req, res) => {
  console.log('GET /refItemClass - Fetching all categories');
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('SELECT * FROM refItemclass ', (error, results) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed', details: error.message });
      }
      
      console.log(`Found ${results.length} categories`);
      res.json(results);
    });
  });
});

// GET single itemClass by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET /refItemClass/${id} - Fetching itemClass`);
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('SELECT * FROM refItemclass WHERE id = ?', [id], (error, results) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'itemClass not found' });
      }
      
      res.json(results[0]);
    });
  });
});

// POST create new itemClass
router.post('/', (req, res) => {
  const { classCode, itemClass, category } = req.body;
  console.log('POST /refItemClass - Creating itemClass:', {classCode, itemClass, category  });
  
  if (!itemClass) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const sql = 'INSERT INTO refItemclass(classCode, itemClass, category  ) VALUES (?, ?, ?)';
    const params = [classCode, itemClass, category || ''];
    
    connection.query(sql, params, (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed', details: error.message, sql: sql });
      }
      
      res.json({ 
        message: 'itemClass created successfully', 
        id: result.insertId,
        itemClass: itemClass,
        classCode: classCode || ''
      });
    });
  });
});

// PUT update itemClass
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { classCode, itemClass, category  } = req.body;
  console.log(`PUT /refItemClass/${id} - Updating itemClass to:`, {classCode, itemClass, category });
  
  if (!itemClass) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const sql = 'UPDATE refItemclass SET classCode = ?, itemClass = ?, category = ?  WHERE id = ?';
    const params = [classCode, itemClass, category || '', id];    
    
    connection.query(sql, params, (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'itemClass not found' });
      }
      
      res.json({ message: 'itemClass updates has been successfully' });
    });
  });
});

// DELETE itemClass
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /refItemClass/${id} - Deleting itemClass`);
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('DELETE FROM refItemclass WHERE id = ?', [id], (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'itemClass not found' });
      }
      
      res.json({ message: 'itemClass deleted successfully' });
    });
  });
});

export default router;