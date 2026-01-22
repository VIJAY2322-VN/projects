import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ThresholdSettings from './components/ThresholdSettings';
import LeakAlerts from './components/LeakAlerts';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [thresholds, setThresholds] = useState({});
  const [leaks, setLeaks] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [thresholdsData, leaksData] = await Promise.all([
        fetch('/api/thresholds').then(r => r.json()),
        fetch('/api/leaks').then(r => r.json())
      ]);
      setThresholds(thresholdsData);
      setLeaks(leaksData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Water Management System</h1>
        <nav>
          <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentView('settings')}>Settings</button>
          <button onClick={() => setCurrentView('alerts')}>Alerts</button>
        </nav>
      </header>

      <main>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'settings' && (
          <ThresholdSettings thresholds={thresholds} onSave={setThresholds} />
        )}
        {currentView === 'alerts' && <LeakAlerts leaks={leaks} />}
      </main>
    </div>
  );
}

export default App;