import express from 'express';
import { db } from '../server.js';

const router = express.Router();

//Get all itemlist
router.get('/assetMasterlist', (req, res) => {

  const sqlSelect = 'SELECT * FROM itemlist';
    
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error:'Database connection error'});
    }

    connection.query(sqlSelect, (error,results, fields) => {
      connection.release(); // release connection back to pool

      if (error){
        console.error('Error executing query:' + error.stack);
        return res.status(500).json({error: 'Error fetching the data'});
      }

      res.json(results);
    })
  })
})

// Get a single asset by facNo
router.get('/assetMasterlist/:facNo', (req, res) => {
  const { facNo } = req.params;
  // Decode URL parameter and clean it
  const decodedFacNo = decodeURIComponent(facNo);
  const cleanFacNo = decodedFacNo
    .replace(/\u00A0/g, '') // Remove NBSP
    .replace(/\s/g, '') // Remove normal whitespace
    .toUpperCase();
  
  
  const sqlSelect = 'SELECT * FROM itemlist WHERE REPLACE(REPLACE(UPPER(FacNO), CHAR(160), ""), " ", "") = ?';
  
  
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error:'Database connection error'});
    }

    connection.query(sqlSelect, [cleanFacNo], (error, results) => {
      connection.release();
      
      if (error){
        console.error('Error executing query:' + error.stack);
        return res.status(500).json({error: 'Error fetching the data'});
      }

      res.json(results.length > 0 ? results[0] : null);
    });
  });
});

router.post('/createAsset', (req, res) => {

  const {
    FacNO,
    FacName,
    Description,
    ItemClass,
    CATEGORY,
    Unit,
    serialNo,
    Department,
    Adate,
    ItemLocation,
    balance_unit,
    suppName,

    // OPTIONAL
    Brand,
    Color,
    ReferenceNo,
    StartDate,
    EndDate,

    // splitAsset,

    AAmount,
    Percent,
    Abre,
    Remarks,
  } = req.body;

   // ADD THIS VALIDATION
  if (!FacNO || FacNO.trim() === '') {
    return res.status(400).json({
      error: 'FacNO is required and cannot be empty'
    });
  }

  // REQUIRED FIELD CHECK
  const requiredFields = {
    FacNO,
    FacName,
    Description,
    CATEGORY,
    ItemClass,
    Unit,
    Adate,
    AAmount,
    ItemLocation,
    Department,
    ReferenceNo
  };

  for (const [key, value] of Object.entries(requiredFields)) {
    if (value === undefined || value === null || value === '') {
      return res.status(400).json({
        error: `${key} is required`
      });
    }
  }

  const sqlInsert = `
    INSERT INTO itemlist (
      FacNO, FacName, Description, ItemClass, CATEGORY, Unit, serialNo,
      Department, Adate, AAmount, Percent, Abre, ItemLocation,
      balance_unit, suppName, Brand, Color, StartDate, EndDate,
      ReferenceNo, xStatus, Picpath, Remarks
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    FacNO,
    FacName,
    Description,
    ItemClass || null,
    CATEGORY,
    Unit,
    serialNo,
    Department,
    Adate,
    AAmount,
    Percent,
    Abre || 0,
    ItemLocation,
    balance_unit,
    suppName,
    Brand || null,
    Color || null,
    StartDate || null,
    EndDate || null,
    ReferenceNo || null,
    'ACTIVE',
    null,
    // splitAsset ?? 0,
    Remarks || null,
  ];

  // console.log('SQL Insert:', sqlInsert);
  // console.log('Number of columns in SQL:', sqlInsert.match(/\(([^)]+)\)/)[1].split(',').length);
  // console.log('Number of values:', values.length);
  // console.log('Values:', values);

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(sqlInsert, values, (error, results) => {
      connection.release();

      if (error) {
        console.error('=== SQL ERROR DETAILS ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('SQL state:', error.sqlState);
        console.error('Full error:', error);
        console.error('Error executing query:' + error.stack);
        return res.status(500).json({ error: 'Error inserting asset' });
      }

      res.status(201).json({
        message: 'Asset created successfully',
        assetId: results.insertId
      });
    });
  });
});


router.put('/updateAsset/:facNo', (req, res) => {

  const { facNo } = req.params;

  const {
    FacNO,
    FacName,
    Description,
    ItemClass,
    CATEGORY,
    Unit,
    serialNo,
    Department,
    Holder,
    Adate,
    AAmount,
    Percent,
    Abre,
    ItemLocation,
    balance_unit,
    suppName,
    Brand,
    Color,
    StartDate,
    EndDate,
    ReferenceNo,
    Remarks,
    // splitAsset
  } = req.body;

  if (!facNo) {
    return res.status(400).json({ error: 'FacNO is required' });
  }

  const sqlUpdate = `
    UPDATE itemlist SET
      FacNO = ?,
      FacName = ?,
      Description = ?,
      ItemClass = ?,
      CATEGORY = ?,
      Unit = ?,
      serialNo = ?,
      Department = ?,
      Holder = ?,
      Adate = ?,
      AAmount = ?,
      Percent = ?,
      Abre = ?,
      ItemLocation = ?,
      balance_unit = ?,
      suppName = ?,
      Brand = ?,
      Color = ?,
      StartDate = ?,
      EndDate = ?,
      ReferenceNo = ?,
      Remarks = ?

    WHERE FacNO = ?
  `;

  const values = [
    FacNO,
    FacName,
    Description,
    ItemClass || null,
    CATEGORY,
    Unit,
    serialNo,
    Department,
    Holder,
    Adate,
    AAmount,
    Percent,
    Abre || 0,
    ItemLocation,
    balance_unit,
    suppName,
    Brand || null,
    Color || null,
    StartDate || null,
    EndDate || null,
    ReferenceNo || null,
    Remarks || null,
    // splitAsset ?? 0,
    facNo
  ];


  // const m = sqlUpdate.match(/\(([^)]+)\)/);
  // console.log('Number of columns in SQL:', m );
  // console.log('PUT /updateAsset', facNo);



  db.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(sqlUpdate, values, (error, results) => {
      connection.release();

      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error updating asset' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Asset not found' });
      }

      res.json({ message: 'Asset updated successfully' });
    });
  });
});


export default router;