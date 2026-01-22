# Deployment Summary

This document provides a high-level overview of the cloud deployment setup for the Multi-Track Player project.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
         ┌──────────────────┐  ┌──────────────────┐
         │   Frontend       │  │   Admin Panel    │
         │   (Vercel)       │  │   (Vercel)       │
         └────────┬─────────┘  └────────┬─────────┘
                  │                     │
                  └──────────┬──────────┘
                             ▼
                    ┌──────────────────┐
                    │   Backend API    │
                    │   (Railway)      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  PostgreSQL DB   │
                    │   (Neon)         │
                    └──────────────────┘
```

## Components

| Component | Platform | Purpose | Free Tier |
|-----------|----------|---------|-----------|
| Frontend | Vercel | User-facing React app | Yes |
| Admin Panel | Vercel | Content management UI | Yes |
| Backend API | Railway | Express REST API | Yes |
| Database | Neon | PostgreSQL database | Yes |

## Environment Variables

### Railway (Backend)
```bash
PORT=3001
DATABASE_URL=postgresql://user:password@ep-xxx.aws.neon.tech/mtrack?sslmode=require
JWT_SECRET=<32-char-random-string>
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

## Deployment Order

1. **Neon Database** - Get DATABASE_URL
2. **Railway Backend** - Deploy with DATABASE_URL, get API_URL
3. **Vercel Frontend** - Deploy with API_URL
4. **Vercel Admin** - Deploy with API_URL
5. **Update CORS** - Add Vercel URLs to Railway

## Key Configuration Files

### Backend
- `backend/src/server.js` - CORS configuration uses env var
- `backend/package.json` - Build and start scripts
- `backend/.env.example` - Template for env vars

### Frontend
- `frontend/vite.config.ts` - Loads VITE_API_URL from env
- `frontend/src/services/api.ts` - Uses VITE_API_URL
- `frontend/vercel.json` - Vercel deployment config
- `frontend/.env.example` - Template for env vars

### Admin
- `admin/vite.config.ts` - Loads VITE_API_URL from env
- `admin/src/services/api.ts` - Uses VITE_API_URL
- `admin/vercel.json` - Vercel deployment config
- `admin/.env.example` - Template for env vars

## Git Workflow

```
local development → git push main → automatic deploy
                                      ├─→ Railway (backend)
                                      ├─→ Vercel (frontend)
                                      └─→ Vercel (admin)
```

## Database Initialization

Run this once on Railway after deployment:
```bash
npm run init-db
```

This creates:
- All database tables
- Default admin user (username: `admin`, password: `admin123`)

## Known Limitations

### File Storage
- **Current**: Railway ephemeral storage (lost on redeploy)
- **Impact**: Uploaded files are temporary
- **Solution**: For production, integrate cloud storage (AWS S3, Cloudinary)

### Free Tier Limits
- **Railway**: 512MB RAM, $5 free credit/month
- **Vercel**: 100GB bandwidth/month
- **Neon**: 0.5GB storage, 3 projects

## Costs

All platforms provide generous free tiers suitable for small projects:
- **Vercel**: Free (for personal projects)
- **Railway**: Free tier with $5/month credit
- **Neon**: Free tier (0.5GB storage)

Total: **$0/month** for small-scale deployment

## Monitoring & Management

| Platform | Dashboard | What to Monitor |
|----------|-----------|-----------------|
| Railway | https://railway.app/project | CPU, RAM, logs |
| Vercel | https://vercel.com/dashboard | Builds, errors, analytics |
| Neon | https://console.neon.tech | Storage, connections |

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] HTTPS enabled (automatic)
- [ ] CORS restricted to your domains
- [ ] Environment variables (not in code)
- [ ] Regular backups (Neon auto-backups)

## Backup Strategy

Neon provides automatic point-in-time recovery. For additional safety:
1. Regular SQL exports from Neon console
2. Keep local copy of important uploads
3. Git track all code changes

## Scaling Considerations

If you need to scale beyond free tiers:

### Backend (Railway)
- Upgrade to paid plan for more RAM/CPU
- Consider CDN for static assets
- Move to cloud storage for uploads

### Frontend (Vercel)
- Automatic scaling with paid plan
- Edge functions for API optimization
- Image optimization built-in

### Database (Neon)
- Larger storage tiers available
- Read replicas for better performance
- Connection pooling

## Rollback Procedure

If deployment breaks something:

1. **Railway**: Click "Redeploy" → Choose previous deployment
2. **Vercel**: Dashboard → Deployments → Choose previous deployment
3. **Database**: Neon has point-in-time recovery

## Useful Commands

### Local Development
```bash
# Start all services
docker-compose up -d          # PostgreSQL
cd backend && npm run dev     # Backend (port 3001)
cd frontend && npm run dev    # Frontend (port 3000)
cd admin && npm run dev       # Admin (port 3002)
```

### Railway
```bash
# In Railway terminal
npm run init-db              # Initialize database
npm start                    # Start server
```

### Vercel CLI (optional)
```bash
vercel --prod                # Deploy to production
vercel logs                  # View logs
```

## Support Documentation

- **Quick Start**: [QUICK_CLOUD_SETUP.md](./QUICK_CLOUD_SETUP.md)
- **Full Checklist**: [CLOUD_DEPLOYMENT_CHECKLIST.md](./CLOUD_DEPLOYMENT_CHECKLIST.md)
- **Detailed Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Documentation**: [API.md](./API.md)

## Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Admin panel loads at Vercel URL
- ✅ Admin login works (admin/admin123)
- ✅ Can create albums and songs in admin
- ✅ Albums appear in frontend
- ✅ Audio playback works
- ✅ File uploads work (temporarily)

## Next Steps After Deployment

1. **Content**: Upload your albums, songs, and tracks
2. **Branding**: Customize colors, logo, title
3. **Domain**: Add custom domain to Vercel
4. **Analytics**: Add tracking (Google Analytics, etc.)
5. **Storage**: Implement cloud storage for uploads
6. **Security**: Change default admin password
7. **Monitoring**: Set up alerts and error tracking

## Maintenance

### Monthly
- Check platform dashboards for usage
- Review and update dependencies
- Test backup recovery process

### Quarterly
- Review security settings
- Optimize performance
- Clean up unused resources

### As Needed
- Update dependencies
- Add new features
- Scale resources

## Contact & Resources

- **GitHub Repository**: Your repo URL
- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/support
- **Neon Support**: https://neon.tech/support

---

**Last Updated**: 2024
**Version**: 1.0.0
