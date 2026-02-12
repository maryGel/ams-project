import express from 'express';
import { db } from '../db.js';
import bcrypt from 'bcrypt';


import { requireAuth, requireAdmin } from'../middleware/auth.js';

const router = express.Router();


// .... Gell all Users , Pagination + Search ....
router.get('/', requireAuth, requireAdmin, (req, res) => {

  const q = (req.query.q || '').trim();
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1); //TODO: apply pagination to the mdoules
  const parsed = parseInt(req.query.limit, 10);
  const limit = Math.min(Math.max(parsed || 20, 1), 100);
  const offset = (page - 1) * limit;

  const where = q ? ` WHERE user LIKE ? OR fname LIKE ? OR lname LIKE ? OR xDept LIKE ?` : '';
  const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`] : [];

  const sql = `
    SELECT 
      user,
      fname,
      mname,
      lname,
      xPosi,
      xDept,
      Admin,
      Log, 
      xLevel,
      Approver,
      xSection,
      MULTI_DEPT,
      MULTI_APP
    FROM user0000inv  
    ${where}
    LIMIT ? OFFSET ?
  `;

  const countSql = `SELECT COUNT(*) as total FROM user0000inv  ${where}`;

  db.getConnection((err, connection) => {

    if (err) return res.status(500).json({error:'Database connection error'});

    connection.query(countSql, params, (countErr, countRows) => {
      if(countErr){
        connection.release();
        return res.status(500).json({error: 'Error counting users'});
      }
      
      const total = countRows[0].total;

      connection.query(sql, [...params, limit, offset], (error, results) => {
        connection.release(); 

        if(error) {
          console.error('Error executing query:' + error.stack);
          return res.status(500).json({error: 'Error fetching the data'});
        }
      res.json({results, total: countRows[0].total});
      });
    });
  });
});

// .... Get single user by username ....
router.get('/:user', (req, res) => {
  const sql = `
    SELECT 
      user,
      fname,
      mname,
      lname,
      xPosi,
      xDept,
      Admin,
      Log, 
      xLevel,
      Approver,
      xSection,
      MULTI_DEPT,
      MULTI_APP          
    FROM user0000inv  

    WHERE user = ?  
  `
  db.getConnection ((err, connection) => {

    if(err) {
      console.error('Error getting connection from pool:' + err.stack);
      return res.status(500).json({error:'Database connection error'});
    };

    connection.query(sql, [req.params.user], (err, results) => {
      connection.release();

      if (err) return res.status(500).json({error: 'Error fetching user'});
      if (!results.length) return res.status(404).json({error: 'User not found'});

      res.json(results[0]);
    });
  });
});


// .... Create new user ....
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const {
    user, password, fname, mname, lname, xPosi, xDept,
    Admin, Log, xLevel, Approver, xSection,
    MULTI_DEPT, MULTI_APP
  } = req.body;

  if (!user || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);

  const checkSql = 'SELECT user FROM user0000inv WHERE user = ?';
  const insertSql = `
    INSERT INTO user0000inv 
    (user, password, fname, mname, lname, xPosi, xDept, Admin, Log, xLevel, Approver, xSection, MULTI_DEPT, MULTI_APP) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [user, passwordHash, fname, mname, lname, xPosi, xDept,
    Admin, Log, xLevel, Approver, xSection,
    MULTI_DEPT, MULTI_APP
  ];

  db.getConnection((err, connection) => {
    if(err) return res.status(500).json({error:'Database connection error'});

    connection.query(checkSql, [user], (checkErr, checkRows) => {
      if(checkErr) {
        connection.release();
        return res.status(500).json({error: 'Error checking existing user'});
      };
      if(checkRows.length) {
        connection.release();
        return res.status(409).json({error: 'Username already exists'});
      }

      connection.query(insertSql, params, (insertErr) => {
        connection.release();
        if(insertErr) return res.status(500).json({error: 'Error creating user'});
        res.status(201).json({message: 'User created successfully', success: true });
      });
    });
  });
});


// .... Update user ....
router.put('/:user', requireAuth, requireAdmin, async (req, res) => {
  const {
    password, fname, mname, lname, xPosi, xDept,
    Admin, Log, xLevel, Approver, xSection, MULTI_DEPT, MULTI_APP
  } = req.body;

  const fields = [
    'fname = ?',
    'mname = ?',
    'lname = ?',
    'xPosi = ?',
    'xDept = ?',
    'Admin = ?',
    'Log = ?',
    'xLevel = ?',
    'Approver = ?',
    'xSection = ?',
    'MULTI_DEPT = ?',
    'MULTI_APP = ?'
  ];

  const params = [
    fname, mname, lname, xPosi, xDept,
    Admin, Log, xLevel, Approver, xSection, MULTI_DEPT, MULTI_APP
  ];

  if (password && password.trim() !== '') {
    const passwordHash = await bcrypt.hash(password, 10);
    fields.push('password = ?');
    params.push(passwordHash);
  };

  const sql = `UPDATE user0000inv SET ${fields.join(', ')} WHERE user = ?`;
  params.push(req.params.user);

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Database connection error' });

    connection.query(sql, params, (error, results) => {
      connection.release();

      if (error) return res.status(500).json({ error: 'Error updating user' });
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User updated successfully', success: true });
    });
  }); 
});

// .... Delete user ....
router.delete('/:user', requireAuth, requireAdmin, (req, res) => {
  const sql = 'DELETE FROM user0000inv WHERE user = ?';

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Database connection error' });

    connection.query(sql, (error, result) => {
      connection.release();
      if (error) return res.status(500).json({ error: 'Error deleting user' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ success: true });
    });
  });
});

export default router;