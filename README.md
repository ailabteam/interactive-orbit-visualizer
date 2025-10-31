# Interactive Orbit Visualizer - PoC #1

[![Vercel Deployment](https://img.shields.io/vercel/deployment/ailabteam/interactive-orbit-visualizer?style=for-the-badge&logo=vercel)](https://interactive-orbit-visualizer.vercel.app/)
[![GitHub stars](https://img.shields.io/github/stars/ailabteam/interactive-orbit-visualizer?style=for-the-badge&logo=github)](https://github.com/ailabteam/interactive-orbit-visualizer/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/ailabteam/interactive-orbit-visualizer?style=for-the-badge&logo=github)](https://github.com/ailabteam/interactive-orbit-visualizer/issues)

**Live Demo: [interactive-orbit-visualizer.vercel.app](https://interactive-orbit-visualizer.vercel.app/)**

---

## 🛰️ About This Project

This project is the first Proof-of-Concept (PoC) in a series dedicated to exploring the intersection of **AI, Quantum-inspired Algorithms, and Satellite Networks**. 

The **Interactive Orbit Visualizer** serves as the foundational layer, demonstrating the ability to:
1.  **Model complex systems:** Accurately calculate and visualize satellite trajectories based on classical orbital elements.
2.  **Build robust, scalable web applications:** Implement a full-stack Hybrid Architecture combining a high-performance compute backend with a modern, responsive frontend.
3.  **Provide an intuitive user interface:** Allow users to interactively manipulate orbital parameters and see the results in real-time 3D.

This PoC is the cornerstone for future, more advanced simulations, including constellation optimization, network anomaly forecasting, and federated learning orchestration.

---

## 🎥 Video Demonstration

A detailed walkthrough and demonstration of this PoC is available on YouTube. Click the thumbnail below to watch the video.

[![YouTube Demo Video Thumbnail](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

> **Note:** Please replace `YOUTUBE_VIDEO_ID_HERE` with the actual ID of your YouTube video. For a URL like `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ`.

---

## 🏛️ Architecture: A Hybrid Approach

This project is built on a powerful and scalable hybrid architecture designed to separate concerns and optimize performance.

 
> **Note:** You can create and upload a simple architecture diagram (like the one we discussed) to an image hosting service (e.g., Imgur) and replace the link above.

-   **Frontend (Presentation Layer):**
    -   **Tech:** React, TypeScript, Vite, Plotly.js
    -   **Deployment:** Vercel (Global CDN)
    -   **Role:** Provides a fast, responsive user interface for interaction and visualization.

-   **Proxy Gateway (Orchestration Layer):**
    -   **Tech:** Python, FastAPI
    -   **Deployment:** Vercel Serverless Functions
    -   **Role:** Acts as a secure and lightweight intermediary. It receives requests from the frontend, forwards them to the compute server, and returns the results.

-   **Compute Server (High-Performance Compute Layer):**
    -   **Tech:** Python, FastAPI, Poliastro, Astropy
    -   **Deployment:** Dedicated GPU Server (e.g., RTX 4090)
    -   **Role:** The powerhouse of the system. It handles all heavy calculations that are too large or long-running for a serverless environment.

---

## ✨ Features

-   **Interactive Sliders:** Control key orbital parameters like Semi-major Axis, Eccentricity, and Inclination.
-   **Real-time Calculation:** Sends parameters to a dedicated backend for on-the-fly orbit propagation.
-   **3D Visualization:** Renders the calculated orbit in a fully interactive 3D plot using Plotly.js.
-   **Detailed Explanations:** Provides clear, concise explanations of the PoC's purpose and the meaning of each orbital parameter.

---

## 🚀 Getting Started

### Prerequisites
-   Node.js and npm (for Frontend)
-   Conda or venv (for Python Backend)

### Frontend (Vercel)
The frontend is designed to be deployed directly from this repository to Vercel. The `vercel.json` file contains all necessary configuration.

### Backend (Compute Server)

1.  **Clone the repository (optional, you can just create the files):**
    ```bash
    # This code is NOT part of the repo to keep secrets safe.
    # Create a separate directory on your compute server.
    mkdir compute_server && cd compute_server
    ```
2.  **Create a Python environment and install dependencies:**
    ```bash
    conda create -n poc_visualizer python=3.10
    conda activate poc_visualizer
    pip install "fastapi[all]" poliastro astropy
    ```
3.  **Create and run `main.py`:**
    -   Copy the backend code into a `main.py` file.
    -   Ensure the CORS `origins` list includes your Vercel deployment URL.
4.  **Start the server:**
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8888
    ```
5.  **Configure Vercel Proxy:**
    -   In the `api/index.py` file within this repository, ensure the `COMPUTE_SERVER_URL` points to your server's public IP and port. Alternatively, set this as an Environment Variable on Vercel for better security.

---

## 🤝 Contributing & Collaboration

I'm open to collaborations in AI, quantum-inspired optimization, and satellite networking research. If you have ideas or want to contribute, please feel free to open an issue or a pull request.

---
_This project is part of a personal R&D initiative by [Do Phuc Hao](https://github.com/ailabteam)._
