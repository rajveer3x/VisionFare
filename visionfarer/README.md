# VisionFare

VisionFare is a production-grade travel price predictor. It utilizes advanced machine learning techniques to help users forecast and track travel fares, providing an all-in-one platform for comprehensive flight discovery. This monorepo includes a modern and fast React frontend, a resilient Node.js backend, and a Python-powered AI service.

## Current Status
**Phase 1 Complete** — Mock data pipeline live. External APIs and AI microservice coming in Phase 2 and 3.

## Architecture

```text
       +-----------------------+
       |   React Frontend      |
       |   (Vite, Tailwind)    |
       +-----------+-----------+
                   |
                   v
       +-----------------------+        +=======================+
       |   Node/Express API    |------->| [Placeholder Phase 2] |
       |   (search, auth, db)  |        |    RapidAPI (Mock)    |
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
   - Open `/server/.env` and fill in your `MONGO_URI` and `JWT_SECRET`.
   - In `/client`, copy `.env.example` to `.env`.

> **Note on Client Proxies:** The frontend uses Vite. Communication with the backend is handled natively by Axios pointing to the `VITE_API_URL` environment variable (defaulting to `http://localhost:5000`). Make sure your server port matches this configuration.

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
