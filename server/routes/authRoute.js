import express from "express";
import { db } from '../server.js';

const router = express.Router();

router.post("/", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM user0000inv WHERE user = ? AND password = ?";
  
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.json({ success: false, message: "DB error" });

    if (results.length > 0) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  });
});

export default router;
