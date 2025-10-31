from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Import các thư viện cần thiết từ poliastro và astropy
from astropy import units as u
from poliastro.bodies import Earth
from poliastro.twobody import Orbit
import numpy as np

# --- Định nghĩa cấu trúc dữ liệu đầu vào ---
# Sử dụng Pydantic để validate dữ liệu từ frontend
class OrbitParams(BaseModel):
    semi_major_axis: float  # in km
    eccentricity: float
    inclination: float      # in degrees
    raan: float             # in degrees
    argp: float             # in degrees
    true_anomaly: float     # in degrees

# --- Khởi tạo ứng dụng FastAPI ---
app = FastAPI()

# --- Định nghĩa các API Endpoints ---
@app.get("/api/hello")
def get_hello():
    content = {"message": "Success! This message is from the Python backend router."}
    return JSONResponse(content=content)

@app.post("/api/calculate-orbit")
def calculate_orbit_endpoint(params: OrbitParams):
    """
    Nhận các tham số quỹ đạo, tính toán và trả về chuỗi vị trí.
    """
    try:
        # 1. Tạo đối tượng quỹ đạo từ các tham số đầu vào
        orbit = Orbit.from_classical(
            Earth,
            params.semi_major_axis * u.km,
            params.eccentricity * u.one,
            params.inclination * u.deg,
            params.raan * u.deg,
            params.argp * u.deg,
            params.true_anomaly * u.deg
        )

        # 2. Lấy chu kỳ quỹ đạo
        period_seconds = orbit.period.to(u.s).value

        # 3. Tạo một chuỗi các điểm thời gian để lấy mẫu vị trí
        # Lấy 200 điểm trong một chu kỳ
        times = np.linspace(0, orbit.period, 200)

        # 4. Lấy tọa độ tại các điểm thời gian đó
        coords = orbit.propagate_many(times).represent_as('cartesian')
        
        # 5. Chuyển đổi tọa độ thành một danh sách các dictionary để gửi đi
        positions = [
            {"x": x, "y": y, "z": z}
            for x, y, z in zip(coords.x.to(u.km).value, coords.y.to(u.km).value, coords.z.to(u.km).value)
        ]

        # 6. Tạo object kết quả và trả về
        result = {
            "period": period_seconds,
            "positions": positions
        }
        return JSONResponse(content=result)

    except Exception as e:
        # Bắt lỗi và trả về một thông báo lỗi rõ ràng
        return JSONResponse(status_code=400, content={"error": str(e)})
