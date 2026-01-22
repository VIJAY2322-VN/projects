const db = require('../config/database');

class RoomConsumption {
  static create(roomData) {
    const stmt = db.prepare('INSERT INTO room_consumption (room_id, consumption_liters) VALUES (?, ?)');
    const result = stmt.run(roomData.room_id, roomData.consumption_liters);
    return { id: result.lastInsertRowid, ...roomData };
  }

  static getAll() {
    const stmt = db.prepare('SELECT * FROM room_consumption ORDER BY timestamp DESC');
    return stmt.all();
  }

  static getByRoomId(roomId) {
    const stmt = db.prepare('SELECT * FROM room_consumption WHERE room_id = ? ORDER BY timestamp DESC');
    return stmt.all(roomId);
  }

  static getTotalConsumption(hours = 24) {
    const stmt = db.prepare(`
      SELECT room_id, SUM(consumption_liters) as total_consumption 
      FROM room_consumption 
      WHERE timestamp > datetime('now', ?)
      GROUP BY room_id
    `);
    return stmt.all(`-${hours} hours`);
  }
}

module.exports = RoomConsumption;