# Public Pages Documentation

## Overview
Anonymous user experience for browsing vendor catalogs and discovering products.

## URL Structure

### Vendor Page URLs
```
Primary: /vendors/[vendorSlug]
Examples:
- /vendors/tech-solutions
- /vendors/local-bakery
- /vendors/fashion-boutique
```

### Category Filtering
```
/vendors/[vendorSlug]?category=[categoryId]
/vendors/[vendorSlug]/categories/[categorySlug]
```

### Product Details (Future)
```
/vendors/[vendorSlug]/products/[productSlug]
```

## Page Components

### Vendor Header
```
Components:
- Vendor logo
- Business name
- Business description
- Contact button (prominent)
- Social media links
- QR code for sharing
```

### Navigation
```
Elements:
- Category tabs/sidebar
- Search bar (within vendor products)
- Filter options (price, newest, etc.)
- Product count display
```

### Product Grid
```
Product Card Contents:
- Product image (primary)
- Product name
- Price (if available)
- Category badge
- "View Details" action
```

## User Journey

### Landing on Vendor Page
1. **Entry Points:**
   - QR code scan
   - Direct link share
   - Search engine results
   - Directory browsing

2. **First Impression:**
   - Vendor branding display
   - Product overview
   - Clear navigation options

3. **Browsing Experience:**
   - Category filtering
   - Product search
   - Infinite scroll or pagination

### Product Discovery
```
User Actions:
- Browse by category
- Search products
- Filter by price/date
- View product details
- Contact vendor
```

## Data Loading Strategy

### Server-Side Rendering (SSR)
```javascript
// /vendors/[slug]/page.tsx
export async function generateStaticParams() {
  // Pre-generate pages for active vendors
  const vendors = await getActiveVendors();
  return vendors.map(vendor => ({ slug: vendor.slug }));
}

export default async function VendorPage({ params }) {
  const vendor = await getVendorBySlug(params.slug);
  const products = await getVendorProducts(vendor.id);
  const categories = await getVendorCategories(vendor.id);
  
  return <VendorPageContent vendor={vendor} products={products} categories={categories} />;
}
```

### Performance Optimization
- Static generation for vendor pages
- Image optimization with Next.js Image
- Lazy loading for product images
- CDN caching for static assets

## Database Queries

### Vendor Page Data
```sql
-- Get vendor information
SELECT v.*, COUNT(p.id) as product_count
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id AND p.status = 'active'
WHERE v.slug = ? AND v.status = 'active'
GROUP BY v.id;

-- Get vendor categories with product counts
SELECT c.*, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.status = 'active'
WHERE c.vendor_id = ? AND c.is_active = true
GROUP BY c.id
ORDER BY c.display_order;

-- Get vendor products with pagination
SELECT p.*, pi.url as primary_image, c.name as category_name
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.display_order = 1
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.vendor_id = ? AND p.status = 'active'
ORDER BY p.created_at DESC
LIMIT ? OFFSET ?;
```

## Frontend Components

### Main Components
```typescript
// VendorPage - Main page wrapper
// VendorHeader - Business info and branding
// CategoryNavigation - Category filtering
// ProductGrid - Product display with infinite scroll
// ProductCard - Individual product display
// ContactCTA - Contact vendor button
// SearchBar - Product search within vendor
```

### Responsive Design
```css
/* Mobile-first approach */
.vendor-page {
  grid-template-areas: 
    "header"
    "navigation"  
    "products";
}

/* Desktop layout */
@media (min-width: 768px) {
  .vendor-page {
    grid-template-areas: 
      "header header"
      "navigation products";
  }
}
```

## SEO Optimization

### Meta Tags
```html
<!-- Vendor page meta -->
<title>{vendorName} - Product Catalog | EasyBuilder</title>
<meta name="description" content="{vendorDescription} - Browse our {productCount} products" />
<meta property="og:title" content="{vendorName} Catalog" />
<meta property="og:description" content="{vendorDescription}" />
<meta property="og:image" content="{vendorLogo}" />
<meta property="og:url" content="/vendors/{vendorSlug}" />
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{vendorName}",
  "description": "{vendorDescription}",
  "url": "/vendors/{vendorSlug}",
  "logo": "{vendorLogo}",
  "address": "{vendorAddress}",
  "telephone": "{vendorPhone}"
}
```

## Search & Filtering

### Client-Side Filtering
```typescript
interface FilterState {
  category: string | null;
  search: string;
  sortBy: 'newest' | 'oldest' | 'price-low' | 'price-high';
  priceRange: [number, number] | null;
}
```

### Search Implementation
```javascript
// Debounced search
const searchProducts = useMemo(
  () => debounce((query: string) => {
    setFilteredProducts(
      products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, 300),
  [products]
);
```

## Analytics Tracking

### Page Views
```javascript
// Track vendor page visits
useEffect(() => {
  analytics.track('vendor_page_viewed', {
    vendor_id: vendor.id,
    vendor_slug: vendor.slug,
    referrer: document.referrer,
    user_agent: navigator.userAgent
  });
}, [vendor]);
```

### Product Interactions
```javascript
// Track product card clicks
const handleProductClick = (product) => {
  analytics.track('product_clicked', {
    product_id: product.id,
    vendor_id: vendor.id,
    category: product.category.name,
    position: index
  });
};
```

## Error Handling

### Vendor Not Found
```typescript
// 404 page for invalid vendor slugs
if (!vendor) {
  return (
    <NotFoundPage 
      title="Vendor Not Found"
      message="The vendor you're looking for doesn't exist or is no longer active."
      action={{ text: "Browse Vendors", href: "/vendors" }}
    />
  );
}
```

### No Products
```typescript
// Empty state for vendors without products
if (products.length === 0) {
  return (
    <EmptyState 
      icon={<Package />}
      title="No Products Yet"
      message="This vendor hasn't added any products to their catalog yet."
    />
  );
}
```

## Accessibility

### WCAG Compliance
- Alt text for all product images
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliance
- Focus indicators

### Semantic HTML
```html
<main role="main">
  <header role="banner">
    <h1>{vendorName}</h1>
  </header>
  <nav role="navigation" aria-label="Product categories">
    <!-- Category navigation -->
  </nav>
  <section role="region" aria-label="Products">
    <!-- Product grid -->
  </section>
</main>
```

## Future Enhancements

### Phase 2 Features
- Product detail pages
- Shopping cart functionality
- Wishlist/favorites
- Product reviews
- Vendor ratings

### Advanced Filtering
- Price range slider
- Availability status
- Product attributes
- Advanced search with filters