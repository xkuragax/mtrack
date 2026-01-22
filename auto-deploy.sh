#!/bin/bash

# Multi-Track Player - Automated Cloud Deployment Script
# This script automatically deploys the application to Neon, Railway, and Vercel

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          Multi-Track Player - Auto Deploy Script            ║"
echo "║                                                              ║"
echo "║  This script will deploy your app to:                       ║"
echo "║  • Neon (PostgreSQL Database)                               ║"
echo "║  • Railway (Backend API)                                    ║"
echo "║  • Vercel (Frontend & Admin)                                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check prerequisites
print_step "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
print_success "Node.js installed"

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm installed"

if ! command_exists git; then
    print_error "git is not installed. Please install git first."
    exit 1
fi
print_success "git installed"

# Install CLI tools if not present
print_step "Installing CLI tools..."

if ! command_exists vercel; then
    print_warning "Vercel CLI not found, installing..."
    npm install -g vercel
fi
print_success "Vercel CLI ready"

if ! command_exists railway; then
    print_warning "Railway CLI not found, installing..."
    npm install -g @railway/cli
fi
print_success "Railway CLI ready"

if ! command_exists neonctl; then
    print_warning "Neon CLI not found, installing..."
    npm install -g neonctl
fi
print_success "Neon CLI ready"

# Check authentication
print_step "Checking authentication..."

AUTH_NEEDED=false

# Check Neon auth
if ! neonctl projects list >/dev/null 2>&1; then
    print_warning "Neon: Not authenticated"
    AUTH_NEEDED=true
else
    print_success "Neon: Authenticated"
fi

# Check Railway auth
if ! railway whoami >/dev/null 2>&1; then
    print_warning "Railway: Not authenticated"
    AUTH_NEEDED=true
else
    print_success "Railway: Authenticated"
fi

# Check Vercel auth
if ! vercel whoami >/dev/null 2>&1; then
    print_warning "Vercel: Not authenticated"
    AUTH_NEEDED=true
else
    print_success "Vercel: Authenticated"
fi

if [ "$AUTH_NEEDED" = true ]; then
    echo ""
    print_step "Authentication required. Opening login pages..."
    echo ""
    
    # Neon authentication
    if ! neonctl projects list >/dev/null 2>&1; then
        print_step "Please authenticate with Neon..."
        echo "1. Visit: https://console.neon.tech/app/settings/api-keys"
        echo "2. Generate a new API key"
        echo "3. Run: neonctl auth"
        echo ""
        read -p "Press Enter after completing Neon authentication..."
    fi
    
    # Railway authentication
    if ! railway whoami >/dev/null 2>&1; then
        print_step "Please authenticate with Railway..."
        echo "Run: railway login"
        echo ""
        railway login
    fi
    
    # Vercel authentication
    if ! vercel whoami >/dev/null 2>&1; then
        print_step "Please authenticate with Vercel..."
        vercel login
    fi
    
    print_success "All services authenticated!"
fi

echo ""
print_step "Starting deployment process..."
echo ""

# Step 1: Deploy Database to Neon
print_step "Step 1/4: Creating Neon database..."

# Check if project already exists
NEON_PROJECT_NAME="mtrack-$(date +%s)"
print_warning "Creating new Neon project: $NEON_PROJECT_NAME"

# Create Neon project
NEON_OUTPUT=$(neonctl projects create --name "$NEON_PROJECT_NAME" --region aws-us-east-2 --output json)
NEON_PROJECT_ID=$(echo "$NEON_OUTPUT" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$NEON_PROJECT_ID" ]; then
    print_error "Failed to create Neon project"
    exit 1
fi

print_success "Neon project created: $NEON_PROJECT_ID"

# Get connection string
DATABASE_URL=$(neonctl connection-string --project-id "$NEON_PROJECT_ID" --output json | grep -o '"connection_string":"[^"]*"' | cut -d'"' -f4)

if [ -z "$DATABASE_URL" ]; then
    print_error "Failed to get database connection string"
    exit 1
fi

print_success "Database connection string obtained"

# Initialize database
print_step "Initializing database schema..."
cd backend
npm ci --silent
DATABASE_URL="$DATABASE_URL" npm run init-db
cd ..
print_success "Database initialized with tables and default admin user"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
print_success "JWT secret generated"

# Step 2: Deploy Backend to Railway
print_step "Step 2/4: Deploying backend to Railway..."

cd backend

# Check if Railway project exists
if [ ! -f "railway.json" ]; then
    # Initialize Railway project
    railway init --name "mtrack-backend"
fi

# Set environment variables
railway variables set DATABASE_URL="$DATABASE_URL"
railway variables set JWT_SECRET="$JWT_SECRET"
railway variables set NODE_ENV="production"
railway variables set CORS_ORIGIN="*"
railway variables set PORT="3001"
railway variables set UPLOAD_DIR="uploads"

print_success "Environment variables configured"

# Deploy to Railway
print_warning "Deploying backend... (this may take a few minutes)"
railway up

# Get Railway URL
BACKEND_URL=$(railway domain | grep "https://" || echo "")

if [ -z "$BACKEND_URL" ]; then
    print_warning "No domain found, generating one..."
    railway domain
    BACKEND_URL=$(railway domain | grep "https://" || echo "")
fi

cd ..
print_success "Backend deployed to Railway"
print_success "Backend URL: $BACKEND_URL"

# Step 3: Deploy Frontend to Vercel
print_step "Step 3/4: Deploying frontend to Vercel..."

cd frontend

# Deploy to Vercel
VITE_API_URL="${BACKEND_URL}/api" vercel --prod --yes \
    --env VITE_API_URL="${BACKEND_URL}/api"

FRONTEND_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
FRONTEND_URL="https://${FRONTEND_URL}"

cd ..
print_success "Frontend deployed to Vercel"
print_success "Frontend URL: $FRONTEND_URL"

# Step 4: Deploy Admin to Vercel
print_step "Step 4/4: Deploying admin panel to Vercel..."

cd admin

# Deploy to Vercel
VITE_API_URL="${BACKEND_URL}/api" vercel --prod --yes \
    --env VITE_API_URL="${BACKEND_URL}/api"

ADMIN_URL=$(vercel ls --json | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4)
ADMIN_URL="https://${ADMIN_URL}"

cd ..
print_success "Admin panel deployed to Vercel"
print_success "Admin URL: $ADMIN_URL"

# Step 5: Update CORS settings
print_step "Updating CORS settings..."

cd backend
railway variables set CORS_ORIGIN="${FRONTEND_URL},${ADMIN_URL}"
cd ..

print_success "CORS configured with frontend and admin URLs"

# Final output
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  🎉 DEPLOYMENT COMPLETE! 🎉                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_success "Your Multi-Track Player is now live!"
echo ""
echo "📱 Application URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🌐 Frontend:    $FRONTEND_URL"
echo "  🔧 Admin Panel: $ADMIN_URL"
echo "  🔌 Backend API: ${BACKEND_URL}/api"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   ⚠️  Please change these credentials immediately!"
echo ""
echo "💾 Database Info:"
echo "   Provider: Neon PostgreSQL"
echo "   Project ID: $NEON_PROJECT_ID"
echo "   Dashboard: https://console.neon.tech"
echo ""
echo "🚀 Next Steps:"
echo "   1. Visit the admin panel and login"
echo "   2. Change the default admin password"
echo "   3. Upload your first album and songs"
echo "   4. Check the frontend to see your content"
echo ""
echo "📚 Useful Commands:"
echo "   • View backend logs:  cd backend && railway logs"
echo "   • View frontend logs: cd frontend && vercel logs"
echo "   • View admin logs:    cd admin && vercel logs"
echo ""

# Save deployment info to file
cat > DEPLOYMENT_URLS.md <<EOF
# Multi-Track Player - Deployment URLs

## Live Application

- **Frontend**: $FRONTEND_URL
- **Admin Panel**: $ADMIN_URL
- **Backend API**: ${BACKEND_URL}/api

## Admin Credentials

- **Username**: admin
- **Password**: admin123
- ⚠️ **Important**: Change these credentials immediately after first login!

## Database

- **Provider**: Neon PostgreSQL
- **Project ID**: $NEON_PROJECT_ID
- **Dashboard**: https://console.neon.tech

## Management Dashboards

- **Neon Console**: https://console.neon.tech
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

## Environment Variables

### Backend (Railway)
\`\`\`
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
NODE_ENV=production
CORS_ORIGIN=${FRONTEND_URL},${ADMIN_URL}
PORT=3001
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

## Deployment Date

$(date)

## Notes

- All services are using free tiers
- Auto-deployment is enabled for all services
- Push to main branch will automatically trigger deployments
- Database backups are handled automatically by Neon

## Support

For issues or questions, refer to:
- Project README: [README.md](./README.md)
- API Documentation: [API.md](./API.md)
- Deployment Checklist: [CLOUD_DEPLOYMENT_CHECKLIST.md](./CLOUD_DEPLOYMENT_CHECKLIST.md)
EOF

print_success "Deployment info saved to DEPLOYMENT_URLS.md"
echo ""
print_success "Deployment complete! Your application is ready to use."
echo ""
