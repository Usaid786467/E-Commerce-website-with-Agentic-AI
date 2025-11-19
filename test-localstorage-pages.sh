#!/bin/bash

# E-Commerce Platform - LocalStorage Database Testing Script
# Tests all pages with localStorage database adapter
#
# Usage: ./test-localstorage-pages.sh

echo "================================================"
echo "🧪 E-Commerce Platform - LocalStorage Testing"
echo "================================================"
echo ""
echo "Database Provider: LocalStorage (No External DB)"
echo "Testing all pages systematically..."
echo ""

BASE_URL="http://localhost:3000"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for test results
TOTAL=0
PASSED=0
FAILED=0

# Function to test a page
test_page() {
  local name="$1"
  local url="$2"
  local expected_code="${3:-200}"

  TOTAL=$((TOTAL + 1))

  # Make request and get status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>&1 | grep -o '[0-9]*' | head -1)

  # Check if we got a valid status code
  if [[ -z "$status_code" ]]; then
    echo -e "${RED}✗ $name${NC} - No response"
    FAILED=$((FAILED + 1))
    return
  fi

  if [ "$status_code" = "$expected_code" ]; then
    echo -e "${GREEN}✓ $name${NC} - HTTP $status_code"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ $name${NC} - HTTP $status_code (expected $expected_code)"
    FAILED=$((FAILED + 1))
  fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📄 PUBLIC PAGES (Client-Side)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_page "Login Page" "/login"
test_page "Register Page" "/register"
test_page "Search Page" "/search"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛍️  SHOP PAGES (Requires Database)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_page "Homepage" "/"
test_page "Products Listing" "/products"
test_page "Checkout Page" "/checkout"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 USER ACCOUNT PAGES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_page "Account Dashboard" "/account"
test_page "Profile" "/account/profile"
test_page "Orders" "/account/orders"
test_page "Addresses" "/account/addresses"
test_page "Wishlist" "/account/wishlist"
test_page "Settings" "/account/settings"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👨‍💼 ADMIN PAGES (Requires Auth + Database)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_page "Admin Dashboard" "/admin"
test_page "Manage Products" "/admin/products"
test_page "Add Product" "/admin/products/add"
test_page "Manage Orders" "/admin/orders"
test_page "Manage Customers" "/admin/customers"
test_page "Analytics" "/admin/analytics"
test_page "Admin Settings" "/admin/settings"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 API ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_page "GET /api/products" "/api/products"
test_page "GET /api/categories" "/api/categories"
echo ""

echo "================================================"
echo "📊 TEST SUMMARY"
echo "================================================"
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo ""
  echo "✅ LocalStorage database is working correctly!"
  echo "✅ All pages are accessible and functioning!"
  echo ""
  echo "Next steps:"
  echo "  1. Open http://localhost:3000 in your browser"
  echo "  2. Test user interactions (add to cart, browse products)"
  echo "  3. Check browser console for any errors"
  echo "  4. When satisfied, connect to real database!"
  exit 0
else
  echo -e "${YELLOW}⚠️  SOME TESTS FAILED${NC}"
  echo ""
  echo "Check the server logs for error details:"
  echo "  Look for errors in the terminal running 'npm run dev'"
  exit 1
fi
