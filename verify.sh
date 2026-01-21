#!/bin/bash

echo "🔍 Multi-Track Player - Project Verification"
echo "==========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

ERRORS=0

echo "📁 Checking Project Structure..."
echo ""

echo "Backend Files:"
check_file "backend/package.json" || ((ERRORS++))
check_file "backend/src/server.js" || ((ERRORS++))
check_file "backend/src/config/db.js" || ((ERRORS++))
check_file "backend/src/scripts/initDb.js" || ((ERRORS++))
check_file "backend/src/middleware/auth.js" || ((ERRORS++))
check_file "backend/src/middleware/upload.js" || ((ERRORS++))
check_dir "backend/src/controllers" || ((ERRORS++))
check_dir "backend/src/routes" || ((ERRORS++))
check_dir "backend/uploads" || ((ERRORS++))
echo ""

echo "Frontend Files:"
check_file "frontend/package.json" || ((ERRORS++))
check_file "frontend/src/App.tsx" || ((ERRORS++))
check_file "frontend/src/main.tsx" || ((ERRORS++))
check_file "frontend/index.html" || ((ERRORS++))
check_file "frontend/vite.config.ts" || ((ERRORS++))
check_dir "frontend/src/components" || ((ERRORS++))
check_dir "frontend/src/pages" || ((ERRORS++))
check_dir "frontend/src/hooks" || ((ERRORS++))
echo ""

echo "Admin Panel Files:"
check_file "admin/package.json" || ((ERRORS++))
check_file "admin/src/App.tsx" || ((ERRORS++))
check_file "admin/src/main.tsx" || ((ERRORS++))
check_file "admin/index.html" || ((ERRORS++))
check_file "admin/vite.config.ts" || ((ERRORS++))
check_dir "admin/src/pages" || ((ERRORS++))
check_dir "admin/src/components" || ((ERRORS++))
check_dir "admin/src/context" || ((ERRORS++))
echo ""

echo "Configuration Files:"
check_file "docker-compose.yml" || ((ERRORS++))
check_file ".gitignore" || ((ERRORS++))
check_file "README.md" || ((ERRORS++))
check_file "QUICKSTART.md" || ((ERRORS++))
check_file "setup.sh" || ((ERRORS++))
echo ""

echo "==========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: ./setup.sh"
    echo "  2. Follow instructions in QUICKSTART.md"
else
    echo -e "${RED}❌ Found $ERRORS error(s)${NC}"
    exit 1
fi
