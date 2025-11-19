#!/bin/bash

# ============================================
# E-Commerce Platform - Complete Page Testing
# ============================================
# This script tests every page and endpoint
# Usage: chmod +x test-all-pages.sh && ./test-all-pages.sh

echo "🧪 Starting Comprehensive Page Testing..."
echo "=========================================="
echo ""

# Base URL
BASE_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL=0
PASSED=0
FAILED=0

# Test function
test_page() {
    local name=$1
    local url=$2
    local expected=${3:-200}

    TOTAL=$((TOTAL + 1))

    echo -n "Testing $name... "

    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url")

    if [ "$STATUS" -eq "$expected" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $STATUS)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected, got $STATUS)"
        FAILED=$((FAILED + 1))
    fi
}

echo "📄 PUBLIC PAGES"
echo "---------------"
test_page "Homepage" "/"
test_page "Login Page" "/login"
test_page "Register Page" "/register"
test_page "Search Page" "/search"
echo ""

echo "🛍️ SHOP PAGES (May need database)"
echo "----------------------------------"
test_page "Products Page" "/products"
test_page "Checkout Page" "/checkout"
echo ""

echo "👤 USER ACCOUNT PAGES (Need auth)"
echo "----------------------------------"
test_page "Account Dashboard" "/account"
test_page "Account Profile" "/account/profile"
test_page "Account Orders" "/account/orders"
test_page "Account Addresses" "/account/addresses"
test_page "Account Wishlist" "/account/wishlist"
test_page "Account Settings" "/account/settings"
echo ""

echo "🔧 ADMIN PAGES (Need auth + admin role)"
echo "----------------------------------------"
test_page "Admin Dashboard" "/admin"
test_page "Admin Products" "/admin/products"
test_page "Admin Add Product" "/admin/products/add"
test_page "Admin Orders" "/admin/orders"
test_page "Admin Customers" "/admin/customers"
test_page "Admin Analytics" "/admin/analytics"
test_page "Admin Settings" "/admin/settings"
echo ""

echo "🔌 API ENDPOINTS"
echo "----------------"
test_page "Products API" "/api/products"
test_page "Categories API" "/api/categories"
echo ""

echo "📊 SUMMARY"
echo "=========================================="
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Check database connection if needed.${NC}"
    exit 1
fi
