-- ========================================
-- E-Commerce Platform - Seed Data
-- ========================================
-- Run this after creating the database schema
-- This adds test data for development

-- ========================================
-- 1. CREATE TEST USERS
-- ========================================

-- Admin User (email: admin@shop.com, password: admin123)
INSERT INTO users (id, email, first_name, last_name, password_hash, is_admin, role, email_verified, created_at, updated_at)
VALUES (
  'admin-user-id-001',
  'admin@shop.com',
  'Admin',
  'User',
  '$2a$10$YXmHZ7o8AKQiQJ7WcqRqkO6F9Y6XzxQYz7Z1QxX6Q7X6Q7X6Q7X6Qu', -- admin123 (you should hash this properly)
  true,
  'admin',
  NOW(),
  NOW(),
  NOW()
);

-- Regular Customer (email: customer@test.com, password: customer123)
INSERT INTO users (id, email, first_name, last_name, password_hash, is_admin, role, email_verified, created_at, updated_at)
VALUES (
  'customer-user-id-001',
  'customer@test.com',
  'John',
  'Doe',
  '$2a$10$YXmHZ7o8AKQiQJ7WcqRqkO6F9Y6XzxQYz7Z1QxX6Q7X6Q7X6Q7X6Qu', -- customer123
  false,
  'customer',
  NOW(),
  NOW(),
  NOW()
);

-- ========================================
-- 2. CREATE CATEGORIES
-- ========================================

INSERT INTO categories (id, name, slug, description, is_active, created_at, updated_at) VALUES
('cat-electronics-001', 'Electronics', 'electronics', 'Electronic devices and accessories', true, NOW(), NOW()),
('cat-fashion-001', 'Fashion', 'fashion', 'Clothing and accessories', true, NOW(), NOW()),
('cat-home-001', 'Home & Living', 'home-living', 'Home decor and furniture', true, NOW(), NOW()),
('cat-sports-001', 'Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', true, NOW(), NOW()),
('cat-books-001', 'Books', 'books', 'Books and educational materials', true, NOW(), NOW());

-- Subcategories for Electronics
INSERT INTO categories (id, name, slug, description, parent_id, is_active, created_at, updated_at) VALUES
('cat-phones-001', 'Smartphones', 'smartphones', 'Mobile phones and accessories', 'cat-electronics-001', true, NOW(), NOW()),
('cat-laptops-001', 'Laptops', 'laptops', 'Laptops and notebooks', 'cat-electronics-001', true, NOW(), NOW()),
('cat-audio-001', 'Audio', 'audio', 'Headphones, speakers, and audio equipment', 'cat-electronics-001', true, NOW(), NOW());

-- ========================================
-- 3. CREATE PRODUCTS
-- ========================================

-- Product 1: iPhone 15 Pro
INSERT INTO products (id, name, slug, description, price, sale_price, cost_price, sku, brand, stock_quantity, category_id, status, is_featured, is_new_arrival, meta_title, meta_description, created_at, updated_at)
VALUES (
  'prod-iphone15-001',
  'iPhone 15 Pro',
  'iphone-15-pro',
  'Latest iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. Experience the ultimate in smartphone technology.',
  449999,
  429999,
  350000,
  'IPH15PRO-001',
  'Apple',
  50,
  'cat-phones-001',
  'active',
  true,
  true,
  'iPhone 15 Pro - Latest Apple Smartphone',
  'Buy iPhone 15 Pro with titanium design and A17 Pro chip',
  NOW(),
  NOW()
);

-- Product Images for iPhone 15 Pro
INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-iphone15-001', 'prod-iphone15-001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'iPhone 15 Pro Front View', true, 1, NOW(), NOW()),
('img-iphone15-002', 'prod-iphone15-001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 'iPhone 15 Pro Back View', false, 2, NOW(), NOW());

-- Product Attributes for iPhone 15 Pro
INSERT INTO product_attributes (id, product_id, name, value, created_at, updated_at) VALUES
('attr-iphone15-001', 'prod-iphone15-001', 'Screen Size', '6.1 inches', NOW(), NOW()),
('attr-iphone15-002', 'prod-iphone15-001', 'Processor', 'A17 Pro', NOW(), NOW()),
('attr-iphone15-003', 'prod-iphone15-001', 'Camera', '48MP Main, 12MP Ultra Wide', NOW(), NOW()),
('attr-iphone15-004', 'prod-iphone15-001', 'Battery', 'All-day battery life', NOW(), NOW());

-- Product Variants for iPhone 15 Pro (Storage options)
INSERT INTO product_variants (id, product_id, name, value, sku, price_adjustment, stock_quantity, created_at, updated_at) VALUES
('var-iphone15-128gb', 'prod-iphone15-001', 'Storage', '128GB', 'IPH15PRO-128GB', 0, 20, NOW(), NOW()),
('var-iphone15-256gb', 'prod-iphone15-001', 'Storage', '256GB', 'IPH15PRO-256GB', 30000, 15, NOW(), NOW()),
('var-iphone15-512gb', 'prod-iphone15-001', 'Storage', '512GB', 'IPH15PRO-512GB', 70000, 10, NOW(), NOW());

-- Product 2: MacBook Pro 14"
INSERT INTO products (id, name, slug, description, price, sale_price, cost_price, sku, brand, stock_quantity, category_id, status, is_featured, is_new_arrival, created_at, updated_at)
VALUES (
  'prod-macbook14-001',
  'MacBook Pro 14"',
  'macbook-pro-14',
  'Supercharged by M3 Pro or M3 Max chip. The most advanced Mac laptop ever for demanding workflows.',
  599999,
  NULL,
  480000,
  'MBP14-001',
  'Apple',
  25,
  'cat-laptops-001',
  'active',
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-macbook14-001', 'prod-macbook14-001', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'MacBook Pro 14 inch', true, 1, NOW(), NOW());

-- Product 3: AirPods Pro (2nd Gen)
INSERT INTO products (id, name, slug, description, price, cost_price, sku, brand, stock_quantity, category_id, status, is_featured, created_at, updated_at)
VALUES (
  'prod-airpods-001',
  'AirPods Pro (2nd Gen)',
  'airpods-pro-2nd-gen',
  'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio. Up to 2x more noise cancellation.',
  74999,
  55000,
  'AIRPODS-PRO2',
  'Apple',
  100,
  'cat-audio-001',
  'active',
  true,
  NOW(),
  NOW()
);

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-airpods-001', 'prod-airpods-001', 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', 'AirPods Pro', true, 1, NOW(), NOW());

-- Product 4: Samsung Galaxy S24 Ultra
INSERT INTO products (id, name, slug, description, price, sale_price, cost_price, sku, brand, stock_quantity, category_id, status, is_featured, is_new_arrival, created_at, updated_at)
VALUES (
  'prod-s24ultra-001',
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'The ultimate Samsung Galaxy with AI-powered features, 200MP camera, and S Pen.',
  419999,
  399999,
  320000,
  'S24-ULTRA-001',
  'Samsung',
  40,
  'cat-phones-001',
  'active',
  true,
  true,
  NOW(),
  NOW()
);

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-s24ultra-001', 'prod-s24ultra-001', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 'Samsung Galaxy S24 Ultra', true, 1, NOW(), NOW());

-- Product 5: Sony WH-1000XM5 Headphones
INSERT INTO products (id, name, slug, description, price, cost_price, sku, brand, stock_quantity, category_id, status, is_featured, created_at, updated_at)
VALUES (
  'prod-sony-xm5-001',
  'Sony WH-1000XM5',
  'sony-wh-1000xm5',
  'Industry-leading noise canceling headphones with exceptional sound quality and all-day comfort.',
  89999,
  65000,
  'SONY-XM5-001',
  'Sony',
  60,
  'cat-audio-001',
  'active',
  true,
  NOW(),
  NOW()
);

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-sony-xm5-001', 'prod-sony-xm5-001', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', 'Sony WH-1000XM5 Headphones', true, 1, NOW(), NOW());

-- Product 6: Dell XPS 13
INSERT INTO products (id, name, slug, description, price, cost_price, sku, brand, stock_quantity, category_id, status, created_at, updated_at)
VALUES (
  'prod-dell-xps13-001',
  'Dell XPS 13',
  'dell-xps-13',
  'Ultra-portable 13-inch laptop with stunning InfinityEdge display and powerful performance.',
  299999,
  230000,
  'DELL-XPS13-001',
  'Dell',
  30,
  'cat-laptops-001',
  'active',
  false,
  NOW(),
  NOW()
);

INSERT INTO product_images (id, product_id, url, alt_text, is_primary, display_order, created_at, updated_at) VALUES
('img-dell-xps13-001', 'prod-dell-xps13-001', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800', 'Dell XPS 13 Laptop', true, 1, NOW(), NOW());

-- ========================================
-- 4. CREATE REVIEWS
-- ========================================

INSERT INTO reviews (id, product_id, user_id, rating, title, comment, status, created_at, updated_at) VALUES
('rev-001', 'prod-iphone15-001', 'customer-user-id-001', 5, 'Amazing phone!', 'The iPhone 15 Pro exceeded all my expectations. The camera is incredible and the performance is blazing fast!', 'approved', NOW(), NOW()),
('rev-002', 'prod-airpods-001', 'customer-user-id-001', 5, 'Best earbuds ever', 'Amazing noise cancellation and sound quality. Worth every penny!', 'approved', NOW(), NOW()),
('rev-003', 'prod-sony-xm5-001', 'customer-user-id-001', 4, 'Great headphones', 'Excellent sound quality and comfort. Noise cancellation is top-notch!', 'approved', NOW(), NOW());

-- ========================================
-- 5. CREATE COUPONS
-- ========================================

INSERT INTO coupons (id, code, type, value, min_purchase_amount, max_discount_amount, usage_limit, used_count, starts_at, expires_at, is_active, created_at, updated_at) VALUES
('coupon-welcome', 'WELCOME10', 'percentage', 10, 10000, 5000, 100, 0, NOW(), NOW() + INTERVAL '30 days', true, NOW(), NOW()),
('coupon-summer', 'SUMMER2024', 'percentage', 15, 20000, 10000, 50, 0, NOW(), NOW() + INTERVAL '60 days', true, NOW(), NOW()),
('coupon-flat500', 'FLAT500', 'fixed', 500, 5000, NULL, 200, 0, NOW(), NOW() + INTERVAL '90 days', true, NOW(), NOW());

-- ========================================
-- 6. CREATE SHIPPING ADDRESS (for test customer)
-- ========================================

INSERT INTO shipping_addresses (id, user_id, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default, created_at, updated_at) VALUES
('addr-001', 'customer-user-id-001', 'John Doe', '+923001234567', '123 Main Street', 'Apartment 4B', 'Karachi', 'Sindh', '75500', 'Pakistan', true, NOW(), NOW());

-- ========================================
-- 7. VERIFY DATA
-- ========================================

-- Check counts
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'Product Attributes', COUNT(*) FROM product_attributes
UNION ALL
SELECT 'Product Variants', COUNT(*) FROM product_variants
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'Shipping Addresses', COUNT(*) FROM shipping_addresses;

-- ========================================
-- SEED DATA SUMMARY
-- ========================================
-- ✅ 2 Users (1 admin, 1 customer)
-- ✅ 8 Categories (5 main + 3 subcategories)
-- ✅ 6 Products (mix of electronics)
-- ✅ 7 Product Images
-- ✅ 4 Product Attributes
-- ✅ 3 Product Variants
-- ✅ 3 Reviews
-- ✅ 3 Coupons
-- ✅ 1 Shipping Address
-- ========================================

-- Login Credentials:
-- Admin: admin@shop.com / admin123
-- Customer: customer@test.com / customer123
-- ========================================
