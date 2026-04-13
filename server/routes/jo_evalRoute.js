// routes/jo_evaluationRoute.js
import express from 'express';
import { db } from '../server.js';

const router = express.Router();

/**
 * Evaluate a Job Order (JO)
 * Updates jo_h.eval_status to 'DONE' and jo_d.eval_status and eval_remarks for selected items
 */
router.put('/evaluate/:JO_No', (req, res) => {
  const { JO_No } = req.params;
  const { selectedItems, eval_status, eval_remarks, userInfo } = req.body;

  console.log('=== EVALUATION REQUEST ===');
  console.log('JO_No:', JO_No);
  console.log('Selected Items:', JSON.stringify(selectedItems, null, 2));
  console.log('Eval Status:', eval_status);
  console.log('Eval Remarks:', eval_remarks);

  // Validate required fields
  if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
    console.log('Validation failed: No selected items');
    return res.status(400).json({
      success: false,
      error: 'No items selected for evaluation'
    });
  }

  // Validate each selected item has required fields
  for (const item of selectedItems) {
    if (!item.FAC_NO) {
      console.log('Validation failed: Missing FAC_NO in item', item);
      return res.status(400).json({
        success: false,
        error: 'Selected item missing FAC_NO'
      });
    }
  }

  if (!eval_status) {
    return res.status(400).json({
      success: false,
      error: 'Evaluation status is required'
    });
  }

  if (!eval_remarks || eval_remarks.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Evaluation remarks are required'
    });
  }

  // Validate eval_status values
  const validStatuses = ['FOR REPAIR INHOUSE', 'FOR REPAIR OUTSOURCE'];
  if (!validStatuses.includes(eval_status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid evaluation status. Must be either "FOR REPAIR INHOUSE" or "FOR REPAIR OUTSOURCE"'
    });
  }

  const decodedJONo = decodeURIComponent(JO_No)
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  console.log('Decoded JO_No:', decodedJONo);

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
        // 1. Check if JO header exists and get current status
        const checkHeaderSql = `
          SELECT JO_No, eval_status 
          FROM jo_h 
          WHERE JO_No = ?
        `;

        const headerResult = await new Promise((resolve, reject) => {
          connection.query(checkHeaderSql, [decodedJONo], (error, results) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        console.log('Header check result:', headerResult);

        if (headerResult.length === 0) {
          throw new Error('JO not found');
        }

        if (headerResult[0].eval_status === 'DONE') {
          throw new Error('JO has already been evaluated');
        }

        // 2. Update jo_h table - set eval_status to 'DONE'
        const updateHeaderSql = `
          UPDATE jo_h 
          SET eval_status = 'DONE'
          WHERE JO_No = ?
        `;

        const updateHeaderResult = await new Promise((resolve, reject) => {
          connection.query(updateHeaderSql, [decodedJONo], (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        });

        console.log('Header update result:', updateHeaderResult);

        if (updateHeaderResult.affectedRows === 0) {
          throw new Error('Failed to update JO header');
        }

        // 3. Update jo_d table for each selected item - WITHOUT workDet in WHERE clause
        let updatedItemsCount = 0;
        const updateErrors = [];

        for (const selectedItem of selectedItems) {
          console.log('Updating item:', {
            JO_No: decodedJONo,
            FAC_NO: selectedItem.FAC_NO,
            eval_status: eval_status,
            eval_remarks: eval_remarks
          });

          // Only use JO_No and FAC_NO in WHERE clause
          const updateDetailSql = `
            UPDATE jo_d 
            SET eval_status = ?, 
                eval_remarks = ?
            WHERE JO_No = ? 
              AND FAC_NO = ?
          `;

          const updateDetailResult = await new Promise((resolve, reject) => {
            connection.query(
              updateDetailSql, 
              [eval_status, eval_remarks, decodedJONo, selectedItem.FAC_NO], 
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });

          console.log('Detail update result:', updateDetailResult);

          if (updateDetailResult.affectedRows > 0) {
            updatedItemsCount++;
          } else {
            updateErrors.push(`Failed to update item with FAC_NO: ${selectedItem.FAC_NO}`);
          }
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
          
          const response = {
            success: true,
            message: 'JO evaluated successfully',
            data: {
              JO_No: decodedJONo,
              header_updated: updateHeaderResult.affectedRows,
              items_updated: updatedItemsCount,
              total_items_selected: selectedItems.length,
              eval_status: eval_status,
              eval_remarks: eval_remarks
            }
          };

          if (updateErrors.length > 0) {
            response.warnings = updateErrors;
            response.message = `JO evaluated with ${updateErrors.length} warning(s)`;
          }

          console.log('Evaluation successful:', response);
          res.json(response);
        });
        
      } catch (error) {
        console.error('Error in evaluation process:', error);
        connection.rollback(() => {
          connection.release();
          return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process evaluation'
          });
        });
      }
    });
  });
});

/**
 * Get JO evaluation status
 */
router.get('/status/:JO_No', (req, res) => {
  const { JO_No } = req.params;

  const decodedJONo = decodeURIComponent(JO_No)
    .replace(/\u00A0/g, '')
    .replace(/\s/g, '')
    .toUpperCase();

  // Get header status
  const headerSql = `
    SELECT JO_No, eval_status 
    FROM jo_h 
    WHERE JO_No = ?
  `;

  // Get details status
  const detailsSql = `
    SELECT JO_No, FAC_NO, FAC_name, workDet, eval_status, eval_remarks 
    FROM jo_d 
    WHERE JO_No = ?
  `;

  db.query(headerSql, [decodedJONo], (headerErr, headerResults) => {
    if (headerErr) {
      console.error('Database error:', headerErr);
      return res.status(500).json({
        success: false,
        error: 'Database error'
      });
    }

    if (headerResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'JO not found'
      });
    }

    db.query(detailsSql, [decodedJONo], (detailsErr, detailsResults) => {
      if (detailsErr) {
        console.error('Database error:', detailsErr);
        return res.status(500).json({
          success: false,
          error: 'Database error'
        });
      }

      res.json({
        success: true,
        data: {
          header: headerResults[0],
          details: detailsResults
        }
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
    message: 'JO Evaluation route is working!',
    timestamp: new Date().toISOString()
  });
});

export default router;