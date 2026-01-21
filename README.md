# Multi-Track Audio Player with Admin Panel

A full-stack application for listening to multi-track audio (stems) with an admin panel for content management. **Optimized for MOBILE DEVICES** 📱

## Features

### User Interface (Frontend) - MOBILE-FIRST DESIGN 📱
- 📀 Browse albums with cover images (2-column grid on mobile)
- 🎵 View songs in each album
- 🎛️ Multi-track player with mobile-optimized controls:
  - Synchronized playback of multiple audio tracks
  - Individual volume control for each track (0-100%)
  - Large touch-friendly mute and solo buttons
  - Progress bar with touch-friendly seek functionality
  - Big play/pause controls designed for thumbs
  - Time display (current/total)
  - Large touch targets (44px minimum)
- 📄 Download/view song materials (lyrics, chords, tabs)
- 📱 **Mobile-first responsive design**
- 🖱️ **Touch-optimized interface** - all elements sized for fingers
- ⚡ **Fast loading** on mobile networks
- 🎯 **Vertical orientation priority** for smartphone usage

### Mobile Optimizations
- ✅ **Mobile-first CSS** - starts with mobile, scales up
- ✅ **Touch-friendly controls** - minimum 44px touch targets
- ✅ **Optimized for thumbs** - large buttons and sliders
- ✅ **No hover dependencies** - touch feedback instead
- ✅ **Vertical layout priority** - optimized for portrait mode
- ✅ **Reduced motion support** - accessibility compliant
- ✅ **High DPI display support** - crisp graphics on Retina
- ✅ **Pull-to-refresh prevention** - better mobile UX

### Admin Panel
- 🔐 Secure authentication (JWT)
- 📀 Album management (create, edit, delete)
- 🎵 Song management (create, edit, delete)
- 🎛️ Multi-track management (upload, delete audio files)
- 📄 Materials management (upload/link lyrics, chords, tabs)

### Backend API
- RESTful API with Express.js
- PostgreSQL database
- File upload support (images & audio)
- JWT authentication for admin routes

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Admin Panel**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Audio**: Web Audio API
- **Authentication**: JWT

## Project Structure

```
├── backend/          # Backend API (Express + PostgreSQL)
├── frontend/         # User-facing application (React)
├── admin/            # Admin panel (React)
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

### 1. Database Setup

Create a PostgreSQL database:
```bash
createdb multitrack_player
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize database
npm run init-db

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

Default admin credentials:
- Username: `admin`
- Password: `admin123`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Admin Panel Setup

```bash
cd admin
npm install
npm run dev
```

Admin panel will run on `http://localhost:3002`

## API Endpoints

### Public Endpoints
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `GET /api/albums/:albumId/songs` - Get songs by album
- `GET /api/songs/:id` - Get song by ID
- `GET /api/songs/:songId/tracks` - Get tracks for a song
- `GET /api/songs/:songId/materials` - Get materials for a song

### Admin Endpoints (require JWT token)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `POST /api/albums` - Create album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `POST /api/songs` - Create song
- `PUT /api/songs/:id` - Update song
- `DELETE /api/songs/:id` - Delete song
- `POST /api/songs/:songId/tracks` - Upload track
- `DELETE /api/tracks/:id` - Delete track
- `POST /api/songs/:songId/materials` - Add material
- `DELETE /api/materials/:id` - Delete material

## Database Schema

### Tables
- `albums` - Album information (title, description, cover image)
- `songs` - Songs belonging to albums
- `tracks` - Audio stems/tracks for each song
- `song_materials` - Lyrics, chords, tabs for songs
- `admin_users` - Admin user accounts

## Usage

### For End Users
1. Navigate to `http://localhost:3000`
2. Browse albums
3. Select an album to view songs
4. Click "Play" on a song to open the multi-track player
5. Use volume sliders, mute, and solo buttons to mix tracks
6. Download materials (lyrics, chords, tabs) if available

### For Admins
1. Navigate to `http://localhost:3002`
2. Login with admin credentials
3. Manage albums, songs, tracks, and materials
4. Upload cover images and audio files
5. Add links to materials (Google Drive, etc.)

## File Upload

The backend stores uploaded files in the `uploads/` directory:
- `uploads/covers/` - Album cover images
- `uploads/tracks/` - Audio track files
- `uploads/materials/` - Materials (lyrics, chords, tabs)

For production, consider using a cloud storage service like AWS S3 or Cloudinary.

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Use a production PostgreSQL database
3. Set a strong `JWT_SECRET`
4. Configure CORS for your frontend domains
5. Use a process manager like PM2

### Frontend & Admin
1. Build the applications:
   ```bash
   npm run build
   ```
2. Serve the `dist/` folder with a static file server (Nginx, Vercel, Netlify, etc.)

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
