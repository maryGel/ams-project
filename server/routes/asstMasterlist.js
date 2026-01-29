import express from 'express';
import { db } from '../server.js';

const router = express.Router();

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
    Holder,
    Adate,
    AAmount,
    Percent,
    Abre,
    ItemLocation,
    balance_unit,
    suppName,

    // OPTIONAL
    Brand,
    Color,
    StartDate,
    EndDate,
    ReferenceNo,
    Remarks,
    splitAsset
  } = req.body;

  // REQUIRED FIELD CHECK
  const requiredFields = {
    FacNO,
    FacName,
    Description,
    CATEGORY,
    Unit,
    serialNo,
    Department,
    Holder,
    Adate,
    AAmount,
    Percent,
    ItemLocation,
    balance_unit,
    suppName
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
      Department, Holder, Adate, AAmount, Percent, Abre, ItemLocation,
      balance_unit, suppName, Brand, Color, StartDate, EndDate,
      ReferenceNo, Remarks, xStatus, Picpath, splitAsset
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
    'ACTIVE',
    null,
    splitAsset ?? 0
  ];

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({ error: 'Database connection error' });
    }

    connection.query(sqlInsert, values, (error, results) => {
      connection.release();

      if (error) {
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


router.put('/updateAsset/:id', (req, res) => {

  const { id } = req.params;

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
    splitAsset
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Asset ID is required' });
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
      Remarks = ?,
      splitAsset = ?
    WHERE id = ?
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
    splitAsset ?? 0,
    id
  ];

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