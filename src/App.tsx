// src/App.tsx

import { useState } from 'react';
import OrbitVisualizer from './components/OrbitVisualizer';
import './App.css'; // Chúng ta sẽ thêm một chút style cho đẹp hơn

// --- Định nghĩa các Interfaces ---
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
  // State để quản lý trạng thái của request
  const [status, setStatus] = useState('Idle');
  const [result, setResult] = useState<OrbitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- State để quản lý các tham số quỹ đạo từ thanh trượt ---
  const [params, setParams] = useState<OrbitParams>({
    semi_major_axis: 7000,
    eccentricity: 0.01,
    inclination: 45,
    raan: 10,
    argp: 20,
    true_anomaly: 0
  });

  // Hàm xử lý khi giá trị của thanh trượt thay đổi
  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prevParams => ({
      ...prevParams,
      [name]: parseFloat(value) // Chuyển giá trị từ string sang number
    }));
  };

  // Hàm xử lý khi nhấn nút tính toán
  const handleCalculateClick = () => {
    setStatus('Calculating...');
    setResult(null);
    setError(null);

    fetch('/api/calculate-orbit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params), // Gửi đi các tham số hiện tại
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
    <div className="container">
      <header>
        <h1>Interactive Orbit Visualizer - PoC #1</h1>
        <p>
          A real-time demo of a Hybrid Architecture: React Frontend (Vercel) → Proxy (Vercel Serverless) → Compute Server (RTX 4090).
        </p>
      </header>
      
      <main>
        <div className="controls-panel">
          <h2>Orbit Parameters</h2>
          
          <div className="slider-group">
            <label>Semi-major Axis (km): {params.semi_major_axis}</label>
            <input type="range" name="semi_major_axis" min="6878" max="42164" step="100" value={params.semi_major_axis} onChange={handleParamChange} />
          </div>
          
          <div className="slider-group">
            <label>Eccentricity: {params.eccentricity}</label>
            <input type="range" name="eccentricity" min="0" max="0.9" step="0.01" value={params.eccentricity} onChange={handleParamChange} />
          </div>
          
          <div className="slider-group">
            <label>Inclination (°): {params.inclination}</label>
            <input type="range" name="inclination" min="0" max="180" step="1" value={params.inclination} onChange={handleParamChange} />
          </div>
          
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
              <p><strong>Orbit Period:</strong> {result.period_seconds.toFixed(2)}s | <strong>Points:</strong> {result.positions.length}</p>
              <OrbitVisualizer positions={result.positions} />
            </div>
          ) : (
             <div className="placeholder-box">
                <p>Adjust parameters and click "Calculate & Visualize" to see the orbit.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
