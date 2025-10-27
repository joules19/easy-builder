# Database Schema Design

## Overview
Complete PostgreSQL schema for the EasyBuilder multi-tenant vendor catalog platform using Supabase.

## Core Tables

### 1. Vendors (Main Entity)
```sql
CREATE TABLE vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  website VARCHAR(500),
  logo_url VARCHAR(500),
  
  -- QR Code & Sharing
  qr_code_url TEXT,
  qr_code_generated_at TIMESTAMPTZ,
  qr_scan_count INTEGER DEFAULT 0,
  
  -- Business Info
  operating_hours JSONB,
  social_media JSONB,
  contact_preferences JSONB,
  
  -- Account Management
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'archived')),
  plan_type VARCHAR(20) DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'enterprise')),
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Supabase Auth Integration
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_created_at ON vendors(created_at);
```

### 2. Categories
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique category name per vendor
  UNIQUE(vendor_id, name)
);

CREATE INDEX idx_categories_vendor_id ON categories(vendor_id);
CREATE INDEX idx_categories_display_order ON categories(vendor_id, display_order);
CREATE INDEX idx_categories_active ON categories(vendor_id, is_active);
```

### 3. Products
```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Product Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  sku VARCHAR(100),
  
  -- Status & Management
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
  view_count INTEGER DEFAULT 0,
  
  -- SEO & Search
  search_vector TSVECTOR,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique SKU per vendor
  UNIQUE(vendor_id, sku)
);

-- Indexes for performance and search
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(vendor_id, status);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.name, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' || 
    COALESCE(NEW.sku, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();
```

### 4. Product Images
```sql
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(product_id, display_order)
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);
```

## Analytics Tables

### 5. QR Scans Tracking
```sql
CREATE TABLE qr_scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Tracking Info
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  referrer TEXT,
  ip_address INET,
  
  -- UTM Tracking
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),
  
  -- Geographic Info (optional)
  country VARCHAR(2),
  city VARCHAR(100)
);

CREATE INDEX idx_qr_scans_vendor_id ON qr_scans(vendor_id);
CREATE INDEX idx_qr_scans_date ON qr_scans(vendor_id, scanned_at);
CREATE INDEX idx_qr_scans_utm_source ON qr_scans(vendor_id, utm_source);
```

### 6. Contact Interactions
```sql
CREATE TABLE contact_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Interaction Details
  interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('phone', 'email', 'location', 'social', 'whatsapp')),
  interaction_value VARCHAR(255),
  
  -- Tracking Info
  user_ip INET,
  user_agent TEXT,
  referrer TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_interactions_vendor_id ON contact_interactions(vendor_id);
CREATE INDEX idx_contact_interactions_type ON contact_interactions(vendor_id, interaction_type);
CREATE INDEX idx_contact_interactions_date ON contact_interactions(vendor_id, created_at);
```

### 7. Page Views (Optional Analytics)
```sql
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  
  -- Page Info
  page_path VARCHAR(500),
  page_title VARCHAR(255),
  
  -- Visitor Info
  visitor_id VARCHAR(100), -- Anonymous tracking
  session_id VARCHAR(100),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  
  -- Performance
  load_time INTEGER, -- milliseconds
  
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_views_vendor_id ON page_views(vendor_id);
CREATE INDEX idx_page_views_date ON page_views(vendor_id, viewed_at);
CREATE INDEX idx_page_views_visitor ON page_views(visitor_id);
```

## Row Level Security (RLS)

### Vendors Table Security
```sql
-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Vendors can only see their own data
CREATE POLICY vendor_isolation ON vendors
  FOR ALL USING (auth.uid() = user_id);

-- Public can read active vendor basic info (for public pages)
CREATE POLICY vendor_public_read ON vendors
  FOR SELECT USING (status = 'active');
```

### Products Table Security
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Vendors can manage their own products
CREATE POLICY product_vendor_access ON products
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );

-- Public can read active products from active vendors
CREATE POLICY product_public_read ON products
  FOR SELECT USING (
    status = 'active' AND 
    vendor_id IN (
      SELECT id FROM vendors WHERE status = 'active'
    )
  );
```

### Categories Table Security
```sql
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Vendors can manage their own categories
CREATE POLICY category_vendor_access ON categories
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );

-- Public can read active categories from active vendors
CREATE POLICY category_public_read ON categories
  FOR SELECT USING (
    is_active = true AND 
    vendor_id IN (
      SELECT id FROM vendors WHERE status = 'active'
    )
  );
```

### Analytics Tables Security
```sql
-- QR Scans - vendors can only see their own analytics
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY qr_scans_vendor_access ON qr_scans
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );

-- Contact Interactions - vendors can only see their own
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY contact_interactions_vendor_access ON contact_interactions
  FOR ALL USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE user_id = auth.uid()
    )
  );
```

## Database Functions

### Automatic Updated_at Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Slug Generation Function
```sql
CREATE OR REPLACE FUNCTION generate_unique_slug(vendor_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Create base slug
  base_slug := lower(trim(regexp_replace(vendor_name, '[^a-zA-Z0-9\s]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := substring(base_slug from 1 for 50);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM vendors WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;
```

### Analytics Helper Functions
```sql
-- Get vendor analytics summary
CREATE OR REPLACE FUNCTION get_vendor_analytics(vendor_uuid UUID, days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'qr_scans', (
      SELECT json_build_object(
        'total', COUNT(*),
        'today', COUNT(*) FILTER (WHERE DATE(scanned_at) = CURRENT_DATE),
        'this_week', COUNT(*) FILTER (WHERE scanned_at >= CURRENT_DATE - INTERVAL '7 days')
      )
      FROM qr_scans 
      WHERE vendor_id = vendor_uuid 
        AND scanned_at >= CURRENT_DATE - INTERVAL '%s days', days
    ),
    'contacts', (
      SELECT json_build_object(
        'total', COUNT(*),
        'by_type', json_object_agg(interaction_type, type_count)
      )
      FROM (
        SELECT interaction_type, COUNT(*) as type_count
        FROM contact_interactions
        WHERE vendor_id = vendor_uuid
          AND created_at >= CURRENT_DATE - INTERVAL '%s days', days
        GROUP BY interaction_type
      ) contact_stats
    ),
    'products', (
      SELECT json_build_object(
        'total', COUNT(*),
        'active', COUNT(*) FILTER (WHERE status = 'active'),
        'total_views', COALESCE(SUM(view_count), 0)
      )
      FROM products
      WHERE vendor_id = vendor_uuid
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Performance Optimizations

### Database Partitioning (Future)
```sql
-- For high-volume analytics tables
-- Partition qr_scans by month
CREATE TABLE qr_scans_y2024m01 PARTITION OF qr_scans
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### Materialized Views for Analytics
```sql
-- Daily vendor stats (refresh nightly)
CREATE MATERIALIZED VIEW vendor_daily_stats AS
SELECT 
  v.id as vendor_id,
  v.name as vendor_name,
  DATE(qs.scanned_at) as stat_date,
  COUNT(qs.id) as qr_scans,
  COUNT(DISTINCT qs.ip_address) as unique_visitors,
  COUNT(ci.id) as contact_attempts
FROM vendors v
LEFT JOIN qr_scans qs ON v.id = qs.vendor_id
LEFT JOIN contact_interactions ci ON v.id = ci.vendor_id 
  AND DATE(ci.created_at) = DATE(qs.scanned_at)
WHERE v.status = 'active'
GROUP BY v.id, v.name, DATE(qs.scanned_at);

CREATE UNIQUE INDEX ON vendor_daily_stats (vendor_id, stat_date);
```

## Migration Strategy

### Phase 1: Core Tables
1. Create vendors, categories, products, product_images
2. Set up basic RLS policies
3. Create essential indexes

### Phase 2: Analytics
1. Add qr_scans, contact_interactions tables
2. Implement tracking functions
3. Set up analytics RLS

### Phase 3: Optimization
1. Add materialized views
2. Implement advanced indexes
3. Add partitioning if needed

This schema provides a solid foundation for the multi-tenant vendor platform with proper security, performance optimization, and comprehensive analytics tracking.