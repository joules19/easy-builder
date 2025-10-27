-- Sample Data for EasyBuilder Development
-- Run this after setting up the initial schema for testing

-- Note: You'll need to create actual auth users first in Supabase Auth UI
-- These UUIDs should match real user IDs from auth.users table

-- =====================================================
-- SAMPLE VENDORS
-- =====================================================

-- Insert sample vendors (replace user_id UUIDs with real ones from your Supabase Auth)
INSERT INTO vendors (
  id, slug, name, description, email, phone, address, website, 
  operating_hours, social_media, contact_preferences, status, user_id
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'tech-solutions-inc',
  'Tech Solutions Inc',
  'Your one-stop shop for all technology needs. We offer laptops, smartphones, accessories, and expert repair services.',
  'contact@techsolutions.com',
  '+1 (555) 123-4567',
  '123 Tech Street, Silicon Valley, CA 94043',
  'https://techsolutions.com',
  '{
    "monday": "9:00 AM - 6:00 PM",
    "tuesday": "9:00 AM - 6:00 PM", 
    "wednesday": "9:00 AM - 6:00 PM",
    "thursday": "9:00 AM - 6:00 PM",
    "friday": "9:00 AM - 6:00 PM",
    "saturday": "10:00 AM - 4:00 PM",
    "sunday": "Closed"
  }',
  '{
    "facebook": "techsolutionsinc",
    "instagram": "techsolutions_inc",
    "twitter": "techsolutions"
  }',
  '{
    "preferred_contact_method": "both",
    "business_hours_only": true,
    "whatsapp_enabled": true,
    "whatsapp_number": "+1 (555) 123-4567"
  }',
  'active',
  'user-uuid-1' -- Replace with actual auth.users.id
),
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'artisan-bakery',
  'Artisan Bakery',
  'Fresh baked goods made daily with organic ingredients. Specializing in sourdough bread, pastries, and custom cakes.',
  'orders@artisanbakery.com',
  '+1 (555) 987-6543',
  '456 Baker Street, Foodie Town, NY 10001',
  'https://artisanbakery.com',
  '{
    "monday": "Closed",
    "tuesday": "6:00 AM - 3:00 PM",
    "wednesday": "6:00 AM - 3:00 PM", 
    "thursday": "6:00 AM - 3:00 PM",
    "friday": "6:00 AM - 3:00 PM",
    "saturday": "7:00 AM - 4:00 PM",
    "sunday": "8:00 AM - 2:00 PM"
  }',
  '{
    "instagram": "artisan_bakery_ny",
    "facebook": "artisanbakeryNY"
  }',
  '{
    "preferred_contact_method": "phone",
    "business_hours_only": true,
    "whatsapp_enabled": false
  }',
  'active',
  'user-uuid-2' -- Replace with actual auth.users.id
),
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'fashion-boutique',
  'Fashion Boutique',
  'Trendy and affordable fashion for modern women. Curated collection of clothing, accessories, and shoes.',
  'hello@fashionboutique.com',
  '+1 (555) 456-7890',
  '789 Style Avenue, Fashion District, LA 90028',
  'https://fashionboutique.com',
  '{
    "monday": "10:00 AM - 8:00 PM",
    "tuesday": "10:00 AM - 8:00 PM",
    "wednesday": "10:00 AM - 8:00 PM",
    "thursday": "10:00 AM - 8:00 PM", 
    "friday": "10:00 AM - 9:00 PM",
    "saturday": "10:00 AM - 9:00 PM",
    "sunday": "12:00 PM - 6:00 PM"
  }',
  '{
    "instagram": "fashion_boutique_la",
    "facebook": "fashionboutiqueLA",
    "twitter": "fashionboutique"
  }',
  '{
    "preferred_contact_method": "email",
    "business_hours_only": false,
    "whatsapp_enabled": true,
    "whatsapp_number": "+1 (555) 456-7890"
  }',
  'active',
  'user-uuid-3' -- Replace with actual auth.users.id
);

-- =====================================================
-- SAMPLE CATEGORIES
-- =====================================================

-- Categories for Tech Solutions Inc
INSERT INTO categories (id, vendor_id, name, description, display_order) VALUES
('cat-tech-1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Laptops', 'Professional and gaming laptops', 1),
('cat-tech-2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Smartphones', 'Latest smartphones and mobile devices', 2),
('cat-tech-3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Accessories', 'Cables, cases, chargers and more', 3),
('cat-tech-4', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Services', 'Repair and consultation services', 4);

-- Categories for Artisan Bakery
INSERT INTO categories (id, vendor_id, name, description, display_order) VALUES
('cat-bakery-1', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Breads', 'Fresh baked artisan breads', 1),
('cat-bakery-2', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Pastries', 'Croissants, muffins, and pastries', 2),
('cat-bakery-3', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Cakes', 'Custom cakes and celebration treats', 3),
('cat-bakery-4', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Beverages', 'Coffee, tea, and fresh juices', 4);

-- Categories for Fashion Boutique
INSERT INTO categories (id, vendor_id, name, description, display_order) VALUES
('cat-fashion-1', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Dresses', 'Casual and formal dresses', 1),
('cat-fashion-2', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Tops', 'Blouses, t-shirts, and sweaters', 2),
('cat-fashion-3', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Bottoms', 'Jeans, pants, and skirts', 3),
('cat-fashion-4', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Accessories', 'Bags, jewelry, and scarves', 4);

-- =====================================================
-- SAMPLE PRODUCTS
-- =====================================================

-- Products for Tech Solutions Inc
INSERT INTO products (id, vendor_id, category_id, name, description, price, sku, status) VALUES
('prod-tech-1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-1', 'MacBook Pro 16"', 'Latest MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for professional work and creative projects.', 2499.99, 'MBP-16-M3-512', 'active'),
('prod-tech-2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-1', 'Dell XPS 13', 'Ultra-portable laptop with Intel i7 processor, 16GB RAM, 256GB SSD. Great for business and travel.', 1299.99, 'DELL-XPS13-i7-256', 'active'),
('prod-tech-3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-2', 'iPhone 15 Pro', 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.', 999.99, 'IP15-PRO-128', 'active'),
('prod-tech-4', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-2', 'Samsung Galaxy S24', 'Flagship Android phone with AI features, excellent camera, and long battery life.', 799.99, 'SGS24-256-BLK', 'active'),
('prod-tech-5', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-3', 'Wireless Charging Pad', 'Fast wireless charging for compatible devices. Sleek design with LED indicator.', 29.99, 'WCP-FAST-15W', 'active'),
('prod-tech-6', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cat-tech-4', 'Device Repair Service', 'Professional repair service for smartphones and laptops. Includes diagnosis and parts.', 89.99, 'REPAIR-DIAG', 'active');

-- Products for Artisan Bakery
INSERT INTO products (id, vendor_id, category_id, name, description, price, sku, status) VALUES
('prod-bakery-1', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-1', 'Sourdough Loaf', 'Traditional sourdough bread made with our 10-year-old starter. Crusty outside, soft inside.', 6.50, 'BREAD-SOUR-LG', 'active'),
('prod-bakery-2', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-1', 'Whole Wheat Bread', 'Nutritious whole wheat bread made with organic flour. Perfect for daily consumption.', 5.50, 'BREAD-WW-LG', 'active'),
('prod-bakery-3', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-2', 'Butter Croissant', 'Flaky, buttery croissant made with French technique. Best enjoyed fresh and warm.', 3.25, 'PASTRY-CROIS-BTR', 'active'),
('prod-bakery-4', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-2', 'Blueberry Muffin', 'Moist muffin packed with fresh blueberries. Made with organic ingredients.', 4.00, 'MUFFIN-BLUE', 'active'),
('prod-bakery-5', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-3', 'Custom Birthday Cake', 'Personalized birthday cake with your choice of flavor and design. Order 48 hours ahead.', 45.00, 'CAKE-BDAY-CUSTOM', 'active'),
('prod-bakery-6', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'cat-bakery-4', 'Organic Coffee', 'Fair trade organic coffee, freshly roasted. Perfect complement to our baked goods.', 3.50, 'COFFEE-ORG-MED', 'active');

-- Products for Fashion Boutique
INSERT INTO products (id, vendor_id, category_id, name, description, price, sku, status) VALUES
('prod-fashion-1', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-1', 'Summer Maxi Dress', 'Flowing maxi dress perfect for summer occasions. Available in multiple colors and patterns.', 89.99, 'DRESS-MAXI-SUM', 'active'),
('prod-fashion-2', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-1', 'Little Black Dress', 'Classic LBD suitable for any occasion. Timeless design with modern fit.', 129.99, 'DRESS-LBD-CLS', 'active'),
('prod-fashion-3', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-2', 'Silk Blouse', 'Elegant silk blouse perfect for office or dinner. Available in white, black, and navy.', 79.99, 'TOP-BLOUSE-SILK', 'active'),
('prod-fashion-4', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-2', 'Cashmere Sweater', 'Luxurious cashmere sweater for cool weather. Soft, warm, and stylish.', 159.99, 'TOP-SWTR-CASH', 'active'),
('prod-fashion-5', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-3', 'High-Waist Jeans', 'Trendy high-waist jeans with comfortable stretch. Flattering fit for all body types.', 69.99, 'BOTTOM-JEAN-HW', 'active'),
('prod-fashion-6', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'cat-fashion-4', 'Designer Handbag', 'Stylish handbag with genuine leather construction. Perfect size for daily essentials.', 199.99, 'ACC-BAG-LEATH', 'active');

-- =====================================================
-- SAMPLE PRODUCT IMAGES
-- =====================================================

-- Sample product images (using placeholder image URLs)
INSERT INTO product_images (product_id, url, alt_text, display_order) VALUES
-- Tech Products
('prod-tech-1', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 'MacBook Pro 16 inch laptop', 0),
('prod-tech-2', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 'Dell XPS 13 ultrabook', 0),
('prod-tech-3', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 'iPhone 15 Pro in titanium', 0),
('prod-tech-4', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 'Samsung Galaxy S24 smartphone', 0),
('prod-tech-5', 'https://images.unsplash.com/photo-1586909101909-aaa0baba40ae?w=500', 'Wireless charging pad', 0),

-- Bakery Products
('prod-bakery-1', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=500', 'Fresh sourdough bread loaf', 0),
('prod-bakery-2', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', 'Whole wheat bread slices', 0),
('prod-bakery-3', 'https://images.unsplash.com/photo-1555507036-ab794f6eb29d?w=500', 'Buttery croissant pastry', 0),
('prod-bakery-4', 'https://images.unsplash.com/photo-1426869981800-95ebf51ce900?w=500', 'Blueberry muffin with berries', 0),
('prod-bakery-5', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500', 'Custom decorated birthday cake', 0),

-- Fashion Products
('prod-fashion-1', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', 'Summer maxi dress on model', 0),
('prod-fashion-2', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500', 'Little black dress elegant', 0),
('prod-fashion-3', 'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500', 'Silk blouse professional', 0),
('prod-fashion-4', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 'Cashmere sweater cozy', 0),
('prod-fashion-5', 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500', 'High-waist jeans trendy', 0);

-- =====================================================
-- SAMPLE ANALYTICS DATA
-- =====================================================

-- Sample QR scans (past 30 days)
INSERT INTO qr_scans (vendor_id, scanned_at, utm_source, utm_medium, ip_address) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '1 day', 'qr', 'scan', '192.168.1.100'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '2 days', 'qr', 'scan', '192.168.1.101'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '3 days', 'qr', 'scan', '192.168.1.102'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NOW() - INTERVAL '1 day', 'qr', 'scan', '192.168.1.103'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NOW() - INTERVAL '5 days', 'qr', 'scan', '192.168.1.104'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NOW() - INTERVAL '2 days', 'qr', 'scan', '192.168.1.105');

-- Sample contact interactions
INSERT INTO contact_interactions (vendor_id, interaction_type, interaction_value, user_ip) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'phone', '+1 (555) 123-4567', '192.168.1.100'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'email', 'contact@techsolutions.com', '192.168.1.101'),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'phone', '+1 (555) 987-6543', '192.168.1.103'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'email', 'hello@fashionboutique.com', '192.168.1.105'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'social', 'instagram', '192.168.1.106');

-- Update QR scan counts for vendors
UPDATE vendors SET qr_scan_count = 3 WHERE id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
UPDATE vendors SET qr_scan_count = 2 WHERE id = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
UPDATE vendors SET qr_scan_count = 1 WHERE id = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';

-- =====================================================
-- VERIFY SAMPLE DATA
-- =====================================================

-- Test queries to verify data
SELECT 'Vendors' as table_name, COUNT(*) as count FROM vendors
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories  
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Product Images', COUNT(*) FROM product_images
UNION ALL
SELECT 'QR Scans', COUNT(*) FROM qr_scans
UNION ALL
SELECT 'Contact Interactions', COUNT(*) FROM contact_interactions;

-- Sample query to test vendor page data
SELECT 
  v.name as vendor_name,
  v.slug,
  COUNT(DISTINCT c.id) as categories,
  COUNT(DISTINCT p.id) as products,
  v.qr_scan_count
FROM vendors v
LEFT JOIN categories c ON v.id = c.vendor_id AND c.is_active = true
LEFT JOIN products p ON v.id = p.vendor_id AND p.status = 'active'
WHERE v.status = 'active'
GROUP BY v.id, v.name, v.slug, v.qr_scan_count;

-- =====================================================
-- NOTES FOR SETUP
-- =====================================================

/*
To use this sample data:

1. First set up the initial schema (001_initial_schema.sql)
2. Create real users in Supabase Auth UI
3. Replace the 'user-uuid-1', 'user-uuid-2', 'user-uuid-3' values 
   with actual UUIDs from auth.users table
4. Run this seed file
5. Test by querying the data through your application

Example to get real user UUIDs:
SELECT id, email FROM auth.users ORDER BY created_at;

Then update the INSERT statements above with real user IDs.
*/