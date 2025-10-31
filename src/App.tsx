// src/App.tsx

import { useState } from 'react';
// --- BƯỚC 1: IMPORT COMPONENT MỚI ---
import OrbitVisualizer from './components/OrbitVisualizer';

interface OrbitResult {
  period_seconds: number;
  positions: { x: number; y: number; z: number }[];
}

function App() {
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState<OrbitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculateClick = () => {
    setStatus('Calculating...');
    setResult(null);
    setError(null);
    const orbitParams = {
      semi_major_axis: 7000, eccentricity: 0.01, inclination: 45,
      raan: 10, argp: 20, true_anomaly: 0
    };

    fetch('/api/calculate-orbit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orbitParams),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text) });
      }
      return response.json();
    })
    .then((data: OrbitResult) => {
      setResult(data);
      setStatus('Success!');
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setError(err.message);
      setStatus('Failed!');
    });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Interactive Orbit Visualizer - PoC #1</h1>
      <p>
        This demo tests the full Hybrid Architecture: React Frontend (Vercel) → Proxy (Vercel Serverless) → Compute Server (RTX 4090).
      </p>
      
      <button onClick={handleCalculateClick} disabled={status === 'Calculating...'}>
        {status === 'Calculating...' ? 'Running on GPU Server...' : 'Calculate & Visualize Orbit'}
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h2>Calculation Status: {status}</h2>

      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffeeee', padding: '10px', marginTop: '10px' }}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {/* --- BƯỚC 2: THAY THẾ KHỐI JSON BẰNG COMPONENT VISUALIZER --- */}
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result from Compute Server:</h3>
          <p><strong>Orbit Period:</strong> {result.period_seconds.toFixed(2)} seconds. <strong>Received:</strong> {result.positions.length} position points.</p>
          
          {/* Đây là phần thay đổi quan trọng */}
          <OrbitVisualizer positions={result.positions} />
        </div>
      )}
    </div>
  );
}

export default App;
