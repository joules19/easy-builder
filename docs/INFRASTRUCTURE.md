# Infrastructure & Deployment Strategy

## Overview
Complete infrastructure setup for EasyBuilder using modern, scalable cloud services with automated deployment pipelines.

## Infrastructure Stack

### Core Services
```
Frontend: Next.js 14 (App Router)
├── Hosting: Vercel
├── CDN: Vercel Edge Network
└── Domain: Custom domain with SSL

Backend: Supabase
├── Database: PostgreSQL with RLS
├── Authentication: Supabase Auth
├── Storage: Supabase Storage
├── Edge Functions: Supabase Functions
└── Real-time: Supabase Realtime

Additional Services:
├── Image CDN: Cloudinary
├── Analytics: Vercel Analytics + PostHog
├── Monitoring: Sentry
├── Email: Resend
└── Caching: Upstash Redis
```

## Environment Architecture

### Development Environment
```
Local Development:
├── Next.js dev server (localhost:3000)
├── Supabase local development
├── Environment: .env.local
└── Database: Local Supabase instance

Tools:
├── Git: Version control
├── VS Code: IDE with extensions
├── Supabase CLI: Local development
└── Vercel CLI: Deployment testing
```

### Staging Environment
```
Staging Deployment:
├── Vercel Preview Deployments
├── Supabase Staging Project
├── Test domain: staging.easybuilder.com
└── Isolated test data

Purpose:
├── Feature testing
├── Integration testing
├── Client demos
└── Pre-production validation
```

### Production Environment
```
Production Deployment:
├── Vercel Production
├── Supabase Production Project
├── Custom domain: easybuilder.com
├── SSL/TLS certificates
├── CDN optimization
└── Performance monitoring
```

## Deployment Pipeline

### Automated CI/CD
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run tests
      - name: Type checking
      - name: Lint code
      - name: Build application

  deploy-staging:
    if: github.event_name == 'pull_request'
    needs: test
    steps:
      - name: Deploy to Vercel Preview
      - name: Run E2E tests
      - name: Update PR status

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    steps:
      - name: Deploy to Vercel Production
      - name: Run smoke tests
      - name: Notify team
```

### Deployment Stages
1. **Code Push** → Automatic tests run
2. **PR Creation** → Preview deployment created
3. **PR Merge** → Production deployment triggered
4. **Post-Deploy** → Smoke tests and monitoring

## Service Configuration

### Vercel Setup
```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/vendors/(.*)",
      "dest": "/vendors/[slug]"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  }
}
```

### Supabase Configuration
```sql
-- Production settings
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Connection pooling
ALTER SYSTEM SET max_pool_size = 15;
ALTER SYSTEM SET default_pool_size = 25;
```

### Environment Variables
```bash
# Production Environment Variables

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=easybuilder

# Email
RESEND_API_KEY=your-resend-key

# Redis (Upstash)
REDIS_URL=your-redis-url
REDIS_TOKEN=your-redis-token

# Application
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://easybuilder.com
NODE_ENV=production
```

## Performance Optimization

### CDN Strategy
```
Vercel Edge Network:
├── Static assets (CSS, JS, images)
├── API routes caching
├── Edge functions
└── Global distribution

Cloudinary CDN:
├── Product images
├── Vendor logos
├── Automatic optimization
├── WebP/AVIF conversion
└── Responsive images
```

### Caching Layers
```
Browser Cache:
├── Static assets: 1 year
├── API responses: 5 minutes
└── Dynamic content: No cache

CDN Cache:
├── Images: 1 month
├── Static files: 1 year
├── API routes: 1 minute
└── Vendor pages: 1 hour

Redis Cache:
├── Session data: 30 minutes
├── Vendor catalogs: 10 minutes
├── Analytics data: 5 minutes
└── Search results: 1 minute
```

### Database Optimization
```sql
-- Connection pooling settings
pgbouncer:
  default_pool_size: 25
  max_client_conn: 100
  pool_mode: transaction

-- Query optimization
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_prewarm;

-- Monitoring queries
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
```

## Monitoring & Observability

### Application Monitoring
```typescript
// Sentry configuration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    return event;
  }
});

// Custom metrics
export const trackVendorPageView = (vendorId: string) => {
  Sentry.addBreadcrumb({
    message: 'Vendor page viewed',
    category: 'navigation',
    data: { vendorId }
  });
};
```

### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to PostHog or Vercel Analytics
  posthog.capture('web_vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Health Checks
```typescript
// API health check endpoint
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from('vendors')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    // Check Redis connection
    await redis.ping();
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected'
      }
    });
  } catch (error) {
    return Response.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 500 });
  }
}
```

## Security Configuration

### Domain Security
```
SSL/TLS:
├── Automatic HTTPS (Vercel)
├── TLS 1.3 support
├── HSTS headers
└── Certificate auto-renewal

Security Headers:
├── Content-Security-Policy
├── X-Frame-Options: DENY
├── X-Content-Type-Options: nosniff
└── Referrer-Policy: strict-origin
```

### API Security
```typescript
// Rate limiting middleware
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response("Rate limit exceeded", { status: 429 });
  }
}
```

### Database Security
```sql
-- Row Level Security policies
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- API key rotation schedule
-- Rotate keys every 90 days
-- Monitor for suspicious usage patterns
```

## Backup & Recovery

### Database Backups
```
Supabase Automated Backups:
├── Daily backups (7 days retention)
├── Weekly backups (4 weeks retention)
├── Monthly backups (3 months retention)
└── Point-in-time recovery (7 days)

Custom Backup Strategy:
├── Weekly full dumps to S3
├── Daily incremental backups
├── Critical data snapshots
└── Cross-region replication
```

### Disaster Recovery
```
Recovery Time Objectives (RTO):
├── Database: 15 minutes
├── Application: 5 minutes
├── Static assets: 1 minute
└── Full system: 30 minutes

Recovery Point Objectives (RPO):
├── Database: 1 hour
├── User uploads: 15 minutes
├── Configuration: 24 hours
└── Analytics: 6 hours
```

## Cost Optimization

### Service Costs (Estimated Monthly)
```
Vercel Pro: $20/month
├── Bandwidth: Included (100GB)
├── Build time: Included (400 hours)
└── Functions: Included

Supabase Pro: $25/month
├── Database: 8GB included
├── Storage: 100GB included
├── Bandwidth: 50GB included
└── Auth users: 100K included

Cloudinary: $89/month
├── Transformations: 25K/month
├── Storage: 25GB
├── Bandwidth: 25GB
└── Video processing: 1000 credits

Additional Services: ~$50/month
├── Upstash Redis: $10/month
├── PostHog: $20/month (growth plan)
├── Sentry: $26/month (team plan)
└── Resend: $20/month

Total Estimated: ~$184/month
```

### Cost Monitoring
```typescript
// Usage tracking
export const trackUsage = async (type: string, amount: number) => {
  await redis.hincrby('usage:monthly', type, amount);
  
  // Alert if approaching limits
  const usage = await redis.hgetall('usage:monthly');
  if (usage.bandwidth > 80000) { // 80GB threshold
    // Send alert
  }
};
```

## Scaling Strategy

### Horizontal Scaling
```
Application Scaling:
├── Vercel auto-scaling (serverless)
├── Database read replicas
├── Redis clustering
└── CDN edge locations

Load Balancing:
├── Vercel edge functions
├── Database connection pooling
├── API rate limiting
└── Image optimization
```

### Vertical Scaling
```
Database Scaling:
├── Compute: Scale up to 32 vCPU
├── Memory: Scale up to 256GB RAM
├── Storage: Scale up to 2TB
└── IOPS: Scale up to 40K

Application Scaling:
├── Function memory: 1GB max
├── Function timeout: 60s max
├── Build time: Optimize bundle size
└── Cold start: Minimize with edge
```

## Migration Strategy

### Production Migration
1. **Pre-migration** - Data validation and backup
2. **Migration window** - Low traffic hours (2-4 AM UTC)
3. **Rollback plan** - Automatic rollback triggers
4. **Post-migration** - Health checks and monitoring

### Zero-downtime Deployments
```
Blue-Green Deployment:
├── Deploy to staging (green)
├── Run smoke tests
├── Switch traffic gradually
├── Monitor performance
└── Rollback if issues
```

This infrastructure setup provides enterprise-grade reliability, performance, and security while maintaining cost efficiency and developer productivity.