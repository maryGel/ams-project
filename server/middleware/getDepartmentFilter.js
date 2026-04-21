// middleware/departmentAuth.js
export const getDepartmentFilter = async (username) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT MULTI_DEPT 
      FROM \`user0000inv\` 
      WHERE username = ?
    `;
    
    db.query(query, [username], (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (results.length === 0) {
        resolve({ departments: [], isAdmin: false });
        return;
      }
      
      const multiDept = results[0].MULTI_DEPT;
      if (!multiDept) {
        resolve({ departments: [], isAdmin: false });
        return;
      }
      
      // Split the pipe-delimited departments
      const departments = multiDept.split('|').map(dept => dept.trim());
      resolve({ departments, isAdmin: false });
    });
  });
};

export const departmentFilterMiddleware = async (req, res, next) => {
  const username = req.user?.username || req.body.username || req.query.username;
  
  if (!username) {
    return res.status(401).json({ success: false, message: 'Username not provided' });
  }
  
  try {
    // Check if user is admin
    const adminQuery = `SELECT Admin FROM \`user0000inv\` WHERE username = ?`;
    db.query(adminQuery, [username], (err, results) => {
      if (err) {
        console.error('Error checking admin status:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
      }
      
      const isAdmin = results.length > 0 && results[0].Admin === 1;
      
      if (isAdmin) {
        // Admin can see all records
        req.departmentFilter = { isAdmin: true, departments: [] };
        return next();
      }
      
      // Get user's departments
      const deptQuery = `
        SELECT MULTI_DEPT 
        FROM \`user0000inv\` 
        WHERE username = ?
      `;
      
      db.query(deptQuery, [username], (err, results) => {
        if (err) {
          console.error('Error fetching user departments:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        
        if (results.length === 0) {
          return res.status(403).json({ success: false, message: 'User not found' });
        }
        
        const multiDept = results[0].MULTI_DEPT;
        if (!multiDept) {
          return res.status(403).json({ 
            success: false, 
            message: 'No department assigned to user' 
          });
        }
        
        const departments = multiDept.split('|').map(dept => dept.trim());
        req.departmentFilter = { isAdmin: false, departments };
        next();
      });
    });
  } catch (error) {
    console.error('Department filter middleware error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};