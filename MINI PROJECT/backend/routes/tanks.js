const express = require('express');
const router = express.Router();
const TankLevel = require('../models/TankLevel');

// POST - Add tank level measurement
router.post('/levels', (req, res) => {
  try {
    const { tank_id, level_percentage, volume_liters } = req.body;
    
    if (!tank_id || level_percentage === undefined || volume_liters === undefined) {
      return res.status(400).json({ error: 'Tank ID, level percentage, and volume are required' });
    }

    const result = TankLevel.create({ tank_id, level_percentage, volume_liters });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrieve tank levels
router.get('/levels', (req, res) => {
  try {
    const { tank_id } = req.query;
    
    let data;
    if (tank_id) {
      data = TankLevel.getByTankId(tank_id);
    } else {
      data = TankLevel.getAll();
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get latest tank levels
router.get('/levels/latest', (req, res) => {
  try {
    const data = TankLevel.getLatest();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;