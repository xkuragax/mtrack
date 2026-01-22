# Cloud Deployment Checklist

Use this checklist when deploying the Multi-Track Player to Vercel, Railway, and Neon.

## Prerequisites

- [ ] GitHub repository with the latest code pushed to `main` branch
- [ ] Accounts created on:
  - [ ] [Neon](https://neon.tech) (free tier)
  - [ ] [Railway](https://railway.app) (free tier)
  - [ ] [Vercel](https://vercel.com) (free tier)

## Phase 1: Database Setup (Neon)

- [ ] Sign in to Neon
- [ ] Create new project
- [ ] Name the database `mtrack`
- [ ] Copy the **DATABASE_URL** connection string
  - Format: `postgresql://user:password@xxx.neon.tech/mtrack`
- [ ] Save this URL - you'll need it for Railway

## Phase 2: Backend Deployment (Railway)

- [ ] Sign in to Railway
- [ ] Click **New Project** → **Deploy from GitHub repo**
- [ ] Authorize Railway to access your GitHub
- [ ] Select the `xkuragax/mtrack` repository
- [ ] Configure the deployment:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add Environment Variables:
  ```
  PORT=3001
  DATABASE_URL=<paste-your-neon-url-here>
  JWT_SECRET=<generate-a-32-char-random-string>
  NODE_ENV=production
  CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
  UPLOAD_DIR=uploads
  ```
- [ ] Click **Deploy**
- [ ] Wait for deployment to complete (green checkmark)
- [ ] Copy the Railway URL (e.g., `https://your-api.up.railway.app`)
- [ ] Initialize the database:
  - [ ] Go to Railway Console → Your Project
  - [ ] Click **Terminal** tab
  - [ ] Run command: `npm run init-db`
  - [ ] Verify "Database initialized successfully!" message
- [ ] Test the health endpoint:
  - [ ] Open `https://your-api.up.railway.app/health`
  - [ ] Should see: `{"status":"OK","message":"Server is running"}`

## Phase 3: Frontend Deployment (Vercel)

- [ ] Sign in to Vercel
- [ ] Click **Add New** → **Project**
- [ ] Import GitHub repository
- [ ] Configure project settings:
  - [ ] Framework Preset: **Vite** (should auto-detect)
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm ci`
- [ ] Add Environment Variable:
  ```
  VITE_API_URL=https://your-api.up.railway.app/api
  ```
- [ ] Click **Deploy**
- [ ] Wait for deployment to complete
- [ ] Copy the Vercel URL (e.g., `https://your-frontend.vercel.app`)
- [ ] Test the frontend:
  - [ ] Open the URL in browser
  - [ ] Should see the Multi-Track Player interface
  - [ ] May show "No albums available" initially (that's OK)

## Phase 4: Admin Panel Deployment (Vercel)

- [ ] Click **Add New** → **Project** in Vercel
- [ ] Import the same GitHub repository
- [ ] Configure project settings:
  - [ ] Framework Preset: **Vite**
  - [ ] Root Directory: `admin`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Install Command: `npm ci`
- [ ] Add Environment Variable:
  ```
  VITE_API_URL=https://your-api.up.railway.app/api
  ```
- [ ] Click **Deploy**
- [ ] Wait for deployment to complete
- [ ] Copy the Admin Vercel URL (e.g., `https://your-admin.vercel.app`)
- [ ] Test the admin panel:
  - [ ] Open the URL in browser
  - [ ] Should see login form
  - [ ] Login with: username `admin`, password `admin123`

## Phase 5: Final Configuration

- [ ] Go back to Railway project
- [ ] Update `CORS_ORIGIN` with actual Vercel URLs:
  ```
  CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
  ```
- [ ] Railway will automatically redeploy (wait for it)

## Phase 6: End-to-End Testing

### Frontend Tests
- [ ] Open frontend URL
- [ ] Page loads without errors
- [ ] Browser console shows no errors (F12 → Console)

### Admin Tests
- [ ] Open admin URL
- [ ] Login with admin/admin123
- [ ] Create a test album:
  - [ ] Click "Add Album"
  - [ ] Enter title: "Test Album"
  - [ ] Upload a cover image
  - [ ] Click "Save"
  - [ ] Verify album appears in list
- [ ] Add a song to the album:
  - [ ] Click on "Test Album"
  - [ ] Click "Add Song"
  - [ ] Enter song title: "Test Song"
  - [ ] Upload audio files for tracks
  - [ ] Click "Save"
  - [ ] Verify song appears in list

### Cross-Verification
- [ ] Go back to frontend URL
- [ ] Refresh the page
- [ ] Verify "Test Album" is now visible
- [ ] Click on the album
- [ ] Verify "Test Song" and its tracks are visible
- [ ] Test playing tracks (audio should work)

## Phase 7: Documentation

- [ ] Save all URLs securely:
  - [ ] Frontend: `________________________`
  - [ ] Admin: `________________________`
  - [ ] API: `________________________`
  - [ ] Database: Neon console saved
  - [ ] Railway: `________________________`
  - [ ] Vercel Dashboard: `________________________`

- [ ] Update README with deployment URLs
- [ ] Share access with team members (if applicable)

## Phase 8: Verify Automatic Deployments

- [ ] Make a small change to code (e.g., update a text)
- [ ] Commit and push to `main` branch
- [ ] Verify Railway redeploys automatically
- [ ] Verify both Vercel projects redeploy automatically
- [ ] Test that changes appear in live sites

## Common Issues & Solutions

### CORS Errors
- **Problem**: Browser shows CORS error in console
- **Solution**: Update `CORS_ORIGIN` in Railway to include exact Vercel URLs (no trailing slashes)

### Build Failures
- **Problem**: Deployment fails on Vercel/Railway
- **Solution**:
  - Check logs in platform dashboard
  - Ensure `package.json` has all dependencies
  - Verify environment variables are set correctly
  - Make sure branch is `main`

### Database Connection Issues
- **Problem**: API returns database connection errors
- **Solution**:
  - Verify `DATABASE_URL` is correct in Railway
  - Check Neon dashboard - database should be "Active"
  - Run `npm run init-db` again in Railway terminal

### File Upload Not Working
- **Problem**: Can't upload files in admin panel
- **Solution**:
  - This is expected - Railway storage is ephemeral
  - Files will be lost on redeploy
  - For production, implement cloud storage (AWS S3, Cloudinary)

### Login Not Working
- **Problem**: Can't login to admin panel
- **Solution**:
  - Ensure database was initialized with `npm run init-db`
  - Verify default admin user exists:
    ```sql
    SELECT * FROM admin_users WHERE username = 'admin';
    ```
  - Reset password if needed using Railway terminal

## Post-Deployment Checklist

- [ ] Change default admin password in production
- [ ] Set up monitoring (Railway has built-in metrics)
- [ ] Configure backups (Neon has automatic backups)
- [ ] Review and update CORS origins if adding more domains
- [ ] Consider implementing rate limiting for API
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Document the deployment process for future reference

## Security Reminders

- [ ] `JWT_SECRET` must be a strong, random string (32+ characters)
- [ ] Never commit `.env` files to git
- [ ] Use environment variables for all sensitive data
- [ ] Keep dependencies updated
- [ ] Enable HTTPS (automatically provided by Vercel/Railway)
- [ ] Review and restrict CORS origins to only your domains

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Project README**: Check for additional help

## Next Steps After Deployment

1. **Customize Branding**: Update app title, colors, logo
2. **Add Real Content**: Import your actual albums and songs
3. **Set Up Analytics**: Add Google Analytics or similar
4. **Monitor Usage**: Check Railway and Vercel dashboards regularly
5. **Plan for Scale**: Consider cloud storage for files as you grow

---

## Quick Reference

### Environment Variables Summary

**Railway (Backend)**:
```
PORT=3001
DATABASE_URL=<neon-url>
JWT_SECRET=<32-char-secret>
NODE_ENV=production
CORS_ORIGIN=https://frontend.vercel.app,https://admin.vercel.app
UPLOAD_DIR=uploads
```

**Vercel (Frontend)**:
```
VITE_API_URL=https://api.railway.app/api
```

**Vercel (Admin)**:
```
VITE_API_URL=https://api.railway.app/api
```

### Important Commands

**Railway Terminal**:
```bash
npm run init-db  # Initialize database
npm start        # Start server (for testing)
```

**Local Development**:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Admin
cd admin
npm run dev
```
