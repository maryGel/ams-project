import express from 'express';
import { db } from '../server.js';

const router = express.Router();

// --------- REFBRAND ----------

export default router.get('/refBrand', (req, res) => {

  const sqlSelect = 'SELECT * FROM refbrand';

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getiing connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error,result, fields) => {
      connection.release(); //release connection back to pool

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'});
      }

      res.json(result);
    })
  })
})


// --------- REFCATEGORY ----------

// // Update this line in your backend
// router.all('/api/referentials/refCategory/:id?', (req, res) => {
//   const { method, params: { id }, body: { name } } = req;

//   if ((method === 'POST' || method === 'PUT') && !name) {
//     return res.status(400).json({ error: 'Name is required' });
//   }

//   const queries = {
//     GET: { 
//       sql: id ? 'SELECT * FROM refcategory WHERE id = ?' : 'SELECT * FROM refcategory', 
//       params: id ? [id] : [] 
//     },
//     POST: { 
//       sql: 'INSERT INTO refcategory (name) VALUES (?)', 
//       params: [name] 
//     },
//     PUT: { 
//       sql: 'UPDATE refcategory SET name = ? WHERE id = ?', 
//       params: [name, id] 
//     },
//     DELETE: { 
//       sql: 'DELETE FROM refcategory WHERE id = ?', 
//       params: [id] 
//     }
//   };

//   const query = queries[method];
//   if (!query) return res.status(405).json({ error: 'Method not allowed' });

//   db.getConnection((err, connection) => {
//     if (err) {
//       console.error('Database connection error:', err);
//       return res.status(500).json({ error: 'Database connection error' });
//     }
    
//     connection.query(query.sql, query.params, (error, result) => {
//       connection.release();
//       if (error) {
//         console.error('Database query error:', error);
//         return res.status(500).json({ error: 'Database query error', details: error.message });
//       }

//       const responses = {
//         GET: () => res.json(result),
//         POST: () => res.json({ message: 'refCategory created', id: result.insertId }),
//         PUT: () => result.affectedRows ? res.json({ message: 'refCategory updated' }) : res.status(404).json({ error: 'refCategory not found' }),
//         DELETE: () => result.affectedRows ? res.json({ message: 'refCategory deleted' }) : res.status(404).json({ error: 'refCategory not found' })
//       };

//       responses[method]();
//     });
//   });
// });


// --------- REFDEPARTMETNT ----------

router.get('/refDepartment', (req, res) => {

  const sqlSelect = 'SELECT * FROM refdepartment';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})



// --------- REFEMPLOYEE ----------

router.get('/refEmployee', (req, res) => {

  const sqlSelect = 'SELECT * FROM refemployee';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})

// --------- REFITEMCLASS ----------

router.get('/refItemClass', (req, res) => {

  const sqlSelect = 'SELECT * FROM refItemClass';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})


// --------- REFSTATUS ----------

router.get('/refStatus', (req, res) => {

  const sqlSelect = 'SELECT * FROM refstatus';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})

// --------- REFLOCATION ----------

router.get('/refStatus', (req, res) => {

  const sqlSelect = 'SELECT * FROM reflocation';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})

// --------- REFSUPPLIER ----------

router.get('/refSupplier', (req, res) => {

  const sqlSelect = 'SELECT * FROM refsupplier';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})

// --------- REFUNIT ----------

router.get('/refUnit', (req, res) => {

  const sqlSelect = 'SELECT * FROM refunit';

  db.getConnection((err, connection) => {
    if (err) {
      console.log('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error: 'Database connection error'});
    }

    connection.query(sqlSelect, (error, result, fields) => {
      connection.release();

      if(error){
        console.error('Error executing query:' + error.stack)
        return res.status(500).json({error: 'Error fetching the data'})
      }
      res.json(result);
    });
  })
})