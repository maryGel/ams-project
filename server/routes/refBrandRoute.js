import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// Test endpoint - verify the route is working
router.get('/test', (req, res) => {
  res.json({
    message: 'refBrand API is working',
    timestamp: new Date().toISOString()
  });
});


// GET all brands
router.get('/', ( req, res ) => {
  console.log('GET /refBrand - Fetching all brands');  

  db.getConnection((err, connection) => {

    if (err) {
      console.log('Error gettig from pool:' + err.stack)
      return res.status(500).json({error: 'Database connection error'});
    }
    
    const sqlSelect = 'SELECT * FROM refBrand';
    
    connection.query(sqlSelect, (error, results) => {
      connection.release(); // release connection back to pool

      if(error) {
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'});
      }
      console.log(`Found ${results.length} brands`);
      res.json(results);
    })
  })
})

// Get single brand ID

router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log( `GET/refBrand/${id} - Fetching brand`)

  db.getConnection((error, connection) => {
    if(err) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('SELECT * FROM refbrand WHERE id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error', error)
        return res.status(500).json({error: 'Database query failed'});
      }
      if(result.length === 0){
        return res.status(404).json({error: 'Brand not found'})
      }

      res.json(result[0]);
    });
  });
});


// Post create new Brand

router.post('/',(req,res) => {
  const { BrandID, BrandName } = req.body;
  console.log('POST/refBrand - Creating brand', {BrandID, BrandName})

  if(!BrandName){
    return res.status(400).json({error: 'Brand name is required'})
  }

  db.getConnection((error, connection) => {
    if (error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    const sql = 'INSERT INTO refbrand (BrandID, BrandName) VALUES (?,?)';
    const params = [BrandID, BrandName || '']

    connection.query(sql, params, (error, result) => {
      connection.release();

      if (error){
        console.error('Database query error:', error);
        return res.status(500).json({error: 'Database query failed', details: error.message, sql: sql});
      }

      res.json({
        message: 'New Brand has been successfully created',
        id: result.insertId,
        BrandID: BrandID,
        BrandName: BrandName || ''
      });
    });
  });
});


// PUT update Brand
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { BrandID, BrandName } = req.body;
  console.log(`PUT/api/refBrand/${id} - Creating brand`, {BrandID, BrandName})

  if(!BrandName){
    return res.status(400).json({error: 'Brand name is required'})
  }

  db.getConnection((error, connection) => {

    if(error){
      return res.status(500).json({error: ' Database connection failed'});
    }

    const sql = 'UPDATE refbrand SET BrandID = ?, BrandName = ? where id = ?';
    const params = [BrandID, BrandName || '', id];

    connection.query(sql, params, (error, result) => {
      connection.release();

      if(error) {
        console.error('Database query error:' , error);
        return res.status(500).json({error: 'Database query failed'});
      }
  
      if(result.affectedRows === 0 ){
        return res.status(404).json({error: 'Brand not found'});
      }

      res.json({message : 'Brand updates has been successfully'});
    });
  });
});

//Delete brand

router.delete('/:id', (req,res) => {
  const { id } = req.params;
  console.log(`DELETE /api/refBrand/${id} - Deleting brand`);

  db.getConnection((error, connection) => {
    if(error) {
      return res.status(500).json({error: 'Database connection failed'});
    }

    connection.query('Delete from refbrand where id = ?', [id], (error, result) => {
      connection.release();

      if(error){
        console.error('Database query error:', error);
        return res.status(500).json({error: 'Database query failed'});
      }

      if(result.affectedRows === 0){
        return res.status(404).json({ error: 'Brand not found'});
      }

      res.json({message: 'Brand has been deleted successfully'});
    });
  });
});

export default router;