// src/App.tsx

import { useState, useEffect } from 'react';

function App() {
  // State để lưu tin nhắn từ backend
  const [message, setMessage] = useState('Loading message from backend...');

  // useEffect sẽ chạy một lần sau khi component được render
  useEffect(() => {
    // Gọi đến API backend /api/hello
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => {
        // Cập nhật state với tin nhắn nhận được
        setMessage(data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Failed to load message from backend.');
      });
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  return (
    <div>
      <h1>Interactive Orbit Visualizer</h1>
      <p>This is the React Frontend.</p>
      <hr />
      <h2>Backend Connection Test:</h2>
      <p style={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', padding: '10px' }}>
        {message}
      </p>
    </div>
  );
}

// Dòng này cực kỳ quan trọng, nó biến file này thành một module
export default App;
