# api/index.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Khởi tạo ứng dụng FastAPI. 
# Vercel sẽ tự động chuyển tất cả request /api/* đến ứng dụng 'app' này.
app = FastAPI()

# Định nghĩa endpoint cho /api/hello
@app.get("/api/hello")
def get_hello():
    content = {"message": "Success! This message is from the Python backend router."}
    return JSONResponse(content=content)

# (Trong tương lai, bạn sẽ thêm các endpoint khác ở đây)
# @app.post("/api/optimize-orbit")
# def optimize_orbit_endpoint(data: dict):
#     # Gọi hàm tính toán của bạn ở đây
#     result = your_poliastro_function(data)
#     return JSONResponse(content=result)

# Vercel sẽ tìm và sử dụng biến 'app' này
