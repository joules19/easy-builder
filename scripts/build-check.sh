#!/bin/bash

# Build Quality Check Script
# Run this before making any commits or deployments

set -e

echo "🚀 EasyBuilder Build Quality Check"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check 1: Dependencies
print_status "Checking dependencies..."
if npm list --depth=0 >/dev/null 2>&1; then
    print_success "Dependencies are properly installed"
else
    print_warning "Some dependencies might be missing. Running npm install..."
    npm install
fi

# Check 2: TypeScript compilation
print_status "Running TypeScript build check..."
if npm run build > build_output.log 2>&1; then
    print_success "TypeScript build successful"
    rm -f build_output.log
else
    print_error "TypeScript build failed!"
    echo "Build output:"
    cat build_output.log
    rm -f build_output.log
    echo ""
    print_error "Please fix the TypeScript errors above before proceeding."
    exit 1
fi

# Check 3: Critical file existence
print_status "Checking critical files..."
critical_files=(
    "src/types/database.ts"
    "src/lib/supabase/client.ts"
    "src/lib/supabase/server.ts"
    ".env.local"
    "next.config.js"
    "tailwind.config.ts"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found $file"
    else
        print_warning "Missing $file"
    fi
done

# Check 4: Environment variables (basic check)
print_status "Checking environment configuration..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        print_success "Essential environment variables configured"
    else
        print_warning "Some environment variables might be missing"
    fi
else
    print_warning ".env.local file not found"
fi

# Check 5: Package.json scripts
print_status "Checking package.json scripts..."
if npm run --silent 2>/dev/null | grep -q "build\|dev\|start"; then
    print_success "Essential npm scripts are available"
else
    print_warning "Some npm scripts might be missing"
fi

# Summary
echo ""
echo "🏁 Build Quality Check Complete"
echo "================================"
print_success "Ready for development/deployment!"
echo ""
echo "💡 Quick commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run start   - Start production server"
echo ""
echo "📚 See BUILD_CHECKLIST.md for detailed guidelines"