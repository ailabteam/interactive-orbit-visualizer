// src/App.tsx

import { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho kết quả trả về từ backend
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

    // Các tham số quỹ đạo mặc định để test
    const orbitParams = {
      semi_major_axis: 7000,
      eccentricity: 0.01,
      inclination: 45,
      raan: 10,
      argp: 20,
      true_anomaly: 0
    };

    // Gửi request POST đến endpoint tính toán
    fetch('/api/calculate-orbit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orbitParams),
    })
    .then(response => {
      if (!response.ok) {
        // Nếu server trả về lỗi, ném ra để khối catch xử lý
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
        {status === 'Calculating...' ? 'Running on GPU Server...' : 'Calculate Sample Orbit'}
      </button>

      <hr style={{ margin: '20px 0' }} />

      <h2>Calculation Status: {status}</h2>

      {error && (
        <div style={{ color: 'red', backgroundColor: '#ffeeee', padding: '10px', marginTop: '10px' }}>
          <strong>Error:</strong>
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ backgroundColor: '#eef8ee', padding: '10px', marginTop: '10px' }}>
          <strong>Result from Compute Server:</strong>
          <p>Orbit Period: {result.period_seconds.toFixed(2)} seconds</p>
          <p>Received {result.positions.length} position points.</p>
          <pre style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#ddd', padding: '5px' }}>
            {JSON.stringify(result.positions.slice(0, 5), null, 2)}
            {/* Chỉ hiển thị 5 điểm đầu tiên cho gọn */}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
