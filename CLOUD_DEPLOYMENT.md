# Cloud Deployment Guide - Vercel + Railway + Neon

This guide covers deploying the Multi-Track Audio Player to cloud infrastructure using 100% free services.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐
│   Frontend      │     │   Admin Panel    │     │   Backend    │
│   (Vercel)      │────▶│   (Vercel)       │────▶│  (Railway)   │
│                 │     │                  │     │              │
│   React App     │     │   React App      │     │   Express    │
└─────────────────┘     └──────────────────┘     └──────┬───────┘
                                                        │
                                                        ▼
                                                 ┌──────────────┐
                                                 │ PostgreSQL   │
                                                 │   (Neon)     │
                                                 └──────────────┘
```

## Prerequisites

1. GitHub account with the repository
2. Vercel account (free)
3. Railway account (free - $5 monthly credit)
4. Neon account (free tier)

---

## Step 1: Set up PostgreSQL on Neon

### 1.1 Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 1.2 Get Database Connection String

1. In your Neon dashboard, select your project
2. Click "Connection Details"
3. Copy the **Connection string** (looks like: `postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb...`)

**Save this connection string** - you'll need it for Railway.

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to [https://railway.app](https://railway.app)
2. Sign up for a free account (GitHub login recommended)

### 2.2 Create New Project

1. Click "New Project" → "Deploy from GitHub repo"
2. Select your mtrack repository
3. Click "Deploy Now"

### 2.3 Configure Environment Variables

1. In your Railway project, go to the "Variables" tab
2. Add the following environment variables:

```
PORT=3001
NODE_ENV=production
DATABASE_URL=<your-neon-connection-string>
JWT_SECRET=<generate-a-secure-random-string>
CORS_ORIGIN=https://*.vercel.app
```

**Important:**
- Replace `<your-neon-connection-string>` with the string from Step 1
- Generate a secure JWT_SECRET using: `openssl rand -base64 32`
- CORS_ORIGIN allows requests from any Vercel deployment

### 2.4 Initialize Database

1. Click on your backend service in Railway
2. Go to the "Logs" tab
3. Click the "Console" tab
4. In the console, run:

```bash
cd backend
npm run init-db
```

This will create all tables and the default admin user.

### 2.5 Get Backend URL

1. In Railway, go to your backend service
2. Click the "Settings" tab
3. Copy the **Domain** (e.g., `https://your-app.railway.app`)

**Save this URL** - you'll need it for Vercel deployments.

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up for a free account (GitHub login recommended)

### 3.2 Import Project for Frontend

1. Click "Add New" → "Project"
2. Select your mtrack repository
3. Set **Root Directory** to: `frontend`
4. Set **Framework Preset** to: `Vite`
5. Click "Deploy"

### 3.3 Configure Environment Variables

After deployment:

1. Go to your project → Settings → Environment Variables
2. Add the following variable:

```
VITE_API_URL=https://your-railway-app.railway.app
```

Replace `your-railway-app.railway.app` with your actual Railway backend URL from Step 2.5.

### 3.4 Redeploy

1. Go to the "Deployments" tab
2. Click the three dots on the latest deployment → "Redeploy"
3. This picks up the new environment variable

### 3.5 Get Frontend URL

After redeployment, you'll see a URL like:
`https://your-frontend-name.vercel.app`

---

## Step 4: Deploy Admin Panel to Vercel

### 4.1 Create New Vercel Project

1. Go to Vercel → "Add New" → "Project"
2. Select the same mtrack repository
3. Set **Root Directory** to: `admin`
4. Set **Framework Preset** to: `Vite`
5. Set **Project Name** to: `mtrack-admin` (or similar)
6. Click "Deploy"

### 4.2 Configure Environment Variables

After deployment:

1. Go to project → Settings → Environment Variables
2. Add the following variable:

```
VITE_API_URL=https://your-railway-app.railway.app
```

Use the same Railway backend URL as in Step 3.3.

### 4.3 Redeploy

1. Go to the "Deployments" tab
2. Click "Redeploy" on the latest deployment

### 4.4 Get Admin URL

You'll see a URL like:
`https://mtrack-admin.vercel.app`

---

## Step 5: Update CORS on Railway (if needed)

If you deployed Vercel projects first and got specific URLs:

1. Go back to Railway → Backend service → Variables
2. Update `CORS_ORIGIN` to include your exact Vercel URLs:

```
CORS_ORIGIN=https://your-frontend.vercel.app,https://mtrack-admin.vercel.app
```

3. Railway will automatically redeploy with the new configuration.

---

## Step 6: Test the Deployment

### 6.1 Test Backend API

Open in browser or use curl:
```
https://your-railway-app.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### 6.2 Test Frontend

1. Open: `https://your-frontend.vercel.app`
2. Should load and show albums (if you added any)
3. No console errors in browser DevTools

### 6.3 Test Admin Panel

1. Open: `https://mtrack-admin.vercel.app`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. Try creating an album or uploading a track

---

## Step 7: Change Default Admin Password (Important!)

### 7.1 Connect to Neon Console

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click "SQL Editor" or "Console"

### 7.2 Run Update Query

```sql
UPDATE admin_users
SET password_hash = '$2a$10$your-new-hashed-password'
WHERE username = 'admin';
```

**To generate a new password hash, run locally:**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-new-password', 10));"
```

Or use an online bcrypt generator for testing.

---

## Making Changes & Updates

### Automatic Deployments

All deployments are now automatic when you push to the main branch:

1. **Backend changes:**
   - Make changes in `backend/` folder
   - Commit and push to GitHub
   - Railway auto-redeploys

2. **Frontend changes:**
   - Make changes in `frontend/` folder
   - Commit and push to GitHub
   - Vercel auto-redeploys

3. **Admin changes:**
   - Make changes in `admin/` folder
   - Commit and push to GitHub
   - Vercel auto-redeploys

### Database Migrations

If you modify the database schema:

1. Update `backend/src/scripts/initDb.js`
2. In Railway Console, run:
   ```bash
   cd backend
   npm run init-db
   ```
3. Or use Neon SQL Editor to run specific migration queries

---

## Environment Variables Reference

### Backend (Railway)
```env
PORT=3001
NODE_ENV=production
DATABASE_URL=postgres://user:pass@host/db
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://*.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-api.railway.app
```

### Admin (Vercel)
```env
VITE_API_URL=https://your-api.railway.app
```

---

## Troubleshooting

### Issue: CORS Errors

**Solution:** Check Railway CORS_ORIGIN variable includes your Vercel domains:
```
CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
```

### Issue: Database Connection Failed

**Solution:**
1. Verify DATABASE_URL is correct in Railway
2. Check Neon dashboard - is the database active?
3. Check Railway logs for detailed error

### Issue: API Returns 404

**Solution:**
1. Check VITE_API_URL in Vercel environment variables
2. Verify Railway backend is deployed and running
3. Test `/health` endpoint directly

### Issue: Uploads Not Working

**Current Limitation:**
- File uploads work but files are stored in Railway's ephemeral filesystem
- Files are lost when Railway redeloys (typically after inactivity)

**Solutions for Production:**
1. Use persistent storage (Railway Volume - not free)
2. Switch to cloud storage (AWS S3, Cloudinary, etc.)
3. Consider using Railway's disk service for small projects

### Issue: Admin Login Not Working

**Solution:**
1. Verify database was initialized: `npm run init-db`
2. Check Railway logs for errors
3. Try resetting admin password via Neon SQL Editor

---

## Security Best Practices

### 1. JWT Secret
- Use a strong, random JWT_SECRET (32+ characters)
- Generate with: `openssl rand -base64 32`
- Never commit secrets to GitHub

### 2. Database URL
- Neon DATABASE_URL is already secure
- Don't share it publicly
- Rotate it if compromised

### 3. CORS
- Be specific with CORS_ORIGIN in production
- Don't use `*` or overly wild patterns
- Limit to your exact Vercel domains

### 4. Admin Password
- Change default admin password immediately
- Use a strong password
- Consider 2FA for critical applications

---

## Costs & Limits

### Free Tier Limits

**Vercel (Hobby):**
- Unlimited deployments
- 100GB bandwidth/month
- 6GB build output
- No server timeout (frontend only)

**Railway (Free):**
- $5/month credit
- Up to 512MB RAM
- Up to 1 CPU
- Ephemeral storage (lost on redeploy)

**Neon (Free):**
- 0.5GB storage
- 100 hours of compute/month
- 3 branches

### Estimated Monthly Costs

For a small project with moderate traffic:
- **Vercel:** $0 (Hobby plan is sufficient)
- **Railway:** $0-$10 (depending on usage)
- **Neon:** $0 (Free tier covers most use cases)

---

## Monitoring & Logs

### Vercel
- View logs: Project → Deployments → Select deployment → "View Function Logs"
- Real-time: Project → Deployments → "View Logs"

### Railway
- View logs: Project → Service → "Logs" tab
- Real-time console: Project → Service → "Console" tab

### Neon
- View logs: Project → "Logs" tab
- SQL queries: Project → "SQL Editor"

---

## Next Steps

### Recommended Improvements

1. **Add Custom Domain**
   - Purchase a domain
   - Configure in Vercel and Railway
   - Set up SSL (automatic on both platforms)

2. **Implement Persistent Storage**
   - Add Railway Volume (~$5/month)
   - Or migrate to S3/Cloudinary for file uploads

3. **Add Monitoring**
   - Set up error tracking (Sentry)
   - Add analytics (Google Analytics)
   - Monitor uptime (UptimeRobot)

4. **Database Backups**
   - Enable Neon automated backups
   - Export regular backups manually

5. **CI/CD Improvements**
   - Add automated tests
   - Deploy on PR to preview environments
   - Add staging environment

---

## Summary URLs

After completing this guide, you should have:

- **Frontend:** `https://your-frontend.vercel.app`
- **Admin:** `https://your-admin.vercel.app`
- **Backend API:** `https://your-app.railway.app`
- **Database:** Neon PostgreSQL console

All three parts update automatically when you push to GitHub main branch!

---

## Quick Reference: Making Updates

```bash
# 1. Make changes to code
# Edit files in backend/, frontend/, or admin/

# 2. Commit changes
git add .
git commit -m "Your change description"

# 3. Push to GitHub
git push origin main

# 4. Watch deployments:
# - Railway: auto-redeploys backend
# - Vercel: auto-redeploys frontend and admin
```

That's it! No manual deployment steps required.
