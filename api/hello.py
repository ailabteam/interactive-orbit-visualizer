from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/hello")
async def handler(request: Request):
    name = request.query_params.get("name", "Hao")
    content = {"message": f"Hello, {name}! This is a message from Vercel's Python Serverless Function."}
    return JSONResponse(content=content)
