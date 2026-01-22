# Architecture Diagram - Cloud Deployment

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GITHUB REPOSITORY                              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  frontend/   │  │    admin/    │  │   backend/    │              │
│  │  (React)     │  │  (React)     │  │  (Express)    │              │
│  │              │  │              │  │              │              │
│  │ vite.config  │  │ vite.config  │  │  server.js    │              │
│  │ vercel.json  │  │ vercel.json  │  │ railway.json  │              │
│  │ .env.example │  │ .env.example │  │ .env.example  │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                      │
│         └──────────────────┴──────────────────┘                      │
│                           │                                          │
│                           ▼                                          │
│                    git push to main                                  │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │           AUTOMATIC DEPLOY             │
        └───────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│    VERCEL     │  │    VERCEL     │  │    RAILWAY    │
│  Frontend     │  │  Admin Panel  │  │   Backend     │
│               │  │               │  │               │
│  React Build  │  │  React Build  │  │   Node.js     │
│  Production   │  │  Production   │  │  Production    │
│               │  │               │  │               │
│  Env:         │  │  Env:         │  │  Env:         │
│  VITE_API_URL │  │  VITE_API_URL │  │  PORT=3001    │
│               │  │               │  │  DATABASE_URL │
│               │  │               │  │  JWT_SECRET   │
│               │  │               │  │  CORS_ORIGIN  │
│               │  │               │  │  NODE_ENV=prod│
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
        │                  │                  │
        ▼                  ▼                  ▼
  https://mtrack-      https://mtrack-   https://mtrack-
  frontend.vercel.app  admin.vercel.app  api.railway.app
                                                         │
                                                         │
                                                         ▼
                                            ┌──────────────────┐
                                            │      NEON        │
                                            │   PostgreSQL     │
                                            │                  │
                                            │  DATABASE_URL    │
                                            │                  │
                                            │  Tables:         │
                                            │  - albums        │
                                            │  - songs         │
                                            │  - tracks        │
                                            │  - materials     │
                                            │  - admin_users   │
                                            └──────────────────┘

```

## Data Flow

```
┌─────────────┐
│  USER       │
└──────┬──────┘
       │
       ├─────────────────────────────────────┐
       │                                     │
       ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│  Frontend        │              │  Admin Panel     │
│  (Vercel)        │              │  (Vercel)        │
│                  │              │                  │
│  - Browse        │              │  - Login         │
│  - Play music    │              │  - Create        │
│  - Download      │              │  - Edit          │
│                  │              │  - Upload        │
└────────┬─────────┘              └────────┬─────────┘
         │                                 │
         │ VITE_API_URL                    │ VITE_API_URL
         │                                 │
         ▼                                 ▼
         └─────────────────┬───────────────┘
                           │
                           │ HTTPS
                           │
                           ▼
                    ┌──────────────────┐
                    │  Backend API     │
                    │  (Railway)       │
                    │                  │
                    │  /api/albums     │
                    │  /api/songs      │
                    │  /api/tracks     │
                    │  /api/auth       │
                    │  /api/materials  │
                    │                  │
                    │  /health         │
                    └────────┬─────────┘
                             │
                             │ DATABASE_URL
                             │
                             ▼
                      ┌──────────────┐
                      │  PostgreSQL   │
                      │  (Neon)       │
                      └──────────────┘
```

## File Upload Flow

```
┌──────────────┐
│ Admin Panel  │
└──────┬───────┘
       │
       │ FormData
       │ (file + data)
       │
       ▼
┌──────────────────┐
│  Backend API     │
│  (Railway)       │
│                  │
│  multer          │
│  middleware      │
│                  │
│  File stored in: │
│  backend/uploads/│
│  - covers/       │
│  - tracks/       │
│  - materials/    │
│                  │
│  ⚠️ EPHEMERAL    │
│  (lost on redeploy)
└──────────────────┘
```

## Authentication Flow

```
┌──────────────┐
│ Admin Panel  │
│ (Login form) │
└──────┬───────┘
       │
       │ POST /api/auth/login
       │ {username, password}
       │
       ▼
┌──────────────────┐
│  Backend API     │
│  (Railway)       │
│                  │
│  Verify password │
│  against         │
│  bcrypt hash     │
│                  │
│  Generate JWT    │
│  token           │
│                  │
│  Return token    │
└────────┬─────────┘
         │
         │ {token}
         │
         ▼
┌──────────────┐
│ Admin Panel  │
│              │
│ Store token  │
│ in localStorage
│              │
│ Use in all   │
│ future API   │
│ requests     │
└──────────────┘
```

## Development vs Production

### Development (Local)
```
┌─────────────┐
│ Frontend    │ port 3000
│ (localhost) │
└──────┬──────┘
       │ Vite Proxy
       ▼
┌─────────────┐
│ Backend     │ port 3001
│ (localhost) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │ port 5432
│ (Docker)    │
└─────────────┘
```

### Production (Cloud)
```
┌───────────────┐
│ Frontend      │ https://*.vercel.app
│ (Vercel)      │
└───────┬───────┘
        │ VITE_API_URL
        ▼
┌───────────────┐
│ Backend       │ https://*.railway.app
│ (Railway)     │
└───────┬───────┘
        │ DATABASE_URL
        ▼
┌───────────────┐
│ PostgreSQL    │ (Neon cloud)
│ (Neon)        │
└───────────────┘
```

## Environment Variables Mapping

| Variable | Dev | Production |
|----------|-----|------------|
| **Backend** | | |
| PORT | 3001 | 3001 (Railway) |
| NODE_ENV | development | production |
| DATABASE_URL | postgresql://... | postgresql://... (Neon) |
| JWT_SECRET | local-secret | strong-random-secret |
| CORS_ORIGIN | localhost:3000,3002 | *.vercel.app |
| | | |
| **Frontend** | | |
| VITE_API_URL | /api (proxy) | https://api.railway.app |
| | | |
| **Admin** | | |
| VITE_API_URL | /api (proxy) | https://api.railway.app |

## Deployment Triggers

```
Git Push to main
        │
        ├──────────────────────┐
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│ Frontend     │      │ Admin Panel  │
│ changes in   │      │ changes in   │
│ frontend/    │      │ admin/       │
│              │      │              │
│ Vercel       │      │ Vercel       │
│ Auto-deploy  │      │ Auto-deploy  │
└──────────────┘      └──────────────┘
        │                      │
        │                      │
        └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ Backend      │      │ No database  │
│ changes in   │      │ migrations   │
│ backend/     │      │ required     │
│              │      │              │
│ Railway      │      │ (Neon stores │
│ Auto-deploy  │      │ data)        │
└──────────────┘      └──────────────┘
```

## Security Layers

```
┌───────────────────────────────────────┐
│        Layer 1: HTTPS (Auto)          │
│  Vercel + Railway provide SSL         │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│        Layer 2: CORS                   │
│  Backend only accepts requests from    │
│  configured Vercel domains            │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│        Layer 3: JWT Auth              │
│  Admin endpoints require valid token  │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│        Layer 4: Input Validation      │
│  express-validator on all inputs      │
└───────────────┬───────────────────────┘
                │
┌───────────────▼───────────────────────┐
│        Layer 5: Password Hashing      │
│  bcryptjs with salt rounds=10         │
└───────────────────────────────────────┘
```

## Free Tier Limits

```
┌────────────────────────────────────────────┐
│           VERCEL (Hobby - FREE)            │
├────────────────────────────────────────────┤
│ Bandwidth:      100 GB/month               │
│ Build Output:   6 GB                       │
│ Functions:      Unlimited invocations     ││
│ Function Time:   10s/invocation            │
│ Deployments:    Unlimited                  │
│ Team Members:   Unlimited                  │
│ Custom Domains: Unlimited                  │
│────────────────────────────────────────────│
│ COST: $0/month                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│           RAILWAY (Free Tier)              │
├────────────────────────────────────────────┤
│ Credit:         $5/month                  │
│ RAM:            512 MB                    │
│ CPU:            1 core                    │
│ Storage:        1 GB (ephemeral)          │
│ Bandwidth:      100 GB/month              │
│────────────────────────────────────────────│
│ COST: $0-$5/month (depends on usage)     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│           NEON (Free Tier)                 │
├────────────────────────────────────────────┤
│ Storage:        0.5 GB                    │
│ Compute:        100 hours/month           │
│ Database:       3 branches                │
│ Schemas:        Unlimited                  │
│────────────────────────────────────────────│
│ COST: $0/month                            │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│              TOTAL ESTIMATE                │
├────────────────────────────────────────────┤
│ Monthly Cost:    $0 - $5                   │
│ Annual Cost:     $0 - $60                  │
│ Setup Time:      5-10 minutes              │
│ Maintenance:     Automatic (push to Git)   │
└────────────────────────────────────────────┘
```

## Next Steps for Scaling

```
Current (Free)            Upgrade Path
─────────────            ────────────────────────────────
Vercel Hobby        →    Vercel Pro ($20/mo)
                            - More bandwidth
                            - Faster builds
                            - Priority support

Railway Free        →    Railway Pro ($5-$20/mo)
                            - More RAM/CPU
                            - Persistent storage
                            - Better monitoring

Neon Free           →    Neon Pro ($19/mo)
                            - More storage
                            - More compute
                            - Better performance

┌────────────────────────────────────────────┐
│         OPTIONAL UPGRADES                  │
├────────────────────────────────────────────┤
│ • Railway Volume for file storage ($5/mo) │
│ • AWS S3/Cloudinary for uploads           │
│ • Sentry for error tracking               │
│ • Google Analytics for usage              │
│ • Custom domain ($10-15/year)            │
└────────────────────────────────────────────┘
```
