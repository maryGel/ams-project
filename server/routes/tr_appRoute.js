import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * Helper function to get approval configuration
 */
const getApprovalConfig = async (connection, module) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT APP_CODE, MODULE, APP_LEVEL, SIGNATORY 
      FROM ref_approval 
      WHERE MODULE = ? 
      ORDER BY APP_LEVEL ASC
    `;
    
    connection.query(sql, [module], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

/**
 * Helper function to get current approval status of a document
 */
const getCurrentApprovalStatus = async (connection, TR_No) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT TR_No, xpost, appStat, approved, disapproved
      FROM tr_h 
      WHERE TR_No = ?
    `;
    
    connection.query(sql, [TR_No], (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        reject(new Error('Document not found'));
      } else {
        resolve(results[0]);
      }
    });
  });
};

/**
 * Helper function to get the latest approval level from logs
 */
const getLatestApprovalLevel = async (connection, TR_No) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT MAX(APP_LEVEL) as max_level, STAT
      FROM approval_logs 
      WHERE TRNO = ? AND STAT IN ('Approved', 'Confirmed')
    `;
    
    connection.query(sql, [TR_No], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]?.max_level || 0);
      }
    });
  });
};

/**
 * Calculate xpost based on current approval level and total levels
 * xpost values:
 * 3 = Not started (initial state)
 * 2 = Partially approved (still needs more approvals)
 * 1 = Fully approved (all approvals completed)
 */
const calculateXpost = (currentApprovedLevel, totalLevels) => {
  if (currentApprovedLevel === 0) {
    return 3; // Not started
  } else if (currentApprovedLevel === totalLevels) {
    return 1; // Fully approved
  } else {
    return 2; // Partially approved
  }
};

/**
 * Determine STAT value based on approval progress
 * 'Confirmed' for partial approvals
 * 'Approved' for final approval
 */
const getApprovalStat = (currentApprovedLevel, totalLevels, nextLevel) => {
  // Check if this approval will complete all levels
  const willBeComplete = (currentApprovedLevel + 1) === totalLevels;
  
  if (willBeComplete) {
    return 'Approved'; // Final approval
  } else {
    return 'Confirmed'; // Partial approval
  }
};

/**
 * Approve a Transfer with multi-level approval support
 */
router.put('/approve/:TR_No', (req, res) => {
  const { TR_No } = req.params;
  const { approved, remarks, userInfo, appLevel } = req.body;

  const decodedJONo = decodeURIComponent(TR_No);
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

    connection.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        connection.release();
        console.error('Transaction begin error:', transactionErr);
        return res.status(500).json({
          success: false,
          error: 'Failed to start transaction'
        });
      }

      try {
        // 1. Get approval configuration for Transfer (Internal) module
        const approvalConfig = await getApprovalConfig(connection, 'Transfer (Internal)');
        
        if (approvalConfig.length === 0) {
          throw new Error('No approval configuration found for this module');
        }

        // 2. Get current document status
        const currentDoc = await getCurrentApprovalStatus(connection, cleanDocNo);
        
        // 3. Get the latest approved level from logs (only Approved or Confirmed)
        const currentApprovedLevel = await getLatestApprovalLevel(connection, cleanDocNo);
        
        // Determine the next level to approve
        const nextLevel = appLevel || (currentApprovedLevel + 1);
        
        // Check if the next level exists in configuration
        const nextLevelConfig = approvalConfig.find(config => config.APP_LEVEL === nextLevel);
        
        if (!nextLevelConfig) {
          throw new Error(`Invalid approval level: ${nextLevel}`);
        }

        const totalLevels = approvalConfig.length;
        
        // 4. Calculate new appStat value (track which levels are approved)
        let newAppStat = currentDoc.appStat || '';
        const levelStr = nextLevel.toString();
        
        if (!newAppStat) {
          newAppStat = levelStr;
        } else {
          const existingLevels = newAppStat.split(',').filter(l => l.trim());
          if (!existingLevels.includes(levelStr)) {
            newAppStat = [...existingLevels, levelStr].sort((a,b) => a-b).join(',');
          }
        }
        
        // Calculate the new approved level count
        const approvedLevelsCount = newAppStat.split(',').filter(l => l.trim()).length;
        
        // 5. Calculate new xpost based on approved levels count
        const newXpost = calculateXpost(approvedLevelsCount, totalLevels);
        
        // 6. Determine the STAT value for the approval log
        const approvalStat = getApprovalStat(currentApprovedLevel, totalLevels, nextLevel);
        
        // 7. Update tr_h table with new values
        const updateTrHSql = `
          UPDATE tr_h 
          SET xpost = ?, 
              appStat = ?,
              approved = ?
          WHERE TR_No = ?
        `;
        
        const updateResult = await new Promise((resolve, reject) => {
          connection.query(updateTrHSql, [newXpost, newAppStat, approved || '', cleanDocNo], (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        if (updateResult.affectedRows === 0) {
          throw new Error('TR header not found');
        }
        
        // 8. Check if this is the final approval level (xpost becomes 1)
        const isFinalApproval = approvedLevelsCount === totalLevels;
        
        // 9. Update tr_d table only on final approval (when xpost becomes 1)
        let trDUpdateResult = null;
        if (isFinalApproval) {
          const updateTrDSql = `UPDATE tr_d SET xpost = 1 WHERE TR_No = ?`;
          trDUpdateResult = await new Promise((resolve, reject) => {
            connection.query(updateTrDSql, [cleanDocNo], (error, result) => {
              if (error) reject(error);
              else resolve(result);
            });
          });
        }
        
        // 10. Create approval log with appropriate STAT value
        const insertLogSql = `
          INSERT INTO approval_logs 
          (TRNO, Module, X_USER, DT, APP_LEVEL, STAT, REMARKS) 
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
        `;
        
        const xUser = userInfo ? `${userInfo.user} - ${userInfo.lname}, ${userInfo.fname}` : String(approved);
        
        await new Promise((resolve, reject) => {
          connection.query(insertLogSql, [cleanDocNo, 'Transfer (Internal)', xUser, nextLevel, approvalStat, remarks || ''], (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        
        // 11. Commit transaction
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
          
          // Prepare response message based on approval status
          let message = '';
          if (isFinalApproval) {
            message = 'Transfer fully approved successfully';
          } else if (approvedLevelsCount === 1) {
            message = 'Level 1 approval confirmed';
          } else {
            message = `Level ${nextLevel} approval confirmed. ${totalLevels - approvedLevelsCount} more level(s) remaining.`;
          }
          
          res.json({
            success: true,
            message: message,
            data: {
              doc_h_updated: updateResult.affectedRows,
              tr_d_updated: trDUpdateResult?.affectedRows || 0,
              status: approvalStat,
              currentLevel: nextLevel,
              approvedLevels: approvedLevelsCount,
              totalLevels: totalLevels,
              isFinalApproval: isFinalApproval,
              xpost: newXpost,
              appStat: newAppStat
            }
          });
        });
        
      } catch (error) {
        console.error('Error in approval process:', error);
        connection.rollback(() => {
          connection.release();
          return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process approval'
          });
        });
      }
    });
  });
});

/**
 * Reject a Transfer
 */
router.put('/reject/:TR_No', (req, res) => {
  const { TR_No } = req.params;
  const { approved, remarks, userInfo, appLevel } = req.body;

  console.log('Rejection request:', { TR_No, approved, remarks, appLevel });

  const decodedJONo = decodeURIComponent(TR_No);
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

    connection.beginTransaction(async (transactionErr) => {
      if (transactionErr) {
        connection.release();
        return res.status(500).json({
          success: false,
          error: 'Failed to start transaction'
        });
      }

      try {
        // Get approval config to know total levels
        const approvalConfig = await getApprovalConfig(connection, 'Transfer (Internal)');
        const totalLevels = approvalConfig.length;
        
        // Determine which level is being rejected
        const rejectLevel = appLevel || 1;
        
        // On rejection, reset to initial state (xpost = 3, appStat = '')
        const newXpost = 3;
        const newAppStat = '';
        
        // Update tr_h for disapproval
        const updateTrHSql = `
          UPDATE tr_h 
          SET DISAPPROVED = ?,
              approved = ?,
              xpost = ?,
              appStat = ?
          WHERE TR_No = ?
        `;
        
        const updateResult = await new Promise((resolve, reject) => {
          connection.query(updateTrHSql, [1, approved || '', newXpost, newAppStat, cleanDocNo], (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        if (updateResult.affectedRows === 0) {
          throw new Error('TR header not found');
        }
        
        // Also reset tr_d xpost if it was updated
        const updateTrDSql = `UPDATE tr_d SET xpost = 3 WHERE TR_No = ?`;
        await new Promise((resolve, reject) => {
          connection.query(updateTrDSql, [cleanDocNo], (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });
        
        // Create disapproval log
        const insertLogSql = `
          INSERT INTO approval_logs 
          (TRNO, Module, X_USER, DT, APP_LEVEL, STAT, REMARKS) 
          VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)
        `;
        
        const xUser = userInfo ? `${userInfo.user} - ${userInfo.fname}, ${userInfo.lname}` : String(approved);
        
        await new Promise((resolve, reject) => {
          connection.query(insertLogSql, [cleanDocNo, 'Transfer (Internal)', xUser, rejectLevel, 'Disapproved', remarks || ''], (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        
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
            message: 'Transfer rejected successfully',
            data: {
              doc_h_updated: updateResult.affectedRows,
              status: 'Disapproved',
              xpost: newXpost,
              appStat: newAppStat
            }
          });
        });
        
      } catch (error) {
        console.error('Error in rejection process:', error);
        connection.rollback(() => {
          connection.release();
          return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process rejection'
          });
        });
      }
    });
  });
});

/**
 * Get approval status for a document
 */
router.get('/status/:TR_No', (req, res) => {
  const { TR_No } = req.params;
  
  const decodedDocNo = decodeURIComponent(TR_No);
  const cleanDocNo = decodedDocNo
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();
  
  db.getConnection(async (err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database connection error'
      });
    }
    
    try {
      // Get document status
      const docStatus = await getCurrentApprovalStatus(connection, cleanDocNo);
      
      // Get approval logs
      const logsQuery = `
        SELECT APP_LEVEL, STAT, X_USER, DT, REMARKS 
        FROM approval_logs 
        WHERE TRNO = ? 
        ORDER BY DT ASC
      `;
      
      const logs = await new Promise((resolve, reject) => {
        connection.query(logsQuery, [cleanDocNo], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      
      // Get approval configuration
      const config = await getApprovalConfig(connection, 'Transfer (Internal)');
      
      // Calculate status based on xpost
      let statusText = '';
      if (docStatus.disapproved === 1) {
        statusText = 'Disapproved';
      } else if (docStatus.xpost === 3) {
        statusText = 'For Approval';
      } else if (docStatus.xpost === 2) {
        statusText = 'Partially Approved';
      } else if (docStatus.xpost === 1) {
        statusText = 'Fully Approved';
      }
      
      const approvedLevels = docStatus.appStat ? docStatus.appStat.split(',').filter(l => l.trim()).map(Number) : [];
      
      connection.release();
      
      res.json({
        success: true,
        data: {
          document: docStatus,
          statusText: statusText,
          approvalHistory: logs,
          approvalConfig: config,
          approvedLevels: approvedLevels,
          currentApprovalLevel: approvedLevels.length,
          totalLevels: config.length,
          nextLevel: approvedLevels.length < config.length ? approvedLevels.length + 1 : null,
          isFullyApproved: docStatus.xpost === 1,
          isDisapproved: docStatus.disapproved === 1
        }
      });
      
    } catch (error) {
      connection.release();
      console.error('Error getting status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get approval status'
      });
    }
  });
});

/**
 * Check if a document is ready for the next approval level
 */
router.post('/check-next-level/:TR_No', (req, res) => {
  const { TR_No } = req.params;
  
  const decodedDocNo = decodeURIComponent(TR_No);
  const cleanDocNo = decodedDocNo
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();
  
  db.getConnection(async (err, connection) => {
    if (err) {
      console.error('Database connection error:', err);
      return res.status(500).json({
        success: false,
        error: 'Database connection error'
      });
    }
    
    try {
      const config = await getApprovalConfig(connection, 'Transfer (Internal)');
      const currentDoc = await getCurrentApprovalStatus(connection, cleanDocNo);
      const currentApprovedLevel = await getLatestApprovalLevel(connection, cleanDocNo);
      
      const nextLevel = currentApprovedLevel + 1;
      const isFullyApproved = nextLevel > config.length;
      const isDisapproved = currentDoc.disapproved === 1;
      
      // Determine if document can be approved
      let canApprove = false;
      let reason = '';
      
      if (isDisapproved) {
        reason = 'Document has been disapproved';
      } else if (isFullyApproved) {
        reason = 'Document is already fully approved';
      } else if (currentDoc.xpost === 1) {
        reason = 'Document is already fully approved';
      } else if (currentDoc.xpost === 3 && nextLevel === 1) {
        canApprove = true;
        reason = 'Ready for level 1 approval';
      } else if (currentDoc.xpost === 2 && nextLevel > 1) {
        canApprove = true;
        reason = `Ready for level ${nextLevel} approval`;
      } else {
        reason = 'Document is not ready for approval';
      }
      
      connection.release();
      
      res.json({
        success: true,
        data: {
          nextLevel: isFullyApproved ? null : nextLevel,
          totalLevels: config.length,
          currentApprovedLevel,
          isFullyApproved,
          isDisapproved,
          canApprove,
          reason,
          currentXpost: currentDoc.xpost,
          currentAppStat: currentDoc.appStat,
          nextLevelConfig: !isFullyApproved && !isDisapproved && canApprove ? config.find(c => c.APP_LEVEL === nextLevel) : null
        }
      });
      
    } catch (error) {
      connection.release();
      console.error('Error checking next level:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to check next approval level'
      });
    }
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