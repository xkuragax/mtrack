# Quick Start Guide

This guide will help you get the Multi-Track Player up and running in minutes.

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose (for PostgreSQL)
- npm

## Quick Setup

### 1. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432 with:
- Username: `postgres`
- Password: `password`
- Database: `multitrack_player`

### 2. Setup and Start Backend

```bash
cd backend
npm install
npm run init-db  # Creates tables and admin user
npm run dev      # Starts backend on http://localhost:3001
```

Default admin credentials:
- **Username**: `admin`
- **Password**: `admin123`

### 3. Setup and Start Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev      # Starts frontend on http://localhost:3000
```

### 4. Setup and Start Admin Panel (in a new terminal)

```bash
cd admin
npm install
npm run dev      # Starts admin panel on http://localhost:3002
```

## Access the Applications

- **User Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3002
- **Backend API**: http://localhost:3001

## First Steps

1. Open the admin panel at http://localhost:3002
2. Login with `admin` / `admin123`
3. Create your first album
4. Add songs to the album
5. Upload audio tracks for each song
6. Add materials (lyrics, chords, tabs)
7. Visit http://localhost:3000 to see your work!

## Stopping the Application

```bash
# Stop PostgreSQL
docker-compose down

# Stop the other services with Ctrl+C in their respective terminals
```

## Troubleshooting

### Database connection errors
- Make sure PostgreSQL is running: `docker ps`
- Check if port 5432 is available

### Port already in use
- Frontend (3000): Change port in `frontend/vite.config.ts`
- Admin (3002): Change port in `admin/vite.config.ts`
- Backend (3001): Change PORT in `backend/.env`

### Can't login to admin panel
- Make sure backend is running
- Check if `npm run init-db` was successful
- Try resetting password by running `npm run init-db` again
