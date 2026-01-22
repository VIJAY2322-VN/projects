const db = require('../config/database');

class WaterFlow {
  static create(flowData) {
    const stmt = db.prepare('INSERT INTO water_flow (flow_rate, location) VALUES (?, ?)');
    const result = stmt.run(flowData.flow_rate, flowData.location);
    return { id: result.lastInsertRowid, ...flowData };
  }

  static getAll() {
    const stmt = db.prepare('SELECT * FROM water_flow ORDER BY timestamp DESC');
    return stmt.all();
  }

  static getByLocation(location) {
    const stmt = db.prepare('SELECT * FROM water_flow WHERE location = ? ORDER BY timestamp DESC');
    return stmt.all(location);
  }

  static getRecent(hours = 24) {
    const stmt = db.prepare(`
      SELECT * FROM water_flow 
      WHERE timestamp > datetime('now', ?) 
      ORDER BY timestamp DESC
    `);
    return stmt.all(`-${hours} hours`);
  }
}

module.exports = WaterFlow;