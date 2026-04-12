/**
 * Helper function to get approval configuration
 */
export const getApprovalConfig = async (connection, module) => {
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
export const getCurrentApprovalStatus = async (connection, docNo, sql) => {
  return new Promise((resolve, reject) => {
    // const sql = `
    //   SELECT docNo, xpost, appStat, approved, disapproved
    //   FROM table_header 
    //   WHERE docNo = ?
    // `;
    
    connection.query(sql, [docNo], (error, results) => {
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
export const getLatestApprovalLevel = async (connection, docNo, module) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT MAX(APP_LEVEL) as max_level, STAT
      FROM approval_logs 
      WHERE TRNO = ? AND STAT IN ('Approved', 'Confirmed') AND MODULE = ?
    `;
    
    connection.query(sql, [docNo, module], (error, results) => {
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
export const calculateXpost = (currentApprovedLevel, totalLevels) => {
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
export const getApprovalStat = (currentApprovedLevel, totalLevels, nextLevel) => {
  // Check if this approval will complete all levels
  const willBeComplete = (currentApprovedLevel + 1) === totalLevels;
  
  if (willBeComplete) {
    return 'Approved'; // Final approval
  } else {
    return 'Confirmed'; // Partial approval
  }
};