import express from 'express';
import { db } from '../server.js';

const router = express.Router();


// --------- REFDEPARTMETNT ----------

export default router.get('/refDepartment', (req, res) => {

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