# Quick Cloud Setup Guide

This is a condensed guide for deploying the Multi-Track Player to cloud platforms with free tiers.

## Platform Links

- **Neon** (Database): https://neon.tech
- **Railway** (Backend): https://railway.app
- **Vercel** (Frontend/Admin): https://vercel.com

## Deployment Flow

```
1. Neon PostgreSQL → Get DATABASE_URL
     ↓
2. Railway (Backend) → Deploy with DATABASE_URL → Get API_URL
     ↓
3. Vercel (Frontend) → Deploy with API_URL
     ↓
4. Vercel (Admin) → Deploy with API_URL
     ↓
5. Update Railway CORS → Add Vercel URLs
```

## Quick Steps

### Step 1: Neon Database (5 minutes)

1. Sign up at https://neon.tech
2. Click "New Project"
3. Name it anything, click "Create Project"
4. Copy the **Connection String** (looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)
5. Add `/mtrack` at the end: `...neondb/mtrack`
6. Save this as `DATABASE_URL`

### Step 2: Railway Backend (10 minutes)

1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Authorize Railway, select your repo
4. In "Build Settings":
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add these Environment Variables:
   ```
   PORT=3001
   DATABASE_URL=<paste-from-step-1>
   JWT_SECRET=<generate-32-random-chars>
   NODE_ENV=production
   CORS_ORIGIN=https://placeholder.vercel.app,https://placeholder-admin.vercel.app
   UPLOAD_DIR=uploads
   ```
6. Click "Deploy"
7. Wait for green checkmark
8. Copy the Railway URL (e.g., `https://mtrack-api.up.railway.app`)
9. In Railway Console → Your Project → Terminal, run: `npm run init-db`

### Step 3: Vercel Frontend (5 minutes)

1. Sign up at https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repo
4. In "Build & Development Settings":
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://mtrack-api.up.railway.app/api
   ```
6. Click "Deploy"
7. Wait for completion, copy the Vercel URL (e.g., `https://mtrack-frontend.vercel.app`)

### Step 4: Vercel Admin (5 minutes)

1. Click "Add New" → "Project"
2. Import the same GitHub repo
3. In "Build & Development Settings":
   - Framework Preset: Vite
   - Root Directory: `admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://mtrack-api.up.railway.app/api
   ```
5. Click "Deploy"
6. Wait for completion, copy the Admin URL (e.g., `https://mtrack-admin.vercel.app`)

### Step 5: Final Config (2 minutes)

1. Go back to Railway
2. Update `CORS_ORIGIN` with actual URLs:
   ```
   CORS_ORIGIN=https://mtrack-frontend.vercel.app,https://mtrack-admin.vercel.app
   ```
3. Railway auto-redeploys

## Test Your Deployment

### Test Frontend
1. Open `https://mtrack-frontend.vercel.app`
2. Should see the Multi-Track Player UI

### Test Admin
1. Open `https://mtrack-admin.vercel.app`
2. Login: username `admin`, password `admin123`
3. Create a test album and song

### Verify
1. Go back to frontend URL
2. Refresh
3. See your test album

## Done! 🎉

You now have:
- 🗄️ **Database**: Neon PostgreSQL (free)
- 🔌 **API**: Railway backend (free)
- 🌐 **Frontend**: Vercel (free)
- 🔧 **Admin**: Vercel (free)

Any `git push` to main will auto-deploy all components.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error in browser | Check `CORS_ORIGIN` in Railway has exact Vercel URLs |
| Build fails | Check logs in Vercel/Railway dashboard |
| Can't login | Run `npm run init-db` in Railway terminal again |
| API returns 500 | Check `DATABASE_URL` is correct in Railway |
| Uploads not working | Normal - Railway storage resets on redeploy. Use cloud storage for production. |

## Important Notes

- All services use **free tiers** (generous limits for small projects)
- Default admin password: `admin123` - **change this in production**
- Railway uploads are **ephemeral** - lost on redeploy
- For persistent storage, integrate AWS S3 or Cloudinary
- HTTPS is automatic on all platforms

## Next Steps

1. Change default admin password
2. Add your actual content
3. Customize branding (logo, colors)
4. Set up analytics (optional)
5. Monitor usage in platform dashboards

## Support

- Full checklist: [CLOUD_DEPLOYMENT_CHECKLIST.md](./CLOUD_DEPLOYMENT_CHECKLIST.md)
- Detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app
- Neon docs: https://neon.tech/docs
