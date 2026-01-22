#!/bin/bash

# Interactive deployment script for Multi-Track Player
# This script will guide you through the deployment process

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║     Multi-Track Player - Interactive Deployment Setup       ║
║                                                              ║
║  This will guide you through deploying to the cloud         ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    echo -e "${YELLOW}${prompt}${NC}"
    read -r "$var_name"
}

# Check if already deployed
if [ -f ".deployment-config" ]; then
    echo -e "${GREEN}Found existing deployment configuration!${NC}"
    echo ""
    source .deployment-config
    echo "Current deployment:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Admin: $ADMIN_URL"
    echo "  Backend: $BACKEND_URL"
    echo ""
    read -p "Do you want to redeploy with these settings? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        rm .deployment-config
    fi
fi

# Step 1: Neon Database
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 1: Set up Neon Database${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Go to: https://console.neon.tech"
echo "2. Sign up / Login (free, no credit card required)"
echo "3. Click 'Create Project'"
echo "4. Name it: mtrack"
echo "5. Copy the connection string"
echo ""

if [ -z "$DATABASE_URL" ]; then
    prompt_input "Paste your Neon connection string here:" DATABASE_URL
fi

echo -e "${GREEN}✓ Database connection string saved${NC}"

# Step 2: Generate JWT Secret
if [ -z "$JWT_SECRET" ]; then
    echo ""
    echo -e "${BLUE}Generating JWT secret...${NC}"
    JWT_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}✓ JWT secret generated${NC}"
fi

# Step 3: Initialize Database
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 2: Initialize Database${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Installing backend dependencies..."
cd backend
npm ci --silent
echo "Creating database tables..."
DATABASE_URL="$DATABASE_URL" npm run init-db
cd ..
echo -e "${GREEN}✓ Database initialized with default admin user (admin/admin123)${NC}"

# Step 4: Railway Backend
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 3: Deploy Backend to Railway${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Go to: https://railway.app"
echo "2. Sign up / Login with GitHub (free)"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select: xkuragax/mtrack"
echo "5. Set Root Directory: backend"
echo "6. Add these environment variables:"
echo ""
echo "   DATABASE_URL=$DATABASE_URL"
echo "   JWT_SECRET=$JWT_SECRET"
echo "   NODE_ENV=production"
echo "   CORS_ORIGIN=*"
echo "   UPLOAD_DIR=uploads"
echo ""
echo "7. Deploy and wait for completion"
echo "8. Click 'Settings' → 'Generate Domain'"
echo "9. Copy the URL"
echo ""

if [ -z "$BACKEND_URL" ]; then
    prompt_input "Paste your Railway backend URL here (e.g., https://xxx.up.railway.app):" BACKEND_URL
    # Remove trailing slash if present
    BACKEND_URL=${BACKEND_URL%/}
fi

echo -e "${GREEN}✓ Backend URL saved${NC}"

# Step 5: Vercel Frontend
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 4: Deploy Frontend to Vercel${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Go to: https://vercel.com"
echo "2. Sign up / Login with GitHub (free)"
echo "3. Click 'Add New' → 'Project'"
echo "4. Import: xkuragax/mtrack"
echo "5. Configure:"
echo "   - Project Name: mtrack-frontend"
echo "   - Root Directory: frontend"
echo "   - Framework: Vite (auto-detected)"
echo "6. Add environment variable:"
echo "   - VITE_API_URL=${BACKEND_URL}/api"
echo "7. Deploy and copy the URL"
echo ""

if [ -z "$FRONTEND_URL" ]; then
    prompt_input "Paste your Vercel frontend URL here (e.g., https://xxx.vercel.app):" FRONTEND_URL
    FRONTEND_URL=${FRONTEND_URL%/}
fi

echo -e "${GREEN}✓ Frontend URL saved${NC}"

# Step 6: Vercel Admin
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 5: Deploy Admin Panel to Vercel${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. In Vercel, click 'Add New' → 'Project' again"
echo "2. Import the same repository: xkuragax/mtrack"
echo "3. Configure:"
echo "   - Project Name: mtrack-admin"
echo "   - Root Directory: admin"
echo "   - Framework: Vite (auto-detected)"
echo "4. Add environment variable:"
echo "   - VITE_API_URL=${BACKEND_URL}/api"
echo "5. Deploy and copy the URL"
echo ""

if [ -z "$ADMIN_URL" ]; then
    prompt_input "Paste your Vercel admin URL here (e.g., https://xxx.vercel.app):" ADMIN_URL
    ADMIN_URL=${ADMIN_URL%/}
fi

echo -e "${GREEN}✓ Admin URL saved${NC}"

# Step 7: Update CORS
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 6: Update CORS Settings${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "1. Go back to Railway Dashboard"
echo "2. Click on your backend service"
echo "3. Go to 'Variables' tab"
echo "4. Update CORS_ORIGIN to:"
echo ""
echo "   ${FRONTEND_URL},${ADMIN_URL}"
echo ""
echo "5. Save (Railway will auto-redeploy)"
echo ""
read -p "Press Enter after you've updated CORS_ORIGIN..."

# Save configuration
cat > .deployment-config <<EOF
DATABASE_URL="$DATABASE_URL"
JWT_SECRET="$JWT_SECRET"
BACKEND_URL="$BACKEND_URL"
FRONTEND_URL="$FRONTEND_URL"
ADMIN_URL="$ADMIN_URL"
DEPLOYMENT_DATE="$(date)"
EOF

echo -e "${GREEN}✓ Configuration saved to .deployment-config${NC}"

# Generate final documentation
cat > DEPLOYMENT_URLS.md <<EOF
# Multi-Track Player - Deployment URLs

Generated on: $(date)

## 🌐 Live Application URLs

- **Frontend**: $FRONTEND_URL
- **Admin Panel**: $ADMIN_URL
- **Backend API**: ${BACKEND_URL}/api

## 🔐 Admin Credentials

- **Username**: \`admin\`
- **Password**: \`admin123\`
- **⚠️ IMPORTANT**: Change these credentials immediately after first login!

## 🗄️ Database Information

- **Provider**: Neon PostgreSQL
- **Console**: https://console.neon.tech

## 📊 Management Dashboards

- **Railway** (Backend): https://railway.app/dashboard
- **Vercel** (Frontend & Admin): https://vercel.com/dashboard

## ✅ Testing Your Deployment

### Test Backend API
\`\`\`bash
curl ${BACKEND_URL}/health
# Expected: {"status":"OK","message":"Server is running"}
\`\`\`

### Test Frontend
1. Open: $FRONTEND_URL
2. Should see the Multi-Track Player interface
3. May show "No albums" initially (normal!)

### Test Admin Panel
1. Open: $ADMIN_URL
2. Login with admin/admin123
3. Change password immediately!
4. Create your first album

## 🔄 Continuous Deployment

All services are now connected to your GitHub repository:
- Push to \`main\` branch → Automatic deployment
- Railway, Vercel automatically pull and deploy changes

## 📝 Environment Variables

### Backend (Railway)
\`\`\`
DATABASE_URL=<your-neon-connection-string>
JWT_SECRET=$JWT_SECRET
NODE_ENV=production
CORS_ORIGIN=${FRONTEND_URL},${ADMIN_URL}
UPLOAD_DIR=uploads
\`\`\`

### Frontend (Vercel)
\`\`\`
VITE_API_URL=${BACKEND_URL}/api
\`\`\`

### Admin (Vercel)
\`\`\`
VITE_API_URL=${BACKEND_URL}/api
\`\`\`

## 🚀 Next Steps

1. **Change admin password** in admin panel settings
2. **Upload your first album**:
   - Login to admin panel
   - Click "Add Album"
   - Fill in details and upload cover
   - Save
3. **Add songs to album**:
   - Click on the album
   - Click "Add Song"
   - Upload audio tracks
   - Save
4. **View on frontend**:
   - Visit frontend URL
   - Your album should appear!

## 🐛 Troubleshooting

### CORS Errors
- Verify CORS_ORIGIN in Railway exactly matches your Vercel URLs
- No trailing slashes, no spaces after commas

### Can't Login to Admin
- Ensure database was initialized (npm run init-db)
- Check Railway logs for errors

### Files Not Uploading
- Railway has ephemeral storage (expected)
- Files persist until next deploy
- For production: integrate cloud storage (S3, Cloudinary)

## 💡 Support

- **Documentation**: Check README.md and API.md
- **Railway Logs**: \`railway logs\` in backend folder
- **Vercel Logs**: Check Vercel dashboard

---

**Deployment completed successfully!** 🎉
EOF

# Final summary
echo ""
echo -e "${GREEN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════╗
║                  🎉 DEPLOYMENT COMPLETE! 🎉                  ║
╚══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""
echo -e "${GREEN}Your Multi-Track Player is now live!${NC}"
echo ""
echo "📱 Application URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "  🌐 Frontend:    ${BLUE}$FRONTEND_URL${NC}"
echo -e "  🔧 Admin Panel: ${BLUE}$ADMIN_URL${NC}"
echo -e "  🔌 Backend API: ${BLUE}${BACKEND_URL}/api${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}📝 Default Admin Credentials:${NC}"
echo "   Username: admin"
echo "   Password: admin123"
echo -e "   ${RED}⚠️  Change these immediately!${NC}"
echo ""
echo -e "${GREEN}✓ Deployment info saved to: DEPLOYMENT_URLS.md${NC}"
echo ""
echo "🚀 Next steps:"
echo "  1. Open admin panel and login"
echo "  2. Change the default password"
echo "  3. Upload your first album"
echo "  4. Check frontend to see your content"
echo ""
echo -e "${GREEN}Happy deploying! 🎊${NC}"
echo ""
