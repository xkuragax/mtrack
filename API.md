# API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Albums

### Get All Albums
```http
GET /api/albums
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Album Title",
    "description": "Album description",
    "cover_url": "/uploads/covers/12345.jpg",
    "created_at": "2024-01-21T10:00:00.000Z",
    "updated_at": "2024-01-21T10:00:00.000Z"
  }
]
```

### Get Album by ID
```http
GET /api/albums/:id
```

**Response:**
```json
{
  "id": 1,
  "title": "Album Title",
  "description": "Album description",
  "cover_url": "/uploads/covers/12345.jpg",
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T10:00:00.000Z"
}
```

### Create Album (Admin Only)
```http
POST /api/albums
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): string
- `description` (optional): string
- `cover` (optional): image file

**Response:**
```json
{
  "id": 1,
  "title": "New Album",
  "description": "Description",
  "cover_url": "/uploads/covers/12345.jpg",
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T10:00:00.000Z"
}
```

### Update Album (Admin Only)
```http
PUT /api/albums/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (optional): string
- `description` (optional): string
- `cover` (optional): image file

**Response:**
```json
{
  "id": 1,
  "title": "Updated Album",
  "description": "Updated description",
  "cover_url": "/uploads/covers/67890.jpg",
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T11:00:00.000Z"
}
```

### Delete Album (Admin Only)
```http
DELETE /api/albums/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Album deleted successfully"
}
```

## Songs

### Get Songs by Album
```http
GET /api/albums/:albumId/songs
```

**Response:**
```json
[
  {
    "id": 1,
    "album_id": 1,
    "title": "Song Title",
    "duration": 240,
    "created_at": "2024-01-21T10:00:00.000Z",
    "updated_at": "2024-01-21T10:00:00.000Z"
  }
]
```

### Get Song by ID
```http
GET /api/songs/:id
```

**Response:**
```json
{
  "id": 1,
  "album_id": 1,
  "title": "Song Title",
  "duration": 240,
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T10:00:00.000Z"
}
```

### Create Song (Admin Only)
```http
POST /api/songs
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "album_id": 1,
  "title": "New Song",
  "duration": 240
}
```

**Response:**
```json
{
  "id": 1,
  "album_id": 1,
  "title": "New Song",
  "duration": 240,
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T10:00:00.000Z"
}
```

### Update Song (Admin Only)
```http
PUT /api/songs/:id
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Song",
  "duration": 300
}
```

**Response:**
```json
{
  "id": 1,
  "album_id": 1,
  "title": "Updated Song",
  "duration": 300,
  "created_at": "2024-01-21T10:00:00.000Z",
  "updated_at": "2024-01-21T11:00:00.000Z"
}
```

### Delete Song (Admin Only)
```http
DELETE /api/songs/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Song deleted successfully"
}
```

## Tracks

### Get Tracks by Song
```http
GET /api/songs/:songId/tracks
```

**Response:**
```json
[
  {
    "id": 1,
    "song_id": 1,
    "name": "Vocals",
    "audio_url": "/uploads/tracks/12345.mp3",
    "order": 0,
    "created_at": "2024-01-21T10:00:00.000Z"
  },
  {
    "id": 2,
    "song_id": 1,
    "name": "Guitar",
    "audio_url": "/uploads/tracks/67890.mp3",
    "order": 1,
    "created_at": "2024-01-21T10:00:00.000Z"
  }
]
```

### Upload Track (Admin Only)
```http
POST /api/songs/:songId/tracks
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `audio` (required): audio file
- `name` (required): string
- `order` (optional): number

**Response:**
```json
{
  "id": 1,
  "song_id": 1,
  "name": "Vocals",
  "audio_url": "/uploads/tracks/12345.mp3",
  "order": 0,
  "created_at": "2024-01-21T10:00:00.000Z"
}
```

### Delete Track (Admin Only)
```http
DELETE /api/tracks/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Track deleted successfully"
}
```

## Materials

### Get Materials by Song
```http
GET /api/songs/:songId/materials
```

**Response:**
```json
[
  {
    "id": 1,
    "song_id": 1,
    "type": "lyrics",
    "url": "/uploads/materials/lyrics.txt",
    "created_at": "2024-01-21T10:00:00.000Z"
  },
  {
    "id": 2,
    "song_id": 1,
    "type": "chords",
    "url": "https://drive.google.com/file/d/xxx",
    "created_at": "2024-01-21T10:00:00.000Z"
  }
]
```

### Add Material (Admin Only)
```http
POST /api/songs/:songId/materials
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data (Option 1 - Upload File):**
- `type` (required): "lyrics" | "chords" | "tabs"
- `file` (required): file

**Form Data (Option 2 - External URL):**
- `type` (required): "lyrics" | "chords" | "tabs"
- `url` (required): string

**Response:**
```json
{
  "id": 1,
  "song_id": 1,
  "type": "lyrics",
  "url": "/uploads/materials/lyrics.txt",
  "created_at": "2024-01-21T10:00:00.000Z"
}
```

### Delete Material (Admin Only)
```http
DELETE /api/materials/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Material deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

## File Upload Limits

- **Cover Images**: 5 MB, formats: JPEG, PNG, WebP
- **Audio Tracks**: 50 MB, formats: MP3, WAV, OGG
- **Materials**: 10 MB, all formats

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Admin endpoints require JWT token in Authorization header
3. Multipart form data is used for file uploads
4. Cascading deletes: deleting an album deletes its songs, tracks, and materials
5. File uploads are stored in the `uploads/` directory
6. Static files are served at `/uploads/` path
