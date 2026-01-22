const db = require('../config/database');

class TankLevel {
  static create(tankData) {
    const stmt = db.prepare('INSERT INTO tank_levels (tank_id, level_percentage, volume_liters) VALUES (?, ?, ?)');
    const result = stmt.run(tankData.tank_id, tankData.level_percentage, tankData.volume_liters);
    return { id: result.lastInsertRowid, ...tankData };
  }

  static getAll() {
    const stmt = db.prepare('SELECT * FROM tank_levels ORDER BY timestamp DESC');
    return stmt.all();
  }

  static getByTankId(tankId) {
    const stmt = db.prepare('SELECT * FROM tank_levels WHERE tank_id = ? ORDER BY timestamp DESC');
    return stmt.all(tankId);
  }

  static getLatest() {
    const stmt = db.prepare(`
      SELECT t1.* FROM tank_levels t1
      WHERE timestamp = (SELECT MAX(timestamp) FROM tank_levels t2 WHERE t1.tank_id = t2.tank_id)
      ORDER BY t1.tank_id
    `);
    return stmt.all();
  }
}

module.exports = TankLevel;