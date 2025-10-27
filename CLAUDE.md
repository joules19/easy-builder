# Claude Code Context - EasyBuilder Project

## Project Overview
EasyBuilder is a multi-tenant vendor catalog platform that allows vendors to create their own online presence with QR code sharing capabilities. Think of it as a simple way for local businesses to showcase their products online without building a full e-commerce site.

## Current Status
**Phase:** Phase 1 Foundation 95% Complete
**Progress:** 77% overall (23/30 features completed)
**Next:** Supabase setup, then Phase 2 Core Features

## Key Architecture Decisions

### Tech Stack
- **Frontend:** Next.js 14 (App Router) with TypeScript
- **Database:** Supabase (PostgreSQL with RLS)
- **Auth:** Supabase Auth
- **Deployment:** Vercel
- **Images:** Cloudinary CDN
- **Caching:** Upstash Redis
- **Analytics:** PostHog + Vercel Analytics

### Database Design
- Multi-tenant architecture with Row Level Security (RLS)
- 7 main tables: vendors, categories, products, product_images, qr_scans, contact_interactions, page_views
- Full-text search capabilities
- Comprehensive analytics tracking

### Core Features
1. **Vendor Management:** Registration, profile setup, business information
2. **Product Catalog:** Categories, products, multiple images per product
3. **Public Pages:** `/vendors/[slug]` for each vendor's catalog
4. **QR Codes:** Auto-generated for each vendor with analytics tracking
5. **Contact System:** Click-to-call, email, social media links
6. **Analytics:** Page views, QR scans, contact attempts

## File Structure
```
/docs/
├── features/           # Detailed feature documentation
├── DATABASE_SCHEMA.md  # Complete database design
├── AUTH_SYSTEM.md      # Authentication & authorization
├── INFRASTRUCTURE.md   # Deployment & infrastructure
├── PERFORMANCE.md      # Caching & optimization
└── DEVELOPMENT_WORKFLOW.md

/database/
├── migrations/         # SQL migration files
├── seeds/             # Sample data
└── README.md          # Database setup guide

PROGRESS.md            # Main progress tracking
```

## Development Guidelines

### Always Update Progress
- Mark completed tasks in PROGRESS.md with [x]
- Update weekly progress sections
- Track metrics and completion percentages

### Code Conventions
- Use TypeScript for type safety
- Follow Next.js 14 App Router patterns
- Implement proper error handling
- Use Tailwind CSS for styling
- Create reusable components

### Security Considerations
- All database access uses RLS policies
- Vendor data isolation is critical
- No vendor can access another vendor's data
- Public pages only show active vendors/products

### Performance Requirements
- Target Lighthouse score: 95+
- Vendor pages load < 1.5s
- Image optimization with Cloudinary
- Multi-layer caching strategy

## Common Commands & Patterns

### Database Queries
```sql
-- Get vendor with products (optimized)
SELECT v.*, COUNT(p.id) as product_count
FROM vendors v
LEFT JOIN products p ON v.id = p.vendor_id AND p.status = 'active'
WHERE v.slug = ? AND v.status = 'active'
GROUP BY v.id;
```

### Auth Patterns
```typescript
// Server component auth check
const session = await requireAuth()
const vendor = await getVendor(session.user.id)

// Client component auth
const { user, vendor } = useAuth()
```

### Caching Strategy
- Browser: Static assets (1 year), API responses (1 minute)
- CDN: Images (1 month), vendor pages (1 hour ISR)
- Redis: Vendor catalogs (10 min), search results (5 min)

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2) - 95% COMPLETE
- [x] Create Next.js application
- [x] Implement authentication
- [x] Basic vendor registration
- [x] Public vendor pages
- [ ] Set up Supabase project (manual step needed)
- [ ] Deploy to Vercel

### Phase 2: Core Features (Weeks 3-4)
- [ ] Vendor dashboard
- [ ] Product/category management
- [ ] Public vendor pages
- [ ] QR code system

### Phase 3: Polish & Launch (Weeks 5-6)
- [ ] Contact system
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Production launch

## Key Relationships
- Each vendor has many categories and products
- Products belong to one category (optional)
- Product images are separate table (multiple per product)
- All analytics tie back to vendor_id
- RLS ensures vendor data isolation

## Environment Variables Needed
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Redis
REDIS_URL=
REDIS_TOKEN=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
```

## Important Notes
- Vendor slugs must be unique and URL-friendly
- All vendor pages are public but data is isolated
- QR codes track scans with UTM parameters
- Mobile-first responsive design is essential
- SEO optimization for vendor pages is critical

## Testing Strategy
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for critical user journeys
- Performance testing for large catalogs
- Security testing for RLS policies

When implementing features, always:
1. Update PROGRESS.md first
2. Follow the documented architecture
3. Implement proper error handling
4. Add loading states for better UX
5. Test vendor data isolation
6. Optimize for performance
7. Update relevant documentation