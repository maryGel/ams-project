// routes/jo_appRoute.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * Approve a Asset Lost - Simplified for single-level approval
 */
router.put('/approve/:AAFNo', (req, res) => {
  const { AAFNo } = req.params;
  const {  remarks, userInfo } = req.body;

  // console.log('Approval request:', { AAFNo,  remarks });

  const decodedJONo = decodeURIComponent(AAFNo);
  const cleanDocNo = decodedJONo
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

      // 1. Update assetlost table
      const updateALostHSql = `
        UPDATE assetlost 
        SET xPosted = ?, 
            appStat = ?,  
        WHERE AAFNo = ?
      `;
      
      connection.query(updateALostHSql, [1, 1,  cleanDocNo], (error, alostHResult) => {
        if (error) {
          console.error('Error updating assetlost:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update Lost header'
            });
          });
        }

        if (alostHResult.affectedRows === 0) {
          return connection.rollback(() => {
            connection.release();
            return res.status(404).json({
              success: false,
              error: 'Lost header not found'
            });
          });
        }

        // 2. Update assetlostd table
        const updateLostDSql = `UPDATE assetlostd SET xPosted = ? WHERE AAFNo = ?`;
        
        connection.query(updateLostDSql, [1, cleanDocNo], (error, accDResult) => {
          if (error) {
            console.error('Error updating assetlostd:', error);
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({
                success: false,
                error: 'Failed to update Lost details'
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
          
          connection.query(insertLogSql, [cleanDocNo, 'Asset Lost', xUser, appLevel, status, remarks || ''], (error) => {
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
                message: 'Asset Lost approved successfully',
                data: {
                  alost_h_updated: alostHResult.affectedRows,
                  alost_d_updaetd: accDResult.affectedRows,
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
 * Reject a Asset Lost
 */
router.put('/reject/:AAFNo', (req, res) => {
  const { AAFNo } = req.params;
  const {  remarks, userInfo } = req.body;

  console.log('Rejection request:', { AAFNo,  remarks });


  const decodedJONo = decodeURIComponent(AAFNo);
  const cleanDocNo = decodedJONo
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

      // Update assetlost for disapproval
      const updateALostHSql = `
        UPDATE assetlost 
        SET DISAPPROVED = ?,
            
        WHERE AAFNo = ?
      `;
      
      connection.query(updateALostHSql, [1, approved_by|| '', cleanDocNo], (error, alostHResult) => {
        if (error) {
          console.error('Error updating assetlost:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update Lost header'
            });
          });
        }

        if (alostHResult.affectedRows === 0) {
          return connection.rollback(() => {
            connection.release();
            return res.status(404).json({
              success: false,
              error: 'Lost header not found'
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
        
        connection.query(insertLogSql, [cleanDocNo, 'Asset Lost', xUser, appLevel, 'Disapproved', remarks || ''], (error) => {
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
              message: 'Asset Lost rejected successfully',
              data: {
                alost_h_updated: alostHResult.affectedRows,
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