class WaterSystemAPI {
    constructor(baseURL = 'http://localhost:5000') {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // Health check
    async testConnection() {
        return this.request('/api/health');
    }

    // Water flow data
    async getWaterFlow() {
        return this.request('/api/water-flow');
    }

    async postWaterFlow(data) {
        return this.request('/api/water-flow', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Tank levels
    async getTankLevels() {
        return this.request('/api/tank-levels');
    }

    async postTankLevel(data) {
        return this.request('/api/tank-levels', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Thresholds
    async getThresholds() {
        return this.request('/api/thresholds');
    }

    async updateThresholds(thresholds) {
        return this.request('/api/thresholds', {
            method: 'POST',
            body: JSON.stringify(thresholds)
        });
    }

    // Rooms
    async getRooms() {
        return this.request('/api/rooms');
    }

    async updateRoomConsumption(roomId, consumption) {
        return this.request(`/api/rooms/${roomId}`, {
            method: 'POST',
            body: JSON.stringify({ consumption })
        });
    }

    // Leaks
    async getLeaks() {
        return this.request('/api/leaks');
    }

    async reportLeak(leakData) {
        return this.request('/api/leaks', {
            method: 'POST',
            body: JSON.stringify(leakData)
        });
    }
}

// Initialize global API instance
window.waterSystemAPI = new WaterSystemAPI();