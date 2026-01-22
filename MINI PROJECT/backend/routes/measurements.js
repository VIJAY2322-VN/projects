const express = require('express');
const router = express.Router();
const WaterFlow = require('../models/WaterFlow');

// POST - Add water flow measurement
router.post('/flow', (req, res) => {
  try {
    const { flow_rate, location } = req.body;
    
    if (!flow_rate || !location) {
      return res.status(400).json({ error: 'Flow rate and location are required' });
    }

    const result = WaterFlow.create({ flow_rate, location });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrieve water flow measurements
router.get('/flow', (req, res) => {
  try {
    const { location, hours } = req.query;
    
    let data;
    if (location) {
      data = WaterFlow.getByLocation(location);
    } else if (hours) {
      data = WaterFlow.getRecent(parseInt(hours));
    } else {
      data = WaterFlow.getAll();
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;