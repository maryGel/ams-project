// routes/jo_appRoute.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * Approve a Disposal - Simplified for single-level approval
 */
router.put('/approve/:AD_No', (req, res) => {
  const { AD_No } = req.params;
  const { approved_by, remarks, userInfo } = req.body;

  // console.log('Approval request:', { AD_No, approved_by, remarks });

  const decodedJONo = decodeURIComponent(AD_No);
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

      // 1. Update ad_h table
      const updateAdHSql = `
        UPDATE ad_h 
        SET xpost = ?, 
            appStat = ?, 
            approved_by = ?
        WHERE AD_No = ?
      `;
      
      connection.query(updateAdHSql, [1, 1, approved_by || '', cleanDocNo], (error, adHResult) => {
        if (error) {
          console.error('Error updating ad_h:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update JO header'
            });
          });
        }

        if (adHResult.affectedRows === 0) {
          return connection.rollback(() => {
            connection.release();
            return res.status(404).json({
              success: false,
              error: 'JO header not found'
            });
          });
        }

        // 2. Update ad_d table
        const updateAdDSql = `UPDATE ad_d SET xpost = ? WHERE AD_No = ?`;
        
        connection.query(updateAdDSql, [1, cleanDocNo], (error, joDResult) => {
          if (error) {
            console.error('Error updating ad_d:', error);
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
          
          connection.query(insertLogSql, [cleanDocNo, 'Disposal', xUser, appLevel, status, remarks || ''], (error) => {
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
                message: 'Disposal approved successfully',
                data: {
                  jo_h_updated: adHResult.affectedRows,
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
 * Reject a Disposal
 */
router.put('/reject/:AD_No', (req, res) => {
  const { AD_No } = req.params;
  const { approved_by, remarks, userInfo } = req.body;

  console.log('Rejection request:', { AD_No, approved_by, remarks });


  const decodedJONo = decodeURIComponent(AD_No);
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

      // Update ad_h for disapproval
      const updateAdHSql = `
        UPDATE ad_h 
        SET DISAPPROVED = ?,
            approved_by = ?
        WHERE AD_No = ?
      `;
      
      connection.query(updateAdHSql, [1, approved_by|| '', cleanDocNo], (error, adHResult) => {
        if (error) {
          console.error('Error updating ad_h:', error);
          return connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              success: false,
              error: 'Failed to update JO header'
            });
          });
        }

        if (adHResult.affectedRows === 0) {
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
        
        connection.query(insertLogSql, [cleanDocNo, 'Disposal', xUser, appLevel, 'Disapproved', remarks || ''], (error) => {
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
              message: 'Disposal rejected successfully',
              data: {
                jo_h_updated: adHResult.affectedRows,
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