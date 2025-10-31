// src/components/OrbitVisualizer.tsx

// Import các thành phần cần thiết
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';

// --- Định nghĩa các Kiểu dữ liệu (Interfaces) ---

// Kiểu cho một điểm vị trí 3D
interface Position {
  x: number;
  y: number;
  z: number;
}

// Kiểu cho các props mà component này sẽ nhận từ component cha (App.tsx)
interface OrbitVisualizerProps {
  positions: Position[];
}


// --- Component Chính ---

const OrbitVisualizer = ({ positions }: OrbitVisualizerProps) => {

  // === BƯỚC 1: CHUẨN BỊ DỮ LIỆU CHO PLOTLY ===

  // Tách mảng các object vị trí thành 3 mảng riêng biệt cho mỗi trục
  // Plotly cần dữ liệu theo từng trục để vẽ
  const xCoords = positions.map(p => p.x);
  const yCoords = positions.map(p => p.y);
  const zCoords = positions.map(p => p.z);

  // Tạo một điểm dữ liệu duy nhất ở tâm (0,0,0) để tượng trưng cho Trái Đất
  const earthTrace: Data = {
    x: [0],
    y: [0],
    z: [0],
    mode: 'markers',
    type: 'scatter3d',
    name: 'Earth (Center)',
    marker: {
      color: '#2ca02c', // Màu xanh lá cây
      size: 8,
      symbol: 'circle'
    }
  };

  // Tạo dữ liệu cho đường quỹ đạo
  const orbitTrace: Data = {
    x: xCoords,
    y: yCoords,
    z: zCoords,
    mode: 'lines',
    type: 'scatter3d',
    name: 'Satellite Orbit',
    line: {
      color: '#1f77b4', // Màu xanh dương
      width: 4
    }
  };


  // === BƯỚC 2: CẤU HÌNH GIAO DIỆN ĐỒ THỊ (LAYOUT) ===
  
  // Khai báo biến layout tuân thủ đúng kiểu Partial<Layout> của Plotly
  const layout: Partial<Layout> = {
    // Sửa lỗi: Tiêu đề phải là một object có thuộc tính 'text'
    title: {
      text: 'Satellite Orbit (3D Visualization)'
    },
    autosize: true,
    // Cấu hình cho cảnh 3D
    scene: {
      xaxis: { title: 'X (km)' },
      yaxis: { title: 'Y (km)' },
      zaxis: { title: 'Z (km)' },
      // Đảm bảo các trục có cùng tỷ lệ để quỹ đạo không bị méo
      aspectratio: { x: 1, y: 1, z: 1 },
      camera: {
        eye: {x: 1.5, y: 1.5, z: 1.5} // Đặt góc nhìn ban đầu
      }
    },
    // Giảm lề để đồ thị chiếm nhiều không gian hơn
    margin: { l: 0, r: 0, b: 0, t: 40 },
    // Tắt chú thích (legend) nếu muốn để giao diện sạch hơn
    showlegend: true 
  };


  // === BƯỚC 3: RENDER COMPONENT PLOT ===

  return (
    <Plot
      // Truyền vào một mảng chứa tất cả các "dấu vết" (traces) cần vẽ
      data={[orbitTrace, earthTrace]}
      layout={layout}
      // Đặt kích thước cho khung chứa đồ thị
      style={{ width: '100%', height: '600px' }}
      // Cấu hình bổ sung, ví dụ: làm cho đồ thị co giãn theo kích thước cửa sổ
      config={{ responsive: true }}
    />
  );
};

export default OrbitVisualizer;
