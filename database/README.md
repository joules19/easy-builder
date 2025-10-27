# Database Setup Guide

## Overview
This directory contains all database-related files for the EasyBuilder platform using Supabase (PostgreSQL).

## Structure
```
database/
├── migrations/
│   └── 001_initial_schema.sql    # Initial database schema
├── seeds/
│   └── sample_data.sql           # Sample data for development
└── README.md                     # This file
```

## Setup Instructions

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Note down your project URL and API keys
4. Wait for the project to be fully provisioned

### 2. Run Initial Schema
1. Open the SQL Editor in your Supabase dashboard
2. Copy and paste the entire content of `migrations/001_initial_schema.sql`
3. Run the SQL script
4. Verify all tables and functions were created successfully

### 3. Create Test Users (Development Only)
1. Go to Authentication > Users in Supabase dashboard
2. Create test users manually or enable email signup
3. Note down the user UUIDs for the next step

### 4. Load Sample Data (Optional)
1. Edit `seeds/sample_data.sql`
2. Replace `'user-uuid-1'`, `'user-uuid-2'`, `'user-uuid-3'` with actual user UUIDs
3. Run the modified SQL script in the SQL Editor
4. Verify data was inserted correctly

## Database Schema Overview

### Core Tables
- **vendors** - Main vendor information and business details
- **categories** - Product categories (vendor-specific)
- **products** - Individual products with details
- **product_images** - Multiple images per product

### Analytics Tables
- **qr_scans** - QR code scan tracking
- **contact_interactions** - Contact attempt tracking
- **page_views** - Page view analytics (optional)

### Security Features
- Row Level Security (RLS) enabled on all tables
- Vendor data isolation by user_id
- Public read access for active vendor catalogs
- Anonymous insert for analytics tracking

## Key Features

### Multi-Tenancy
- Each vendor's data is isolated using RLS policies
- Vendors can only access their own data
- Public pages show only active vendor/product data

### Search & Performance
- Full-text search on products (name, description, SKU)
- Optimized indexes for common queries
- Automatic search vector updates

### Analytics
- QR code scan tracking with UTM parameters
- Contact interaction logging
- Vendor statistics and insights

### Audit & Timestamps
- Automatic `created_at` and `updated_at` timestamps
- Trigger-based updates for `updated_at` fields

## Environment Variables Needed

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URL (for direct connections if needed)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

## Common Queries

### Get Vendor with Products
```sql
SELECT 
  v.*,
  COUNT(p.id) as product_count
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id AND p.status = 'active'
WHERE v.slug = 'vendor-slug'
GROUP BY v.id;
```

### Get Vendor Categories with Product Counts
```sql
SELECT 
  c.*,
  COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
WHERE c.vendor_id = 'vendor-uuid' AND c.is_active = true
GROUP BY c.id
ORDER BY c.display_order;
```

### Get Vendor Products with Images
```sql
SELECT 
  p.*,
  pi.url as primary_image,
  c.name as category_name
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.display_order = 0
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.vendor_id = 'vendor-uuid' AND p.status = 'active'
ORDER BY p.created_at DESC;
```

### Get Vendor Analytics
```sql
SELECT get_vendor_analytics('vendor-uuid', 30) as analytics;
```

## Performance Considerations

### Indexes
All tables have appropriate indexes for:
- Primary keys and foreign keys
- Vendor isolation queries
- Search functionality
- Analytics date ranges

### Query Optimization
- Use the provided functions for complex analytics
- Leverage materialized views for heavy reporting
- Consider partitioning for high-volume analytics tables

### Scaling Considerations
- Connection pooling is handled by Supabase
- Consider read replicas for analytics queries
- Monitor query performance in Supabase dashboard

## Security Best Practices

### Row Level Security
- Never disable RLS on production tables
- Test RLS policies thoroughly with different user roles
- Use service role key only for admin operations

### Data Validation
- Use CHECK constraints for enum-like fields
- Validate data at application level before database
- Use foreign key constraints to maintain referential integrity

### Access Control
- Anonymous users can only read public vendor data
- Vendors can only access their own data
- Admin operations require service role key

## Backup & Recovery

### Automatic Backups
- Supabase provides automatic daily backups
- Point-in-time recovery available
- Monitor backup status in dashboard

### Manual Backups
```bash
# Export schema
pg_dump --schema-only postgresql://[connection-string] > schema.sql

# Export data
pg_dump --data-only postgresql://[connection-string] > data.sql
```

## Troubleshooting

### Common Issues

**RLS Policies Not Working:**
- Verify user is authenticated
- Check policy conditions match your query
- Use `auth.uid()` function correctly

**Performance Issues:**
- Check query execution plans
- Verify indexes are being used
- Monitor connection count

**Data Integrity Issues:**
- Check foreign key constraints
- Verify trigger functions are working
- Monitor for constraint violations

### Debugging Queries
```sql
-- Check current user
SELECT auth.uid();

-- Test RLS policy
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM vendors WHERE user_id = auth.uid();

-- Check table statistics
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables;
```

## Migration Strategy

### Future Migrations
1. Create new migration files: `002_add_feature.sql`
2. Test on staging environment first
3. Use transactions for complex migrations
4. Create rollback scripts for critical changes

### Example Migration Template
```sql
-- Migration: 002_add_vendor_settings.sql
BEGIN;

-- Add new column
ALTER TABLE vendors ADD COLUMN settings JSONB DEFAULT '{}';

-- Update existing records
UPDATE vendors SET settings = '{"notifications": true}' WHERE settings IS NULL;

-- Create index if needed
CREATE INDEX idx_vendors_settings ON vendors USING GIN(settings);

COMMIT;
```

This database setup provides a solid foundation for the EasyBuilder platform with proper security, performance, and scalability considerations.