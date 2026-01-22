const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataDir = path.join(__dirname, 'data');
const dataPath = path.join(dataDir, 'database.json');

// Ensure data directory exists
const ensureDataDir = async () => {
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
        console.log('Created data directory:', dataDir);
    }
};

// Initialize data
const initializeData = async () => {
    try {
        await ensureDataDir();
        await fs.access(dataPath);
        console.log('Database file exists');
    } catch {
        const initialData = {
            waterFlow: [],
            tankLevels: [],
            leaks: [],
            thresholds: {
                flowRate: { WARNING: 100, CRITICAL: 150 },
                continuousFlow: { DURATION_HOURS: 24, WARNING_AVG: 30, CRITICAL_AVG: 50 },
                nightUsage: { MIN_MEASUREMENTS: 10, WARNING_AVG: 15, CRITICAL_AVG: 25 },
                tankDrop: { TIME_WINDOW_MIN: 60, WARNING_DROP: 20, CRITICAL_DROP: 35 }
            },
            rooms: {}
        };

        // Initialize room data
        for (let floor = 1; floor <= 3; floor++) {
            for (let room = 1; room <= 6; room++) {
                initialData.rooms[`${floor}0${room}`] = 0;
            }
        }

        await fs.writeFile(dataPath, JSON.stringify(initialData, null, 2));
        console.log('Created initial database file');
    }
};

// Read data
const readData = async () => {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return null;
    }
};

// Write data
const writeData = async (data) => {
    try {
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'connected', timestamp: new Date().toISOString() });
});

app.get('/api/water-flow', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.waterFlow.slice(-100)); // Return last 100 readings
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch water flow data' });
    }
});

app.post('/api/water-flow', async (req, res) => {
    try {
        const data = await readData();
        const newReading = {
            ...req.body,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        data.waterFlow.push(newReading);
        await writeData(data);
        res.json({ success: true, id: newReading.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save water flow data' });
    }
});

app.get('/api/tank-levels', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.tankLevels.slice(-50)); // Return last 50 readings
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tank levels' });
    }
});

app.post('/api/tank-levels', async (req, res) => {
    try {
        const data = await readData();
        const newReading = {
            ...req.body,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        data.tankLevels.push(newReading);
        await writeData(data);
        res.json({ success: true, id: newReading.id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save tank level data' });
    }
});

app.get('/api/thresholds', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.thresholds);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch thresholds' });
    }
});

app.post('/api/thresholds', async (req, res) => {
    try {
        const data = await readData();
        data.thresholds = { ...data.thresholds, ...req.body };
        await writeData(data);
        res.json({ success: true, thresholds: data.thresholds });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update thresholds' });
    }
});

app.get('/api/rooms', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch room data' });
    }
});

app.post('/api/rooms/:roomId', async (req, res) => {
    try {
        const data = await readData();
        const roomId = req.params.roomId;
        const consumption = parseInt(req.body.consumption) || 0;
        
        data.rooms[roomId] = (data.rooms[roomId] || 0) + consumption;
        await writeData(data);
        res.json({ success: true, consumption: data.rooms[roomId] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update room consumption' });
    }
});

app.get('/api/leaks', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.leaks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch leak data' });
    }
});

app.post('/api/leaks', async (req, res) => {
    try {
        const data = await readData();
        const leak = {
            ...req.body,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        data.leaks.push(leak);
        await writeData(data);
        res.json({ success: true, leak });
    } catch (error) {
        res.status(500).json({ error: 'Failed to report leak' });
    }
});

// Start server
app.listen(PORT, async () => {
    try {
        await initializeData();
        console.log('✅ Data initialization completed');
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    } catch (error) {
        console.error('❌ Failed to initialize server:', error);
        process.exit(1);
    }
});