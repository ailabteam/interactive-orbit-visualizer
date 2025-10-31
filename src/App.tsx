// src/App.tsx

import { useState } from 'react';
import OrbitVisualizer from './components/OrbitVisualizer';
import './App.css';

// --- Interfaces (Không thay đổi) ---
interface OrbitResult {
  period_seconds: number;
  positions: { x: number; y: number; z: number }[];
}

interface OrbitParams {
  semi_major_axis: number;
  eccentricity: number;
  inclination: number;
  raan: number;
  argp: number;
  true_anomaly: number;
}

// --- Component Chính ---
function App() {
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState<OrbitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<OrbitParams>({
    semi_major_axis: 7000,
    eccentricity: 0.01,
    inclination: 45,
    raan: 10,
    argp: 20,
    true_anomaly: 0
  });

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prevParams => ({
      ...prevParams,
      [name]: parseFloat(value)
    }));
  };

  const handleCalculateClick = () => {
    // ... (logic tính toán không thay đổi) ...
    setStatus('Calculating...');
    setResult(null);
    setError(null);
    fetch('/api/calculate-orbit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    .then(response => {
      if (!response.ok) { return response.text().then(text => { throw new Error(text) }); }
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
    <div className="container">
      <header>
        <h1>Interactive Orbit Visualizer - PoC #1</h1>
        <p>A real-time demo of a Hybrid Architecture: React Frontend (Vercel) → Proxy (Vercel Serverless) → Compute Server (RTX 4090).</p>
      </header>
      
      <main>
        <div className="controls-panel">
          {/* --- KHỐI GIẢI THÍCH 1: GIỚI THIỆU --- */}
          <div className="explanation-box">
            <h3>About This PoC</h3>
            <p>
              This Proof-of-Concept demonstrates the fundamental calculation of a satellite's orbit around Earth. It takes 6 classical orbital elements as input, sends them to a high-performance backend for calculation using the <strong>Poliastro</strong> library, and visualizes the resulting 3D trajectory.
            </p>
          </div>
          
          <h2>Orbit Parameters</h2>
          
          <div className="slider-group">
            <label htmlFor="semi_major_axis">Semi-major Axis (km): {params.semi_major_axis}</label>
            <input id="semi_major_axis" type="range" name="semi_major_axis" min="6778" max="42164" step="100" value={params.semi_major_axis} onChange={handleParamChange} />
            <small>Defines the size of the orbit. 6778km for Low Earth Orbit (LEO), 42164km for Geostationary (GEO).</small>
          </div>
          
          <div className="slider-group">
            <label htmlFor="eccentricity">Eccentricity: {params.eccentricity}</label>
            <input id="eccentricity" type="range" name="eccentricity" min="0" max="0.9" step="0.01" value={params.eccentricity} onChange={handleParamChange} />
            <small>Defines the shape of the orbit. 0 for a perfect circle, >0 for an ellipse.</small>
          </div>
          
          <div className="slider-group">
            <label htmlFor="inclination">Inclination (°): {params.inclination}</label>
            <input id="inclination" type="range" name="inclination" min="0" max="180" step="1" value={params.inclination} onChange={handleParamChange} />
            <small>Defines the tilt of the orbit relative to the Earth's equator. 0° for equatorial, 90° for polar.</small>
          </div>

          {/* (Các tham số khác có thể thêm vào sau nếu muốn) */}
          
          <button onClick={handleCalculateClick} disabled={status === 'Calculating...'}>
            {status === 'Calculating...' ? '🛰️ Calculating...' : '🚀 Calculate & Visualize'}
          </button>
        </div>

        <div className="visualizer-panel">
          <h2>Calculation Status: <span className={`status-${status.toLowerCase()}`}>{status}</span></h2>
          
          {error && (
            <div className="error-box">
              <strong>Error:</strong> <pre>{error}</pre>
            </div>
          )}

          {result ? (
            <div className="result-box">
              {/* --- KHỐI GIẢI THÍCH 2: KẾT QUẢ --- */}
              <p>
                The backend calculated that a satellite with these parameters would have an <strong>Orbit Period</strong> of <strong>{(result.period_seconds / 60).toFixed(2)} minutes</strong>. The 3D plot below shows the trajectory for one full orbit, sampled at <strong>{result.positions.length} points</strong>.
              </p>
              <OrbitVisualizer positions={result.positions} />
            </div>
          ) : (
             <div className="placeholder-box">
                <p>Adjust parameters and click "Calculate & Visualize" to see the orbit.</p>
                <p style={{marginTop: '20px', fontSize: '0.9em', color: '#666'}}>
                  This visualization is the foundation for more complex tasks, such as optimizing satellite constellations (PoC #1 extension), forecasting network anomalies (PoC #2), and orchestrating federated learning (PoC #3).
                </p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
