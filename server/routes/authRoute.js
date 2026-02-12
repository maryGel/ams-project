import express from "express";
import { db } from "../server.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";


// ... Login ...
router.post("/", (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      success: false,
      message: "username and password are required*",
    });
  }

  const sql = "SELECT * FROM user0000inv WHERE user = ?";

  db.query(sql, [user], async (err, results) => {
    if (err) {
      console.error("❌ Database query error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    if (!results.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const dbUser = results[0];

    // 1) Try bcrypt compare first (hashed passwords)
    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, dbUser.password);
    } catch (e) {
      isMatch = false;
    }

    // 2) If bcrypt fails, fallback to plain-text check
    if (!isMatch && password === dbUser.password) {
      isMatch = true;

      // Auto-upgrade to bcrypt hash
      const newHash = await bcrypt.hash(password, 10);
      db.query(
        "UPDATE user0000inv SET password = ? WHERE user = ?",
        [newHash, user],
        (updateErr) => {
          if (updateErr) {
            console.error("⚠️ Failed to upgrade password hash:", updateErr);
          }
        }
      );
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // 3) Generate JWT
    const token = jwt.sign(
      {
        username: dbUser.user,
        isAdmin: dbUser.Admin === 1
      },
      JWT_SECRET,
      { expiresIn: "1h"}
    );

    res.json({
      success: true,
      message: "Login successful",
      username: { username: dbUser.user },
      isAdmin: dbUser.Admin === 1,
      token,
    });
  });
});

// Health check
router.get("/health", (req, res) => {
  db.query("SELECT 1 as test", (err, results) => {
    if (err) {
      console.error("❌ Database health check failed:", err);
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: err.message,
      });
    }
    res.json({
      status: "ok",
      message: "Database connection successful",
      result: results[0],
    });
  });
});

// Test table (temporary)
router.get("/test-table", (req, res) => {
  db.query("SHOW TABLES LIKE 'username0000inv'", (err, results) => {
    if (err) {
      console.error("Table check error:", err);
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.json({ message: "Table 'username0000inv' does not exist" });
    }

    res.json({ message: "Table 'username0000inv' exists", results });
  });
});

export default router;
