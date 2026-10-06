# Data Science Lab Digital Library - Node.js + Express + MongoDB Backend

Shared multi-user database-backed REST API for the Data Science Lab Digital Library application.

---

## 🛠️ Architecture Overview

```
React Frontend (Vite)
       │
       │ REST API (HTTP GET / POST / PUT / DELETE)
       ▼
Node.js + Express Backend
       │
       ▼
MongoDB Atlas (Shared Cloud Database)
```

---

## 🚀 Quick Start (Local Setup)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend/` directory (you can copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ds_lab_db
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

> **MongoDB Atlas Users**: Replace `MONGODB_URI` with your connection string from MongoDB Atlas dashboard.

### 3. Run Backend API Server
```bash
# Development Mode (auto-reloads with nodemon)
npm run dev

# Production Mode
npm start
```

Backend will start at: `http://localhost:5000`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| **GET** | `/api/health` | Backend status check (`{ "status": "ok" }`) |
| **GET** | `/api/experiments` | Get all experiments (auto-seeds defaults if DB is empty) |
| **GET** | `/api/experiments/:id` | Get single experiment by ID |
| **POST** | `/api/experiments` | Create a new experiment |
| **PUT** | `/api/experiments/:id` | Update experiment, sub-experiments, code, or output |
| **DELETE** | `/api/experiments/:id` | Delete main experiment |
| **DELETE** | `/api/experiments/:id/sub/:subId` | Delete sub-experiment |
| **POST** | `/api/experiments/batch-migrate` | Batch upload custom local storage experiments to MongoDB |

---

## ☁️ MongoDB Atlas Connection Setup

1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Cluster (Shared FREE Tier available).
3. Go to **Database Access** $\rightarrow$ Add a new database user (Username & Password).
4. Go to **Network Access** $\rightarrow$ Add IP Address (`0.0.0.0/0` to allow access from anywhere or Render server IP).
5. Click **Connect** $\rightarrow$ **Drivers** $\rightarrow$ Copy the connection string format:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/ds_lab_db?retryWrites=true&w=majority
   ```
6. Update `MONGODB_URI` in `backend/.env`.

---

## 🌐 Production Deployment Guide

### Deploying Backend to Render
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) $\rightarrow$ **New Web Service**.
3. Connect your repository.
4. Set **Root Directory**: `backend`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. In **Environment Variables**, add:
   - `MONGODB_URI` = `<Your MongoDB Atlas connection string>`
   - `CLIENT_URL` = `https://<YOUR-VERCEL-APP>.vercel.app`
   - `PORT` = `5000`
8. Click **Deploy Web Service**.

### Deploying Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) $\rightarrow$ **New Project**.
2. Select your repository.
3. In **Environment Variables**, add:
   - `VITE_API_URL` = `https://<YOUR-RENDER-BACKEND>.onrender.com/api`
4. Click **Deploy**.

---

## 🔄 Multi-User Data Synchronization Flow

When **User A** creates an experiment or edits code:
1. React sends `POST /api/experiments` or `PUT /api/experiments/:id` to the Express backend.
2. Express updates the document inside **MongoDB Atlas**.
3. When **User B** or **User C** opens or refreshes the site from any computer or browser, their app issues `GET /api/experiments`, fetching the latest shared data from MongoDB Atlas!
