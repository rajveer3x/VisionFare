# VisionFare

VisionFare is a production-grade travel price predictor. It utilizes advanced machine learning techniques to help users forecast and track travel fares, providing an all-in-one platform for comprehensive flight discovery. This monorepo includes a modern and fast React frontend, a resilient Node.js backend, and a Python-powered AI service.

## Current Status
**Phase 2 Complete** — Live price data from external APIs. Redis caching active. AI microservice integration pending (Phase 3).

## Architecture

```text
       +-----------------------+
       |   React Frontend      |
       |   (Vite, Tailwind)    |
       +-----------+-----------+
                   |
                   v
       +-----------------------+        +=======================+
       |   Node/Express API    |------->|      RapidAPI         |
       |   (search, auth, db)  |        |  (Live Travel Data)   |
       +-----------+-----------+        +=======================+
                   |
                   v                            [Placeholder Phase 3]
       +-----------------------+                +===================+
       |       MongoDB         |                |   AI Microservice |
       |    (Atlas Cluster)    |<---------------|  (Python FastAPI) |
       +-----------------------+                +===================+
```

## Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd visionfarer
   ```

2. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Configure Environment Variables:**
   - In `/server`, copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `/server/.env` and ensure `MONGO_URI`, `JWT_SECRET`, `RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `REDIS_URL`, and `FRONTEND_ORIGIN` are provided.
   - In `/client`, copy `.env.example` to `.env`.

> **Note on Client Proxies:** The frontend uses Vite. Communication with the backend is handled natively by Axios pointing to the `VITE_API_URL` environment variable (defaulting to `http://localhost:5000/api`). 

## Caching Strategy
VisionFare limits expensive and rate-capped 3rd-party aggregate queries by aggressively routing searches through a 900 second (15-minute) TTL cache hosted via ioredis. The infrastructure degrades safely falling back to live network querying dynamically.

## Running Locally

To start the development environment:

**Run the backend server:**
```bash
cd server
npm run dev
```

**Run the frontend server:**
```bash
cd client
npm run dev
```
