# Deployment Guide

This guide covers deploying the Multi-Track Player to production.

## Deployment Options

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
