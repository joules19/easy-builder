# EasyBuilder - Simple Vendor Catalogs

A modern multi-tenant platform that allows vendors to create beautiful product catalogs and share them via QR codes. Perfect for local businesses, farmers markets, craft fairs, and anyone who wants to showcase their products online.

## 🚀 Features

- **Quick Setup**: Create your vendor profile in under 5 minutes
- **Product Catalog**: Organize products with categories, images, and descriptions
- **QR Code Sharing**: Auto-generated QR codes for instant sharing
- **Mobile Optimized**: Beautiful responsive design for all devices
- **Contact Integration**: Click-to-call, email, and social media integration
- **Analytics**: Track QR scans, page views, and customer interactions
- **Multi-tenant**: Secure vendor data isolation

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **Images**: Cloudinary CDN
- **Caching**: Upstash Redis
- **Analytics**: PostHog, Vercel Analytics

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── vendor/           # Vendor catalog components
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Supabase client setup
│   ├── auth/             # Authentication helpers
│   └── api/              # API functions
├── types/                 # TypeScript type definitions
└── hooks/                # Custom React hooks

docs/                      # Project documentation
database/                  # Database migrations and seeds
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Cloudinary account (for image hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easybuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase and other service credentials.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migration: `database/migrations/001_initial_schema.sql`
   - Optionally load sample data: `database/seeds/sample_data.sql`

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄 Database Setup

The project uses Supabase (PostgreSQL) with Row Level Security (RLS) for multi-tenant data isolation.

### Key Tables
- `vendors` - Vendor profiles and business information
- `categories` - Product categories (vendor-specific)
- `products` - Individual products with details
- `product_images` - Multiple images per product
- `qr_scans` - QR code scan analytics
- `contact_interactions` - Contact attempt tracking

### Setting Up the Database

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Run Migrations**
   - Copy the SQL from `database/migrations/001_initial_schema.sql`
   - Paste and run in the Supabase SQL Editor

3. **Load Sample Data** (Optional)
   - Edit `database/seeds/sample_data.sql` with real user IDs
   - Run in the SQL Editor

See `database/README.md` for detailed setup instructions.

## 🔐 Authentication

The app uses Supabase Auth with email/password authentication:

- **Vendor Registration**: Email verification required
- **Profile Creation**: Automatic vendor profile creation via database triggers
- **Role-Based Access**: Vendors can only access their own data
- **Session Management**: Automatic token refresh and secure sessions

## 🎨 UI Components

Built with [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com):

- Consistent design system
- Accessible components
- Dark mode support
- Mobile-first responsive design

## 📱 Vendor Pages

Each vendor gets a public page at `/vendors/[slug]`:

- **SEO Optimized**: Server-side rendering with metadata
- **Fast Loading**: Incremental Static Regeneration (ISR)
- **QR Trackable**: UTM parameters for analytics
- **Mobile First**: Optimized for mobile QR scanning

## 📊 Analytics

Comprehensive analytics tracking:

- **QR Code Scans**: Track when and where QR codes are scanned
- **Page Views**: Monitor vendor page traffic
- **Contact Interactions**: Track customer contact attempts
- **Vendor Dashboard**: Real-time insights and metrics

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect to your git repository

2. **Environment Variables**
   - Add all environment variables from `.env.example`
   - Ensure Supabase URLs and keys are set

3. **Deploy**
   - Vercel will automatically build and deploy
   - SSL and CDN included

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

The application is optimized for performance:

- **Lighthouse Score**: Target 95+
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Image Optimization**: Cloudinary CDN with responsive images
- **Caching**: Multi-layer caching strategy
- **Bundle Optimization**: Code splitting and tree shaking

## 🛡 Security

- **Row Level Security**: Database-level vendor isolation
- **Authentication**: Secure session management
- **Environment Variables**: Sensitive data protection
- **HTTPS**: SSL/TLS encryption
- **Input Validation**: Client and server-side validation

## 📚 Documentation

- `docs/features/` - Detailed feature documentation
- `docs/DATABASE_SCHEMA.md` - Database design and setup
- `docs/AUTH_SYSTEM.md` - Authentication implementation
- `docs/INFRASTRUCTURE.md` - Deployment and infrastructure
- `docs/PERFORMANCE.md` - Performance optimization
- `CLAUDE.md` - AI development context

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder
- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join GitHub Discussions for questions

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup and architecture
- [x] Database design and migrations
- [x] Basic UI components
- [ ] Authentication system
- [ ] Vendor registration

### Phase 2: Core Features (In Progress)
- [ ] Vendor dashboard
- [ ] Product/category management
- [ ] Public vendor pages
- [ ] QR code generation

### Phase 3: Advanced Features
- [ ] Analytics dashboard
- [ ] Contact system
- [ ] Performance optimization
- [ ] Mobile app (React Native)

## 🏆 Project Status

**Current Phase**: Phase 1 Implementation
**Progress**: 68% complete
**Next Milestone**: Authentication system completion

---

Built with ❤️ for local businesses and vendors worldwide.