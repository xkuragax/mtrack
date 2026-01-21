# Multi-Track Player Backend

Backend API for the multi-track audio player application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Initialize the database:
```bash
npm run init-db
```

This will create all necessary tables and a default admin user:
- Username: `admin`
- Password: `admin123`

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `POST /api/albums` - Create album (admin only)
- `PUT /api/albums/:id` - Update album (admin only)
- `DELETE /api/albums/:id` - Delete album (admin only)

### Songs
- `GET /api/albums/:albumId/songs` - Get songs by album
- `GET /api/songs/:id` - Get song by ID
- `POST /api/songs` - Create song (admin only)
- `PUT /api/songs/:id` - Update song (admin only)
- `DELETE /api/songs/:id` - Delete song (admin only)

### Tracks
- `GET /api/songs/:songId/tracks` - Get tracks for a song
- `POST /api/songs/:songId/tracks` - Upload track (admin only)
- `DELETE /api/tracks/:id` - Delete track (admin only)

### Materials
- `GET /api/songs/:songId/materials` - Get materials for a song
- `POST /api/songs/:songId/materials` - Add material (admin only)
- `DELETE /api/materials/:id` - Delete material (admin only)

## Database Schema

### Tables
- `albums` - Album information
- `songs` - Songs belonging to albums
- `tracks` - Audio stems/tracks for each song
- `song_materials` - Lyrics, chords, tabs for songs
- `admin_users` - Admin user accounts
