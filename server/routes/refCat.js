// routes/refCat.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Test endpoint - verify the route is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'RefCategory API is working!',
    timestamp: new Date().toISOString()
  });
});

// GET all categories
router.get('/', (req, res) => {
  console.log('GET /api/refCat - Fetching all categories');
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('SELECT * FROM refcategory', (error, results) => {
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

// GET single category by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/refCat/${id} - Fetching category`);
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('SELECT * FROM refcategory WHERE id = ?', [id], (error, results) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(results[0]);
    });
  });
});

// POST create new category
router.post('/', (req, res) => {
  const { category, xCode } = req.body;
  console.log('POST /api/refCat - Creating category:', {category, xCode});
  
  if (!category) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const sql = 'INSERT INTO refcategory (category, xCode) VALUES (?, ?)';
    const params = [category, xCode || ''];
    
    connection.query(sql, params, (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed', details: error.message, sql: sql });
      }
      
      res.json({ 
        message: 'Category created successfully', 
        id: result.insertId,
        category: category,
        xCode: xCode || ''
      });
    });
  });
});

// PUT update category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { category, xCode } = req.body;
  console.log(`PUT /api/refCat/${id} - Updating category to:`, {category, xCode});
  
  if (!category) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const sql = 'UPDATE refcategory SET category = ?, xCode = ? WHERE id = ?';
    const params = [category, xCode || '', id];    
    
    connection.query(sql, params, (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({ message: 'Category updated successfully' });
    });
  });
});

// DELETE category
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/refCat/${id} - Deleting category`);
  
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    connection.query('DELETE FROM refcategory WHERE id = ?', [id], (error, result) => {
      connection.release();
      
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Database query failed' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json({ message: 'Category deleted successfully' });
    });
  });
});

export default router;