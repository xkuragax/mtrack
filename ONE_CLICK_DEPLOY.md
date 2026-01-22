# 🚀 One-Click Cloud Deployment

Deploy the Multi-Track Player to the cloud in minutes!

## 🎯 Quick Deploy (Recommended)

### Step 1: Deploy Database (Neon)

1. Click here: [![Deploy to Neon](https://img.shields.io/badge/Deploy%20to-Neon-00E699?style=for-the-badge&logo=postgresql)](https://console.neon.tech)
2. Sign up/Login (free, no credit card)
3. Click **Create Project**
4. Name it: `mtrack`
5. Copy the **Connection String** (starts with `postgresql://`)
6. Save it somewhere safe - you'll need it in Step 2

### Step 2: Deploy Backend (Railway)

1. Click here: [![Deploy on Railway](https://img.shields.io/badge/Deploy%20on-Railway-0B0D0E?style=for-the-badge&logo=railway)](https://railway.app/new/template?template=https://github.com/xkuragax/mtrack&envs=DATABASE_URL,JWT_SECRET,NODE_ENV,CORS_ORIGIN,UPLOAD_DIR&DATABASE_URLDesc=PostgreSQL+connection+string+from+Neon&JWT_SECRETDesc=Random+32+character+secret&NODE_ENVDefault=production&CORS_ORIGINDefault=*&UPLOAD_DIRDefault=uploads)
2. Sign up/Login with GitHub (free, no credit card)
3. Click **Deploy from GitHub repo**
4. Select repository: `xkuragax/mtrack`
5. Set **Root Directory**: `backend`
6. Add environment variables:
   - `DATABASE_URL`: Paste from Step 1
   - `JWT_SECRET`: Generate at [RandomKeygen](https://randomkeygen.com/) (use Fort Knox Passwords)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `*` (we'll update this later)
   - `PORT`: Leave empty (Railway assigns automatically)
   - `UPLOAD_DIR`: `uploads`
7. Click **Deploy**
8. Wait for deployment to complete (~2 minutes)
9. Click on the service → **Settings** → **Generate Domain**
10. Copy the URL (e.g., `https://mtrack-production.up.railway.app`)
11. **Initialize Database**:
    - Go to your Railway project
    - Click on the service
    - Go to **Terminal** tab (or use **Deploy logs**)
    - Wait for the service to be running
    - In the terminal, run: `npm run init-db`
    - You should see: "Database initialized successfully!"

### Step 3: Deploy Frontend (Vercel)

1. Click here: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xkuragax/mtrack&env=VITE_API_URL&envDescription=Backend+API+URL&project-name=mtrack-frontend&repository-name=mtrack&root-directory=frontend)
2. Sign up/Login with GitHub (free, no credit card)
3. Click **Import Project**
4. Select repository: `xkuragax/mtrack`
5. Configure project:
   - **Project Name**: `mtrack-frontend`
   - **Framework**: Vite (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Railway URL from Step 2 + `/api` (e.g., `https://mtrack-production.up.railway.app/api`)
7. Click **Deploy**
8. Wait for deployment (~1 minute)
9. Copy your frontend URL (e.g., `https://mtrack-frontend.vercel.app`)

### Step 4: Deploy Admin Panel (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select the same repository: `xkuragax/mtrack`
4. Configure project:
   - **Project Name**: `mtrack-admin`
   - **Framework**: Vite (auto-detected)
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Same as Step 3 (e.g., `https://mtrack-production.up.railway.app/api`)
6. Click **Deploy**
7. Wait for deployment (~1 minute)
8. Copy your admin URL (e.g., `https://mtrack-admin.vercel.app`)

### Step 5: Update CORS (Final Step!)

1. Go back to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your `mtrack` project
3. Click on the backend service
4. Go to **Variables** tab
5. Find `CORS_ORIGIN` and click **Edit**
6. Update the value with your actual URLs from Steps 3 & 4:
   ```
   https://mtrack-frontend.vercel.app,https://mtrack-admin.vercel.app
   ```
   (Replace with your actual URLs, no spaces, comma-separated)
7. Click **Save**
8. Railway will automatically redeploy (~1 minute)

## ✅ Test Your Deployment

### Test Frontend
1. Open your frontend URL (from Step 3)
2. You should see the Multi-Track Player interface
3. It may show "No albums available" - that's normal!

### Test Admin Panel
1. Open your admin URL (from Step 4)
2. You should see a login form
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123`
4. You should see the admin dashboard
5. **⚠️ Important**: Change this password immediately!

### Test API
1. Open your backend URL + `/health` (e.g., `https://mtrack-production.up.railway.app/health`)
2. You should see: `{"status":"OK","message":"Server is running"}`

## 🎉 You're Done!

Your application is now live! Here's what you have:

- **Frontend**: Where users listen to music
- **Admin Panel**: Where you upload albums and songs
- **Backend API**: Powers both frontend and admin
- **Database**: Stores all your data

### Next Steps

1. **Change admin password** (in admin panel settings)
2. **Upload your first album**:
   - Go to admin panel
   - Click "Add Album"
   - Fill in details and upload cover image
   - Click "Save"
3. **Add songs to the album**:
   - Click on the album you created
   - Click "Add Song"
   - Upload audio files for tracks
   - Click "Save"
4. **View on frontend**:
   - Go to your frontend URL
   - Your album and songs should appear!

## 🔄 Automatic Updates

All three services are now connected to your GitHub repository:
- Push to `main` branch → Everything redeploys automatically
- No manual deployment needed after initial setup

## 📝 Save These URLs

Create a file with your deployment URLs:

```
Frontend: https://your-frontend.vercel.app
Admin: https://your-admin.vercel.app
API: https://your-backend.railway.app
```

## ❓ Troubleshooting

### Can't login to admin
- Make sure you ran `npm run init-db` in Railway terminal
- Try resetting the database by running the command again

### CORS errors in browser console
- Double-check that `CORS_ORIGIN` in Railway exactly matches your Vercel URLs
- No trailing slashes!
- No spaces after commas!

### Images/Audio not loading
- Railway has ephemeral storage - files are lost on redeploy
- This is expected with the free tier
- For production, integrate cloud storage (AWS S3, Cloudinary)

### Frontend shows errors
- Check that `VITE_API_URL` is correctly set in Vercel
- Make sure it includes `/api` at the end
- Try redeploying the frontend

## 💡 Need Help?

1. Check the browser console (F12) for errors
2. Check Railway logs for backend issues
3. Check Vercel logs for frontend/admin issues
4. Refer to [CLOUD_DEPLOYMENT_CHECKLIST.md](./CLOUD_DEPLOYMENT_CHECKLIST.md)

## 🎊 Happy Deploying!

You now have a fully functional cloud-hosted multi-track audio player!
