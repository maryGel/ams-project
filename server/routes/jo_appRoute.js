// routes/jo_appRoute.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * Approve a Job Order - Simplified for single-level approval
 */
router.put('/approve/:JO_No', (req, res) => {
  const { JO_No } = req.params;
  const { approved_by, remarks, userInfo } = req.body;

  // console.log('Approval request:', { JO_No, approved_by, remarks });

  const decodedJONo = decodeURIComponent(JO_No);
  const cleanJONo = decodedJONo
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database connection error'
      });
    }

    // Begin transaction
    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        console.error('Transaction begin error:', transactionErr);
        return res.status(500).json({
          success: false,
          error: 'Failed to start transaction'
        });
      }

      // 1. Update jo_h table
      const updateJoHSql = `
        UPDATE jo_h 
        SET xpost = ?, 
            appStat = ?, 
            approved_by = ?
        WHERE JO_No = ?
      `;
      
      connection.query(updateJoHSql, [1, 1, approved_by || '', cleanJONo], (error, joHResult) => {
        if (error) {
          console.error('Error updating jo_h:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update JO header'
            });
          });
        }

        if (joHResult.affectedRows === 0) {
          return connection.rollback(() => {
            connection.release();
            return res.status(404).json({
              success: false,
              error: 'JO header not found'
            });
          });
        }

        // 2. Update jo_d table
        const updateJoDSql = `UPDATE jo_d SET xpost = ? WHERE JO_No = ?`;
        
        connection.query(updateJoDSql, [1, cleanJONo], (error, joDResult) => {
          if (error) {
            console.error('Error updating jo_d:', error);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({
                success: false,
                error: 'Failed to update JO details'
              });
            });
          }

          // 3. Create approval log
          const insertLogSql = `
            INSERT INTO approval_logs 
            (TRNO, Module, X_USER, DT, APP_LEVEL, STAT, REMARKS) 
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
          `;
          
          // Get user display name
          const xUser = userInfo ? `${userInfo.user} - ${userInfo.fname}, ${userInfo.lname}` : String(approved_by);
          const appLevel = 1;
          const status = 'Approved';
          
          connection.query(insertLogSql, [cleanJONo, 'Job Order', xUser, appLevel, status, remarks || ''], (error) => {
            if (error) {
              console.error('Error creating approval log:', error);
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({
                  success: false,
                  error: 'Failed to create approval log'
                });
              });
            }

            // Commit transaction
            connection.commit((commitErr) => {
              if (commitErr) {
                console.error('Commit error:', commitErr);
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({
                    success: false,
                    error: 'Failed to commit transaction'
                  });
                });
              }

              connection.release();
              res.json({
                success: true,
                message: 'Job Order approved successfully',
                data: {
                  jo_h_updated: joHResult.affectedRows,
                  jo_d_updated: joDResult.affectedRows,
                  status: 'Approved'
                }
              });
            });
          });
        });
      });
    });
  });
});

/**
 * Reject a Job Order
 */
router.put('/reject/:JO_No', (req, res) => {
  const { JO_No } = req.params;
  const { approved_by, remarks, userInfo } = req.body;

  console.log('Rejection request:', { JO_No, approved_by, remarks });


  const decodedJONo = decodeURIComponent(JO_No);
  const cleanJONo = decodedJONo
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database connection error'
      });
    }

    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        connection.release();
        return res.status(500).json({
          success: false,
          error: 'Failed to start transaction'
        });
      }

      // Update jo_h for disapproval
      const updateJoHSql = `
        UPDATE jo_h 
        SET DISAPPROVED = ?,
            approved_by = ?
        WHERE JO_No = ?
      `;
      
      connection.query(updateJoHSql, [1, approved_by|| '', cleanJONo], (error, joHResult) => {
        if (error) {
          console.error('Error updating jo_h:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update JO header'
            });
          });
        }

        if (joHResult.affectedRows === 0) {
          return connection.rollback(() => {
            connection.release();
            return res.status(404).json({
              success: false,
              error: 'JO header not found'
            });
          });
        }

        // Create disapproval log
        const insertLogSql = `
          INSERT INTO approval_logs 
          (TRNO, Module, X_USER, DT, APP_LEVEL, STAT, REMARKS) 
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
        `;
        
        const xUser = userInfo ? `${userInfo.user} - ${userInfo.fname}, ${userInfo.lname}` : String(approved_by);
        const appLevel = 1;
        
        connection.query(insertLogSql, [cleanJONo, 'Job Order', xUser, appLevel, 'Disapproved', remarks || ''], (error) => {
          if (error) {
            console.error('Error creating disapproval log:', error);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({
                success: false,
                error: 'Failed to create disapproval log'
              });
            });
          }

          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Commit error:', commitErr);
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({
                  success: false,
                  error: 'Failed to commit transaction'
                });
              });
            }

            connection.release();
            res.json({
              success: true,
              message: 'Job Order rejected successfully',
              data: {
                jo_h_updated: joHResult.affectedRows,
                status: 'Disapproved'
              }
            });
          });
        });
      });
    });
  });
});

/**
 * Get approval logs for a specific JO_No
 */
router.get('/logs/:JO_No', (req, res) => {
  const { JO_No } = req.params;

  const decodedJONo = decodeURIComponent(JO_No);
  const cleanJONo = decodedJONo
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Database connection error'
      });
    }

    const sql = `
      SELECT * FROM approval_logs 
      WHERE TRNO = ? AND Module = 'Job Order'
      ORDER BY DT DESC
    `;
    
    connection.query(sql, [cleanJONo], (error, results) => {
      connection.release();
      
      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }
      
      res.json({
        success: true,
        data: results
      });
    });
  });
});

/**
 * Test endpoint
 */
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Approval route is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;