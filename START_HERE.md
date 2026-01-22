# 🚀 Start Here: Cloud Deployment Guide

## Welcome! 

Your mtrack Multi-Track Audio Player is **ready for cloud deployment** using 100% free services.

---

## 📖 Choose Your Path

### I want to deploy NOW (5 minutes)
👉 **[QUICK_START_CLOUD.md](./QUICK_START_CLOUD.md)**

### I want to understand HOW it works
👉 **[CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md)**

### Я хочу развернуть СЕЙЧАС (5 минут)
👉 **[QUICK_START_CLOUD.md](./QUICK_START_CLOUD.md)**

### Я хочу понять КАК это работает
👉 **[РУКОВОДСТВО_РАЗВЕРТЫВАНИЯ.md](./РУКОВОДСТВО_РАЗВЕРТЫВАНИЯ.md)**

### I want to verify my deployment
👉 **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)**

### I want to see architecture diagrams
👉 **[DIAGRAM_ARCHITECTURE.md](./DIAGRAM_ARCHITECTURE.md)**

---

## 🎯 What You'll Get

After following the deployment guide, you'll have:

- ✅ **Frontend** live on Vercel (automatic deployment on push)
- ✅ **Admin Panel** live on Vercel (automatic deployment on push)
- ✅ **Backend API** live on Railway (automatic deployment on push)
- ✅ **Database** on Neon (PostgreSQL free tier)
- ✅ **Automatic updates** when you push to GitHub

---

## 💰 Cost

**100% FREE** for small to medium usage:

| Service | Cost |
|---------|------|
| Vercel (x2) | $0 |
| Railway | $0-$5 |
| Neon | $0 |
| **Total** | **$0-$5/month** |

---

## ⚡ Quick Start (3 Steps)

### Step 1: Create Database (Neon)
1. Go to [https://neon.tech](https://neon.tech)
2. Create free account and project
3. Copy connection string

### Step 2: Deploy Backend (Railway)
1. Go to [https://railway.app](https://railway.app)
2. Connect GitHub and deploy backend
3. Add environment variables
4. Run `npm run init-db` in console

### Step 3: Deploy Frontend & Admin (Vercel)
1. Go to [https://vercel.com](https://vercel.com)
2. Deploy frontend (root: `frontend`)
3. Deploy admin (root: `admin`)
4. Add VITE_API_URL environment variable

**Full instructions in QUICK_START_CLOUD.md**

---

## 📚 Documentation Index

| Document | Purpose | Language | Time |
|----------|---------|----------|------|
| [QUICK_START_CLOUD.md](./QUICK_START_CLOUD.md) | Deploy in 5 minutes | EN | 5 min |
| [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) | Complete deployment guide | EN | 30 min |
| [РУКОВОДСТВО_РАЗВЕРТЫВАНИЯ.md](./РУКОВОДСТВО_РАЗВЕРТЫВАНИЯ.md) | Полное руководство | RU | 30 min |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | Verification checklist | EN | 15 min |
| [DIAGRAM_ARCHITECTURE.md](./DIAGRAM_ARCHITECTURE.md) | Architecture diagrams | EN | 10 min |

---

## 🔄 After Deployment

### Making Updates
```bash
git add .
git commit -m "Your changes"
git push origin main
```

All three parts deploy automatically!

### Changing Admin Password
Run in Neon SQL Editor:
```sql
UPDATE admin_users
SET password_hash = '$2a$10$new-hash'
WHERE username = 'admin';
```

Generate hash: `node scripts/generate-secrets.js`

---

## ⚠️ Important Notes

### File Upload Limitation
- Files are stored in Railway's ephemeral filesystem
- Files are lost on redeploy (after inactivity)
- **Solutions:**
  - Use Railway Volume (~$5/month)
  - Use cloud storage (AWS S3, Cloudinary)

### Default Password
- Username: `admin`
- Password: `admin123`
- **Change this immediately after deployment!**

---

## 🎉 Ready?

**[START: QUICK_START_CLOUD.md](./QUICK_START_CLOUD.md)** ⬅️ Click here to begin!

---

## 📞 Need Help?

- **Troubleshooting**: [CLOUD_DEPLOYMENT.md](./CLOUD_DEPLOYMENT.md) → Troubleshooting
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Architecture**: [DIAGRAM_ARCHITECTURE.md](./DIAGRAM_ARCHITECTURE.md)
- **All Docs**: [DEPLOYMENT_README.md](./DEPLOYMENT_README.md)

---

**🚀 Your application is ready for the cloud!**
