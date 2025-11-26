import express from "express";
import { db } from '../server.js';

const router = express.Router();
console.log(`authroute`)
router.post("/", (req, res) => {
  
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
 
    return res.status(400).json({ 
      success: false, 
      message: "username and password are required*" 
    });
  }

  const sql = "SELECT * FROM user0000inv WHERE username = ? AND password = ?";
  
  console.log(`🔐 Login attempt for username: ${username}`);
  
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('❌ Database query error:', err);
      return res.status(500).json({ 
        success: false, 
        message: "Database error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    if (results.length > 0) {
      console.log(`✅ Login successful for username: ${username}`);
      res.json({ 
        success: true, 
        message: "Login successful",
        username: { username: results[0].username } // Don't send password back
      });
    } else {
      console.log(`❌ Login failed for username: ${username}`);
      res.status(401).json({ 
        success: false, 
        message: "Invalid username or password" 
      });
    }
  });
});

// Add a health check endpoint to test database connection
router.get("/health", (req, res) => {
  db.query("SELECT 1 as test", (err, results) => {
    if (err) {
      console.error('❌ Database health check failed:', err);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed',
        error: err.message 
      });
    }
    res.json({ 
      status: 'ok', 
      message: 'Database connection successful',
      result: results[0] 
    });
  });
});

// Add this to your authRoute.js temporarily
router.get("/test-table", (req, res) => {
  db.query("SHOW TABLES LIKE 'username0000inv'", (err, results) => {
    if (err) {
      console.error('Table check error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      return res.json({ message: "Table 'username0000inv' does not exist" });
    }
    
    res.json({ message: "Table 'username0000inv' exists", results });
  });
});

export default router;