# Deployment Guide

This guide covers deploying the Multi-Track Player to production.

## Quick Cloud Deployment (Recommended)

This section provides step-by-step instructions for deploying to Vercel, Railway, and Neon with free tiers.

### Step 1: Create Neon PostgreSQL Database

1. Sign up at https://neon.tech (free tier)
2. Create a new project
3. Create a database named `mtrack`
4. Copy the **DATABASE_URL** (format: `postgresql://user:password@xxx.neon.tech/mtrack`)

### Step 2: Deploy Backend on Railway

1. Sign up at https://railway.app (free tier)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository (xkuragax/mtrack)
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

5. Add Environment Variables:
   ```
   PORT=3001
   DATABASE_URL=<your-neon-database-url>
   JWT_SECRET=<generate-a-strong-32-char-secret>
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
   UPLOAD_DIR=uploads
   ```

6. Deploy and wait for the build to complete

7. Initialize the database:
   - Go to Railway Console → Your Project → Terminal
   - Run: `npm run init-db`

8. Copy your Railway URL (e.g., `https://your-api.up.railway.app`)

### Step 3: Deploy Frontend on Vercel

1. Sign up at https://vercel.com (free tier)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-api.up.railway.app/api
   ```

6. Click **Deploy**

7. Copy your Vercel URL (e.g., `https://your-frontend.vercel.app`)

### Step 4: Deploy Admin Panel on Vercel

1. Create another Vercel project for the admin panel
2. Use the same GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

4. Add Environment Variable:
   ```
   VITE_API_URL=https://your-api.up.railway.app/api
   ```

5. Click **Deploy**

6. Copy your Admin Vercel URL (e.g., `https://your-admin.vercel.app`)

### Step 5: Update Backend CORS

1. Go back to Railway
2. Update the `CORS_ORIGIN` environment variable with your actual Vercel URLs:
   ```
   CORS_ORIGIN=https://your-frontend.vercel.app,https://your-admin.vercel.app
   ```
3. Railway will automatically redeploy

### Step 6: Final Testing

1. **Test Frontend**: Open your frontend URL - should display albums
2. **Test Admin**: Open your admin URL - should allow login (admin/admin123)
3. **Create Content**: Use admin panel to add an album with songs
4. **Verify**: Check frontend to see your new album

### Automatic Deployments

After initial setup, any changes you push to the `main` branch will automatically deploy:
- Backend → Railway (redeploys)
- Frontend → Vercel (redeploys)
- Admin → Vercel (redeploys)

### Deployment URLs

After completion, you'll have:
- 🌐 **Frontend**: `https://your-frontend.vercel.app`
- 🔧 **Admin**: `https://your-admin.vercel.app`
- 🔌 **API**: `https://your-api.up.railway.app`
- 🗄️ **Database**: Neon PostgreSQL (managed)

### Troubleshooting

**CORS Errors**:
- Make sure `CORS_ORIGIN` in Railway includes both Vercel URLs
- Separate multiple URLs with commas, no spaces

**Database Connection**:
- Verify `DATABASE_URL` is correct in Railway
- Check Neon dashboard to ensure database is active

**Upload Issues**:
- Railway ephemeral storage resets on redeploy
- For production, consider using cloud storage (AWS S3, Cloudinary)

**Build Failures**:
- Check logs in Vercel/Railway dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

---

## Traditional Deployment Options

### Option 1: Traditional VPS (DigitalOcean, AWS EC2, etc.)

#### Backend Deployment

1. **Prepare the server**
   ```bash
   # Install Node.js, PostgreSQL, and Nginx
   sudo apt update
   sudo apt install nodejs npm postgresql nginx
   ```

2. **Setup PostgreSQL**
   ```bash
   sudo -u postgres createdb multitrack_player
   sudo -u postgres createuser -P multitrack_admin
   ```

3. **Deploy Backend**
   ```bash
   cd /var/www/multitrack-player-backend
   git clone <your-repo-url> .
   cd backend
   npm install --production
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Initialize database
   npm run init-db
   
   # Start with PM2
   npm install -g pm2
   pm2 start src/server.js --name multitrack-api
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /uploads {
           alias /var/www/multitrack-player-backend/backend/uploads;
       }
   }
   ```

#### Frontend Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/multitrack-player-frontend/frontend/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

#### Admin Panel Deployment

1. **Build Admin Panel**
   ```bash
   cd admin
   npm install
   npm run build
   ```

2. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name admin.yourdomain.com;
       root /var/www/multitrack-player-admin/admin/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option 2: Serverless/Cloud Platforms

#### Backend
- **Railway**: Deploy with one click
- **Render**: Connect GitHub repo, auto-deploy
- **Heroku**: Use Heroku Postgres add-on

#### Frontend & Admin
- **Vercel**: Perfect for React apps, connect GitHub repo
- **Netlify**: Drag & drop dist folder or connect repo
- **Cloudflare Pages**: Fast global CDN

## Environment Variables (Production)

### Backend (.env)
```env
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=<generate-a-strong-random-secret>
NODE_ENV=production
UPLOAD_DIR=uploads
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com
```

### Frontend & Admin
Update API base URL in `vite.config.ts`:
```typescript
export default defineConfig({
  // ... other config
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('https://api.yourdomain.com')
  }
})
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Configure CORS properly
- [ ] Set secure HTTP headers
- [ ] Enable rate limiting
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Implement file upload limits

## Cloud Storage (Optional)

For better scalability, use cloud storage for uploads:

### AWS S3
```javascript
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'multitrack-player-uploads',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});
```

### Cloudinary
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

## Monitoring & Logging

Consider adding:
- **PM2 Monitoring**: `pm2 install pm2-logrotate`
- **Sentry**: Error tracking
- **LogRocket**: User session replay
- **Google Analytics**: Usage tracking

## Database Backup

Set up automated backups:
```bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
pg_dump multitrack_player > /backups/db-$(date +%Y%m%d-%H%M%S).sql
# Keep only last 7 days
find /backups -name "db-*.sql" -mtime +7 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-db.sh" | crontab -
```

## Performance Optimization

1. **Enable compression in Nginx**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Cache static assets**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use CDN** for static assets (Cloudflare, AWS CloudFront)

4. **Database indexes**
   ```sql
   CREATE INDEX idx_songs_album_id ON songs(album_id);
   CREATE INDEX idx_tracks_song_id ON tracks(song_id);
   CREATE INDEX idx_materials_song_id ON song_materials(song_id);
   ```
