# Quick Start: Cloud Deployment

This is the fastest way to get your mtrack application running in the cloud for FREE.

## 5-Minute Setup

### 1. Set up Database (Neon) - 2 minutes

1. Go to [https://neon.tech](https://neon.tech) and sign up (free)
2. Click "New Project" → Give it a name → "Create Project"
3. Copy the **Connection string** from the dashboard

### 2. Deploy Backend (Railway) - 2 minutes

1. Go to [https://railway.app](https://railway.app) and sign up (free)
2. Click "New Project" → "Deploy from GitHub repo" → Select your repo → "Deploy Now"
3. Add these environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=<paste-neon-connection-string>
   JWT_SECRET=generate-a-random-string-here
   CORS_ORIGIN=https://*.vercel.app
   ```
4. Open Console → Run `cd backend && npm run init-db`
5. Copy your Railway URL (e.g., `https://mtrack-api.railway.app`)

### 3. Deploy Frontend (Vercel) - 1 minute

1. Go to [https://vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New" → "Project" → Select your repo
3. Set **Root Directory** to: `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```
5. Click "Deploy"
6. Wait for deployment, then click "Redeploy" to pick up env vars

### 4. Deploy Admin (Vercel) - 1 minute

1. Go to Vercel → "Add New" → "Project"
2. Select same repo → Set **Root Directory** to: `admin`
3. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-url.railway.app
   ```
4. Click "Deploy"
5. Wait for deployment, then click "Redeploy"

### 5. Test Your Apps

- **Frontend:** Open your Vercel frontend URL
- **Admin:** Open your Vercel admin URL and login with:
  - Username: `admin`
  - Password: `admin123`
- **API:** Visit `https://your-railway-url.railway.app/health`

## That's It! 🎉

You now have:
- ✅ Frontend live on Vercel
- ✅ Admin panel live on Vercel
- ✅ Backend API live on Railway
- ✅ PostgreSQL database on Neon
- ✅ Automatic updates when you push to GitHub

## Making Changes

```bash
git add .
git commit -m "Your changes"
git push origin main
```

All three parts deploy automatically!

## Need More Details?

See the full deployment guide: [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)

## Common Issues

**"CORS error"**: Make sure Railway CORS_ORIGIN includes your Vercel URLs
**"Database connection failed"**: Check DATABASE_URL in Railway variables
**"Admin can't login"**: Run `npm run init-db` in Railway console

## Important: Change Default Password

After deployment, change the admin password:

1. Go to Neon console → SQL Editor
2. Run: `UPDATE admin_users SET password_hash = '$2a$10$new-hashed-password' WHERE username = 'admin';`
3. Generate new hash with: `node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('new-password', 10));"`
