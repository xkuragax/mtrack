# Cloud Deployment Instructions

This document provides the exact steps to deploy the Multi-Track Player to Vercel, Railway, and Neon.

## Prerequisites

✅ GitHub repository with this branch merged to `main`
✅ Accounts on: [Neon](https://neon.tech), [Railway](https://railway.app), [Vercel](https://vercel.com)

---

## Step 1: Create Neon Database

1. Go to https://neon.tech and sign in
2. Click **"New Project"**
3. Enter a project name (e.g., "mtrack")
4. Click **"Create Project"**
5. Copy the **Connection String** from the dashboard
6. Add `/mtrack` at the end of the connection string
   - Example: `postgresql://user:password@ep-xxx.aws.neon.tech/neondb/mtrack?sslmode=require`
7. Save this as your `DATABASE_URL`

---

## Step 2: Deploy Backend to Railway

1. Go to https://railway.app and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub
4. Select the `xkuragax/mtrack` repository
5. Configure deployment settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add the following Environment Variables (click "Variables" tab):
   ```
   PORT=3001
   DATABASE_URL=<paste-your-neon-connection-string-from-step-1>
   JWT_SECRET=<generate-a-32-character-random-string-here>
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
   UPLOAD_DIR=uploads
   ```
   **Important**: Generate a strong `JWT_SECRET` using: `openssl rand -base64 32` or an online generator
7. Click **"Deploy"**
8. Wait for deployment to complete (you'll see a green checkmark)
9. Copy the Railway URL (e.g., `https://your-api.up.railway.app`)
10. Initialize the database:
    - Go to Railway Console → Your Project
    - Click the **"Terminal"** tab
    - Run command: `npm run init-db`
    - You should see: "Database initialized successfully!"

---

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
5. Add Environment Variable:
   - Click "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://your-api.up.railway.app/api` (replace with your actual Railway URL)
6. Click **"Deploy"**
7. Wait for deployment to complete
8. Copy the Vercel URL (e.g., `https://your-frontend.vercel.app`)

---

## Step 4: Deploy Admin Panel to Vercel

1. Click **"Add New"** → **"Project"** in Vercel
2. Import the same GitHub repository
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`
4. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-api.up.railway.app/api` (same as frontend)
5. Click **"Deploy"**
6. Wait for deployment to complete
7. Copy the Admin Vercel URL (e.g., `https://your-admin.vercel.app`)

---

## Step 5: Update Railway CORS

1. Go back to https://railway.app
2. Open your project
3. Click the **"Variables"** tab
4. Update the `CORS_ORIGIN` variable with your actual Vercel URLs:
   ```
   CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
   ```
5. Railway will automatically redeploy

---

## Step 6: Test Your Deployment

### Test Frontend
1. Open your frontend URL in a browser
2. You should see the Multi-Track Player interface
3. It may show "No albums available" (this is normal)

### Test Admin Panel
1. Open your admin URL in a browser
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Create a test album:
   - Click **"Add Album"**
   - Enter title: "Test Album"
   - Upload a cover image (any JPG/PNG)
   - Click **"Save"**
4. Add a test song:
   - Click on "Test Album"
   - Click **"Add Song"**
   - Enter title: "Test Song"
   - Upload at least one audio file (MP3/WAV)
   - Click **"Save"**

### Verify Integration
1. Go back to your frontend URL
2. Refresh the page
3. You should now see "Test Album"
4. Click on the album
5. You should see "Test Song" and be able to play audio

---

## Step 7: Change Admin Password (Security!)

**Don't skip this step!** The default password is public.

### Option 1: Via Railway Terminal
1. Go to Railway Console → Your Project → Terminal
2. Run Node REPL:
   ```bash
   node
   ```
3. Generate a new password hash:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('your-new-password', 10);
   console.log(hash);
   ```
4. Exit REPL: `.exit`
5. Update the database:
   ```bash
   psql $DATABASE_URL -c "UPDATE admin_users SET password_hash = '<paste-hash-here>' WHERE username = 'admin';"
   ```

### Option 2: Via PostgreSQL Client
1. Connect to Neon database via any PostgreSQL client
2. Run:
   ```sql
   UPDATE admin_users SET password_hash = '$2a$10$...' WHERE username = 'admin';
   ```
3. Use bcrypt to generate the hash first

---

## Deployment Complete! 🎉

You now have:
- 🌐 **Frontend**: `https://your-frontend.vercel.app`
- 🔧 **Admin**: `https://your-admin.vercel.app`
- 🔌 **API**: `https://your-api.up.railway.app`
- 🗄️ **Database**: Neon PostgreSQL

### How to Update Your Site

Simply push changes to the `main` branch on GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

All three platforms will automatically redeploy within 1-2 minutes.

---

## Troubleshooting

### CORS Errors in Browser
**Symptom**: Console shows "CORS policy" errors

**Solution**:
1. Check Railway Variables → CORS_ORIGIN
2. Make sure it contains exact Vercel URLs (no trailing slashes)
3. Separate URLs with commas, no spaces

### Build Failures
**Symptom**: Deployment fails on Vercel or Railway

**Solution**:
1. Check deployment logs in platform dashboard
2. Verify all dependencies are in package.json
3. Ensure environment variables are set correctly

### Database Connection Errors
**Symptom**: API returns 500 errors about database

**Solution**:
1. Verify DATABASE_URL in Railway is correct
2. Check Neon dashboard - database should be "Active"
3. Run `npm run init-db` again in Railway terminal

### Can't Login to Admin
**Symptom**: Login fails with incorrect credentials

**Solution**:
1. Run `npm run init-db` in Railway terminal
2. Verify admin user exists:
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM admin_users;"
   ```

### Uploads Not Persisting
**Symptom**: Uploaded files disappear after redeploy

**Explanation**: This is expected behavior on Railway (ephemeral storage)

**Solution**: For production, integrate cloud storage (AWS S3, Cloudinary). See DEPLOYMENT.md for details.

---

## Environment Variables Reference

### Railway (Backend)
```bash
PORT=3001
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/mtrack?sslmode=require
JWT_SECRET=generate-32-char-random-string
NODE_ENV=production
CORS_ORIGIN=https://frontend.vercel.app,https://admin.vercel.app
UPLOAD_DIR=uploads
```

### Vercel (Frontend)
```bash
VITE_API_URL=https://api.railway.app/api
```

### Vercel (Admin)
```bash
VITE_API_URL=https://api.railway.app/api
```

---

## Next Steps

### Recommended
1. ✅ Change default admin password
2. ✅ Upload your actual content
3. ✅ Customize branding (logo, colors, title)
4. ✅ Add custom domain to Vercel
5. ✅ Set up analytics (Google Analytics, etc.)

### Optional (For Production)
1. Implement cloud storage for uploads (AWS S3, Cloudinary)
2. Set up error tracking (Sentry)
3. Configure rate limiting
4. Set up automated backups beyond Neon defaults
5. Add monitoring and alerting

---

## Platform Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **Neon Console**: https://console.neon.tech

---

## Support

- **Quick Issues**: [CLOUD_DEPLOYMENT_CHECKLIST.md](./CLOUD_DEPLOYMENT_CHECKLIST.md) → Troubleshooting
- **Architecture**: [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)
- **Platform Docs**:
  - Vercel: https://vercel.com/docs
  - Railway: https://docs.railway.app
  - Neon: https://neon.tech/docs

---

**Total Deployment Time**: ~30 minutes
**Total Cost**: $0 (free tiers)
