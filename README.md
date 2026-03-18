# Order Management System

A full-stack application for managing customer orders, featuring a Next.js frontend and a choice of Ruby on Rails or Node.js backends.

## Project Structure

- `frontend/`: Next.js application (React, CSS Variables for theming).
- `backend_ror/`: Ruby on Rails API.
- `backend/`: Node.js Express API.

---

## Running with Docker (Recommended)

This is the easiest way to get the entire system up and running with all dependencies.

### Option 1: Rails Backend + Frontend
This will run the Rails API on port `5001` and the Frontend on port `3001`.

1. **Setup Env**: Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
2. **Launch**:
   ```bash
   docker compose -f docker-compose.ror.yml up --build
   ```
3. **Access**:
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend API: [http://localhost:5001](http://localhost:5001)

### Option 2: Node Backend + Frontend
This will run the Node API on port `4000` and the Frontend on port `3000`.

1. **Launch**:
   ```bash
   docker compose up --build
   ```
2. **Access**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:4000](http://localhost:4000)

---

## Running Locally (Without Docker)

If you prefer to run the services individually on your host machine.

### 1. Backend Setup

#### Option A: Ruby on Rails (`backend_ror`)
**Prerequisites**: Ruby (3.2+ recommended), SQLite3.

1. Navigate to directory: `cd backend_ror`
2. Install dependencies: `bundle install`
3. Setup Database: `bin/rails db:prepare` (Creates db, runs migrations, and seeds data)
4. Start Server: `bin/rails s -p 5001`

#### Option B: Node.js (`backend`)
**Prerequisites**: Node.js, npm.

1. Navigate to directory: `cd backend`
2. Install dependencies: `npm install`
3. Start Server: `npm start` (Runs on port 4000 by default)

### 2. Frontend Setup
**Prerequisites**: Node.js, npm.

1. Navigate to directory: `cd frontend`
2. Install dependencies: `npm install`
3. Configure API URL: Create a `.env.local` if you need to point to a specific backend port.
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5001  # For Rails
   # OR
   NEXT_PUBLIC_API_URL=http://localhost:4000  # For Node
   ```
4. Start Server: `npm run dev`
5. Access: [http://localhost:3000](http://localhost:3000)

---

## Theming
The application supports a **Light Theme** (default) and can be customized via `frontend/app/globals.css` using CSS variables.
