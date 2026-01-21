# File Structure

Complete file structure of the Multi-Track Player project.

```
multitrack-player/
│
├── 📄 Documentation Files
│   ├── README.md              # Main project overview
│   ├── QUICKSTART.md          # Quick start guide
│   ├── API.md                 # API documentation
│   ├── FEATURES.md            # Features list
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── PROJECT_SUMMARY.md     # Project summary
│   └── FILE_STRUCTURE.md      # This file
│
├── 🛠️ Setup & Configuration
│   ├── .gitignore             # Git ignore rules
│   ├── docker-compose.yml     # PostgreSQL Docker setup
│   ├── setup.sh               # Automated setup script
│   └── verify.sh              # Project verification script
│
├── 🔙 Backend (Node.js + Express + PostgreSQL)
│   └── backend/
│       ├── package.json       # Dependencies
│       ├── .env               # Environment variables
│       ├── .env.example       # Environment template
│       ├── README.md          # Backend documentation
│       │
│       ├── src/
│       │   ├── server.js      # Entry point
│       │   │
│       │   ├── config/
│       │   │   └── db.js      # Database connection
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.js    # JWT authentication
│       │   │   └── upload.js  # File upload (Multer)
│       │   │
│       │   ├── controllers/
│       │   │   ├── authController.js      # Auth logic
│       │   │   ├── albumController.js     # Album CRUD
│       │   │   ├── songController.js      # Song CRUD
│       │   │   ├── trackController.js     # Track management
│       │   │   └── materialController.js  # Materials management
│       │   │
│       │   ├── routes/
│       │   │   ├── auth.js       # Auth routes
│       │   │   ├── albums.js     # Album routes
│       │   │   ├── songs.js      # Song routes
│       │   │   ├── tracks.js     # Track routes
│       │   │   └── materials.js  # Material routes
│       │   │
│       │   └── scripts/
│       │       └── initDb.js     # Database initialization
│       │
│       └── uploads/              # File storage
│           ├── covers/           # Album covers
│           ├── tracks/           # Audio files
│           └── materials/        # Song materials
│
├── 🎨 Frontend (React + TypeScript + Vite)
│   └── frontend/
│       ├── package.json          # Dependencies
│       ├── vite.config.ts        # Vite configuration
│       ├── tsconfig.json         # TypeScript config
│       ├── tsconfig.node.json    # Node TypeScript config
│       ├── index.html            # HTML template
│       │
│       └── src/
│           ├── main.tsx          # Entry point
│           ├── App.tsx           # Main component
│           ├── App.css           # Global styles
│           │
│           ├── types/
│           │   └── index.ts      # TypeScript interfaces
│           │
│           ├── services/
│           │   └── api.ts        # API client
│           │
│           ├── hooks/
│           │   └── useMultiTrackPlayer.ts  # Player hook
│           │
│           ├── components/
│           │   ├── AlbumCard.tsx          # Album card
│           │   ├── SongList.tsx           # Song list
│           │   ├── MultiTrackPlayer.tsx   # Audio player
│           │   └── SongMaterials.tsx      # Materials display
│           │
│           └── pages/
│               ├── AlbumsPage.tsx         # Albums catalog
│               ├── AlbumDetailPage.tsx    # Album details
│               └── SongPlayerPage.tsx     # Player page
│
└── 👤 Admin Panel (React + TypeScript + Vite)
    └── admin/
        ├── package.json          # Dependencies
        ├── vite.config.ts        # Vite configuration
        ├── tsconfig.json         # TypeScript config
        ├── tsconfig.node.json    # Node TypeScript config
        ├── index.html            # HTML template
        │
        └── src/
            ├── main.tsx          # Entry point
            ├── App.tsx           # Main component
            ├── App.css           # Admin styles
            │
            ├── types/
            │   └── index.ts      # TypeScript interfaces
            │
            ├── services/
            │   └── api.ts        # API client with auth
            │
            ├── context/
            │   └── AuthContext.tsx  # Auth state management
            │
            ├── components/
            │   ├── Layout.tsx       # Admin layout
            │   └── ProtectedRoute.tsx  # Route protection
            │
            └── pages/
                ├── LoginPage.tsx          # Login form
                ├── AlbumsPage.tsx         # Album management
                ├── AlbumFormPage.tsx      # Album create/edit
                ├── SongsPage.tsx          # Song management
                ├── SongFormPage.tsx       # Song create/edit
                ├── TracksPage.tsx         # Track upload/manage
                └── MaterialsPage.tsx      # Materials management
```

## File Count Summary

- **Total TypeScript Files:** ~30
- **Total JavaScript Files:** ~10
- **Total Configuration Files:** ~10
- **Total Documentation Files:** 7
- **Total Directories:** ~25

## Key Technology Files

### Backend
- **Entry:** `backend/src/server.js`
- **Database:** `backend/src/config/db.js`
- **Init Script:** `backend/src/scripts/initDb.js`

### Frontend
- **Entry:** `frontend/src/main.tsx`
- **Router:** `frontend/src/App.tsx`
- **Player:** `frontend/src/hooks/useMultiTrackPlayer.ts`

### Admin
- **Entry:** `admin/src/main.tsx`
- **Router:** `admin/src/App.tsx`
- **Auth:** `admin/src/context/AuthContext.tsx`

## Configuration Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | PostgreSQL container setup |
| `vite.config.ts` | Vite bundler configuration |
| `tsconfig.json` | TypeScript compiler options |
| `.env` | Environment variables |
| `.gitignore` | Git ignore patterns |

## Scripts

| Script | Purpose |
|--------|---------|
| `setup.sh` | Automated project setup |
| `verify.sh` | Verify project structure |

## Documentation

| File | Content |
|------|---------|
| `README.md` | Project overview and setup |
| `QUICKSTART.md` | Getting started guide |
| `API.md` | REST API reference |
| `FEATURES.md` | Feature list and status |
| `DEPLOYMENT.md` | Production deployment |
| `PROJECT_SUMMARY.md` | Executive summary |
| `FILE_STRUCTURE.md` | This file |
