# Cloud Deployment Checklist

Use this checklist to verify your cloud deployment is properly configured.

## ✅ Pre-Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] All .env files are NOT committed (in .gitignore)
- [ ] Railway account created and linked to GitHub
- [ ] Vercel account created and linked to GitHub
- [ ] Neon account created
- [ ] Have a unique project name/domain name ready

## ✅ Backend Deployment (Railway)

### Configuration
- [ ] Railway project created from GitHub repo
- [ ] Environment variables set:
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (from Neon)
  - [ ] `JWT_SECRET` (secure random string)
  - [ ] `CORS_ORIGIN` (Vercel domains)
- [ ] Railway backend deployed successfully
- [ ] Health check passes: `https://your-app.railway.app/health`

### Database
- [ ] Neon PostgreSQL project created
- [ ] Database URL copied to Railway
- [ ] Database initialized: `npm run init-db` in Railway console
- [ ] Admin user created (username: `admin`, password: `admin123`)

### Verification
- [ ] API returns 200 on `/health` endpoint
- [ ] API returns albums list on `/api/albums`
- [ ] Uploads directory exists (even if empty)
- [ ] No errors in Railway logs

## ✅ Frontend Deployment (Vercel)

### Configuration
- [ ] Vercel project created with root directory: `frontend`
- [ ] Build config set to `Vite`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL` (Railway backend URL)
- [ ] Frontend deployed successfully
- [ ] Frontend accessible at Vercel URL

### Verification
- [ ] Frontend loads in browser
- [ ] Albums page displays (even if empty)
- [ ] No console errors in browser DevTools
- [ ] API requests are made to Railway URL (check Network tab)
- [ ] Responsive design works on mobile

## ✅ Admin Deployment (Vercel)

### Configuration
- [ ] Vercel project created with root directory: `admin`
- [ ] Build config set to `Vite`
- [ ] Environment variable set:
  - [ ] `VITE_API_URL` (Railway backend URL)
- [ ] Admin deployed successfully
- [ ] Admin accessible at Vercel URL

### Verification
- [ ] Login page loads
- [ ] Can login with `admin` / `admin123`
- [ ] Dashboard loads after login
- [ ] Can create an album
- [ ] Can upload a cover image
- [ ] Can create a song
- [ ] Can upload tracks
- [ ] Can add materials
- [ ] No console errors

## ✅ Integration Testing

### End-to-End Flow
- [ ] Create album in admin panel
- [ ] Album appears on frontend
- [ ] Add song in admin panel
- [ ] Song appears on frontend
- [ ] Upload tracks in admin panel
- [ ] Tracks load in frontend player
- [ ] Audio playback works
- [ ] Volume controls work
- [ ] Mute/solo buttons work
- [ ] Add materials in admin panel
- [ ] Materials appear on frontend
- [ ] Materials download correctly

### CORS Testing
- [ ] No CORS errors in browser console
- [ ] Frontend can call backend API
- [ ] Admin can call backend API
- [ ] OPTIONS requests handled correctly

## ✅ Security Checklist

### Important Security Items
- [ ] Default admin password changed
- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] DATABASE_URL is not exposed in frontend code
- [ ] JWT_SECRET is not in git history
- [ ] CORS_ORIGIN is specific (not `*`)
- [ ] HTTPS is enforced (automatic on Vercel/Railway)
- [ ] No sensitive data in browser console

### Security Tests
- [ ] Cannot access admin routes without JWT token
- [ ] Invalid JWT tokens are rejected
- [ ] SQL injection attempts fail
- [ ] File upload limits enforced
- [ ] Rate limiting on sensitive endpoints

## ✅ Performance Checklist

### Frontend Performance
- [ ] Page loads quickly (< 3 seconds)
- [ ] Images are optimized
- [ ] Audio files load efficiently
- [ ] No large bundle sizes
- [ ] Lighthouse score acceptable (> 70)

### Backend Performance
- [ ] API responses are fast (< 500ms for most queries)
- [ ] Database queries are optimized
- [ ] No memory leaks
- [ ] Railway logs show no errors
- [ ] Health check responds quickly

## ✅ Monitoring & Logging

### Vercel
- [ ] Deployment logs visible
- [ ] Function logs accessible
- [ ] Error tracking enabled (optional)

### Railway
- [ ] Real-time logs working
- [ ] Console access working
- [ ] Metrics dashboard accessible

### Neon
- [ ] Query insights working
- [ ] Logs accessible
- [ ] Auto-backups enabled

## ✅ Automatic Deployment

### Git Workflow
- [ ] Changes to `backend/` trigger Railway deployment
- [ ] Changes to `frontend/` trigger Vercel frontend deployment
- [ ] Changes to `admin/` trigger Vercel admin deployment
- [ ] Deployments complete successfully
- [ ] No broken builds

### Testing Auto-Deploy
- [ ] Make a small change to frontend
- [ ] Push to GitHub
- [ ] Vercel automatically deploys
- [ ] Changes appear on live site
- [ ] Repeat for admin and backend

## ✅ Documentation

### Deployment Documentation
- [ ] URLs saved and documented
- [ ] Environment variables documented
- [ ] Admin credentials stored securely
- [ ] Deployment process documented for team
- [ ] Troubleshooting guide reviewed

### User Documentation
- [ ] Instructions for making updates
- [ ] Contact info for support
- [ ] Known issues documented

## ✅ Known Limitations & Workarounds

### File Upload Limitations
- [ ] Aware that files are stored in ephemeral Railway filesystem
- [ ] Files are lost when Railway redeloys (after inactivity)
- [ ] Plan implemented for persistent storage:
  - [ ] Using Railway Volume (paid)
  - [ ] Using cloud storage (AWS S3, Cloudinary)
  - [ ] Accepting limitation for prototype

### Database Limitations
- [ ] Neon free tier: 0.5GB storage
- [ ] Monitoring storage usage
- [ ] Plan for scaling if needed

## 🎯 Post-Deployment Verification

### Final Tests
1. **Frontend Test:**
   - [ ] Open frontend URL
   - [ ] Load albums page
   - [ ] Play a song
   - [ ] Adjust tracks
   - [ ] Download materials

2. **Admin Test:**
   - [ ] Login successfully
   - [ ] Create content
   - [ ] Edit content
   - [ ] Delete content
   - [ ] Upload files

3. **Mobile Test:**
   - [ ] Test on mobile phone
   - [ ] Touch controls work
   - [ ] Audio plays smoothly
   - [ ] No layout issues

4. **Edge Cases:**
   - [ ] What happens with no internet?
   - [ ] What happens with slow connection?
   - [ ] What if database is down?
   - [ ] What if backend is down?

## 📝 Notes

```
Frontend URL: __________________________________________________

Admin URL: ____________________________________________________

Backend URL: __________________________________________________

Database URL: Neon Console

Admin Username: admin
Admin Password: __________________________

JWT_SECRET: __________________________

Deployment Date: __________________________

Next Review Date: __________________________
```

## 🔗 Quick Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Railway Dashboard](https://railway.app/dashboard)
- [Neon Console](https://console.neon.tech)
- [GitHub Repository]

## 📞 Support

If issues arise:

1. Check logs in Vercel, Railway, and Neon
2. Review CLOUD_DEPLOYMENT.md troubleshooting section
3. Verify environment variables
4. Check CORS configuration
5. Test API endpoints directly

---

## Deployment Status

**Date:** _________________

**Deployed By:** _________________

**Status:**
- [ ] All checks passed
- [ ] Minor issues (documented above)
- [ ] Major issues (deployment not complete)

**Sign-off:** _________________
