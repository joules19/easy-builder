# Catalog Management Documentation

## Overview
Complete product and category management system for vendors to organize their offerings.

## Category Management

### Category Creation Flow
**Dashboard -> Categories -> Add New Category**

```
Category Form Fields:
- Name (required, unique per vendor)
- Description (optional)
- Display Order (auto-increment)
- Status (active/inactive)
```

**Backend Operations:**
```sql
INSERT INTO categories (vendor_id, name, description, display_order, is_active)
VALUES (vendor_id, name, description, next_order, true);
```

### Category Features
- Drag-and-drop reordering
- Bulk activate/deactivate
- Product count per category
- Empty category handling

## Product Management

### Product Creation Workflow
**Dashboard -> Products -> Add Product**

```
Product Form:
- Name (required)
- Description (rich text editor)
- Category (dropdown, vendor's categories)
- Price (optional, format validation)
- SKU (optional, unique per vendor)
- Images (multiple upload, max 5)
- Status (draft/active/inactive)
```

### Image Management
**Upload System:**
- Multiple image upload (drag & drop)
- Image compression and optimization
- CDN storage (Cloudinary)
- Alt text for accessibility
- Display order management

**Image Operations:**
```sql
INSERT INTO product_images (product_id, url, alt_text, display_order)
VALUES (product_id, cloudinary_url, alt_text, order);
```

### Product States
```
draft -> active (publish product)
active -> inactive (temporarily hide)
inactive -> active (republish)
active -> archived (soft delete)
```

## Bulk Operations

### Bulk Product Actions
- Bulk category assignment
- Bulk status changes
- Bulk pricing updates
- Bulk image updates
- Export to CSV

### Import System
- CSV import with validation
- Image bulk upload via ZIP
- Template download
- Error handling and reporting

## Database Schema

### Products Table
```sql
products:
- id (uuid, primary key)
- vendor_id (uuid, foreign key)
- category_id (uuid, foreign key, nullable)
- name (varchar, required)
- description (text)
- price (decimal, nullable)
- sku (varchar, unique per vendor)
- status (enum: draft, active, inactive, archived)
- view_count (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

### Categories Table
```sql
categories:
- id (uuid, primary key)
- vendor_id (uuid, foreign key)
- name (varchar, required)
- description (text)
- display_order (integer)
- is_active (boolean, default true)
- product_count (integer, computed)
- created_at (timestamp)
```

## API Endpoints

### Category Management
- `GET /api/vendors/[id]/categories` - List categories
- `POST /api/vendors/[id]/categories` - Create category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category
- `PUT /api/categories/reorder` - Bulk reorder

### Product Management
- `GET /api/vendors/[id]/products` - List products with filters
- `POST /api/vendors/[id]/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Archive product
- `POST /api/products/[id]/images` - Upload images

### Bulk Operations
- `PUT /api/products/bulk-update` - Bulk status/category changes
- `POST /api/products/import` - CSV import
- `GET /api/products/export` - CSV export

## Frontend Components

### Pages
- `/dashboard/categories` - Category management
- `/dashboard/products` - Product listing
- `/dashboard/products/new` - Create product
- `/dashboard/products/[id]/edit` - Edit product

### Components
- `CategoryManager` - CRUD operations
- `ProductForm` - Create/edit product
- `ImageUploader` - Multiple image handling
- `BulkActions` - Bulk operation controls
- `ProductTable` - Searchable product list

## Search & Filtering

### Product Filters
- Category filter
- Status filter
- Price range
- Date created range
- Text search (name, description, SKU)

### Search Implementation
```sql
-- Full-text search
SELECT * FROM products 
WHERE vendor_id = ? 
AND (name ILIKE ? OR description ILIKE ?)
AND status = 'active'
ORDER BY created_at DESC;
```

## Validation Rules

### Product Validation
- Name: 1-200 characters
- Description: Max 2000 characters
- Price: Positive number, max 2 decimal places
- SKU: Alphanumeric, unique per vendor
- Images: Max 5 images, 5MB each

### Category Validation
- Name: 1-100 characters, unique per vendor
- Description: Max 500 characters
- Cannot delete category with products

## Performance Optimization

### Caching Strategy
- Category list cached per vendor
- Product counts cached and updated on changes
- Image URLs cached with CDN headers

### Database Optimization
- Indexes on vendor_id, category_id, status
- Soft deletes for products (archived status)
- Pagination for large product lists

## Analytics Integration

### Product Analytics
- View count tracking
- Popular products identification
- Category performance metrics
- Inventory insights

### Tracking Events
```javascript
// Track product views
analytics.track('product_viewed', {
  product_id: product.id,
  vendor_id: vendor.id,
  category: product.category.name
});
```