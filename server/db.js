import mysql from 'mysql2';

// Use environment variables if available, fallback to local development
export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'adminGel',
  database: process.env.DB_NAME || 'ams1',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
