#!/bin/bash

echo "🎵 Multi-Track Player Setup Script"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Please install Docker and Docker Compose first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Please install Node.js (v18+) first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Start PostgreSQL
echo "🐘 Starting PostgreSQL with Docker..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend
npm install
echo "📊 Initializing database..."
npm run init-db

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "  1. Start backend:  cd backend && npm run dev"
echo "  2. Start frontend: cd frontend && npm install && npm run dev"
echo "  3. Start admin:    cd admin && npm install && npm run dev"
echo ""
echo "🔑 Default Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "🌐 URLs:"
echo "  Frontend:    http://localhost:3000"
echo "  Admin Panel: http://localhost:3002"
echo "  Backend API: http://localhost:3001"
echo ""
