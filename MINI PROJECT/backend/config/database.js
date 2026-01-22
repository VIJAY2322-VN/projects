const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../water_management.db');
const db = new Database(dbPath);

console.log('Connected to SQLite database');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS water_flow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_rate REAL NOT NULL,
    location TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tank_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tank_id TEXT NOT NULL,
    level_percentage REAL NOT NULL,
    volume_liters REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS room_consumption (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    consumption_liters REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Database tables created/verified');

module.exports = db;