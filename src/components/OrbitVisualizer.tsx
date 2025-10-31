// src/components/OrbitVisualizer.tsx

import Plot from 'react-plotly.js';

// Định nghĩa kiểu dữ liệu cho props mà component này sẽ nhận
interface Position {
  x: number;
  y: number;
  z: number;
}

interface OrbitVisualizerProps {
  positions: Position[];
}

// Component OrbitVisualizer
const OrbitVisualizer = ({ positions }: OrbitVisualizerProps) => {
  // 1. Chuẩn bị dữ liệu cho Plotly
  // Tách mảng các object thành 3 mảng riêng biệt cho x, y, z
  const xCoords = positions.map(p => p.x);
  const yCoords = positions.map(p => p.y);
  const zCoords = positions.map(p => p.z);
  
  // Thêm một điểm ở tâm (0,0,0) để tượng trưng cho Trái Đất
  const earth_x = [0];
  const earth_y = [0];
  const earth_z = [0];


  // 2. Cấu hình đồ thị (layout)
  const layout = {
    title: 'Satellite Orbit (3D Visualization)',
    autosize: true,
    scene: {
      xaxis: { title: 'X (km)' },
      yaxis: { title: 'Y (km)' },
      zaxis: { title: 'Z (km)' },
      aspectratio: { x: 1, y: 1, z: 1 } // Đảm bảo các trục có cùng tỷ lệ
    },
    margin: { l: 0, r: 0, b: 0, t: 40 } // Giảm lề để đồ thị lớn hơn
  };

  // 3. Trả về component Plot của react-plotly.js
  return (
    <Plot
      data={[
        // Dữ liệu cho quỹ đạo vệ tinh
        {
          x: xCoords,
          y: yCoords,
          z: zCoords,
          mode: 'lines',
          type: 'scatter3d',
          name: 'Satellite Orbit',
          line: {
            color: '#1f77b4', // Màu xanh
            width: 4
          }
        },
        // Dữ liệu cho "Trái Đất"
        {
            x: earth_x,
            y: earth_y,
            z: earth_z,
            mode: 'markers',
            type: 'scatter3d',
            name: 'Earth (Center)',
            marker: {
                color: '#2ca02c', // Màu xanh lá
                size: 8
            }
        }
      ]}
      layout={layout}
      style={{ width: '100%', height: '600px' }} // Đặt kích thước cho đồ thị
      config={{ responsive: true }} // Đảm bảo đồ thị co giãn theo cửa sổ
    />
  );
};

export default OrbitVisualizer;
