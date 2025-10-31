# api/index.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os

# --- CẤU HÌNH QUAN TRỌNG ---
# Lấy địa chỉ server tính toán từ biến môi trường của Vercel,
# nếu không có thì dùng giá trị IP công khai của bạn làm mặc định.
# Cổng là 8888 như chúng ta đã thống nhất.
COMPUTE_SERVER_URL = os.getenv("COMPUTE_SERVER_URL", "http://14.232.208.84:8888")

# --- Khởi tạo ứng dụng FastAPI ---
app = FastAPI(title="Vercel Proxy Gateway for Orbit Visualizer")

# --- Định nghĩa các API Endpoints ---
@app.get("/api/hello")
def get_hello():
    """Endpoint để kiểm tra xem Proxy có hoạt động không."""
    return JSONResponse(content={"message": f"Vercel Proxy is running and configured to connect to: {COMPUTE_SERVER_URL}"})

@app.post("/api/calculate-orbit")
async def proxy_calculate_orbit(request: Request):
    """
    Endpoint này hoạt động như một proxy:
    1. Nhận request từ frontend.
    2. Chuyển tiếp nó đến server tính toán nặng.
    3. Nhận kết quả từ server tính toán.
    4. Trả kết quả về cho frontend.
    """
    try:
        # Lấy dữ liệu JSON từ request gốc mà frontend gửi lên
        payload = await request.json()

        # Dùng httpx để gọi đến server tính toán với timeout 60 giây
        # Đây là khoảng thời gian tối đa mà Vercel chờ đợi phản hồi
        async with httpx.AsyncClient() as client:
            print(f"Forwarding request to: {COMPUTE_SERVER_URL}/calculate-orbit")
            response = await client.post(
                f"{COMPUTE_SERVER_URL}/calculate-orbit", 
                json=payload, 
                timeout=60.0
            )
        
        # Nếu server tính toán trả về lỗi (ví dụ: 400, 500), 
        # lệnh này sẽ raise một exception để khối catch bên dưới xử lý.
        response.raise_for_status()
        
        # Trả về dữ liệu thành công cho frontend
        print("Request to compute server successful. Returning response to client.")
        return JSONResponse(content=response.json())

    except httpx.HTTPStatusError as exc:
        # Bắt lỗi HTTP từ server tính toán và chuyển tiếp nó một cách chi tiết
        error_detail = f"Error from compute server ({exc.response.status_code}): {exc.response.text}"
        print(f"!!! {error_detail}")
        raise HTTPException(
            status_code=exc.response.status_code, 
            detail=error_detail
        )
    except httpx.RequestError as exc:
        # Bắt các lỗi liên quan đến kết nối mạng (ví dụ: không kết nối được server)
        error_detail = f"Could not connect to compute server: {exc}"
        print(f"!!! {error_detail}")
        raise HTTPException(
            status_code=503, # 503 Service Unavailable
            detail=error_detail
        )
    except Exception as exc:
        # Bắt các lỗi chung khác xảy ra trong proxy
        error_detail = f"An internal proxy error occurred: {str(exc)}"
        print(f"!!! {error_detail}")
        raise HTTPException(
            status_code=500, 
            detail=error_detail
        )
