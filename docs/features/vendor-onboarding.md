# Vendor Onboarding Documentation

## Overview
Complete workflow for vendor registration, profile setup, and first product creation.

## User Flow

### 1. Initial Registration
**Entry Points:**
- Landing page CTA button
- `/signup` direct URL
- Referral from existing vendor

**Registration Form:**
```
- Business Name (required)
- Email (required, unique)
- Phone Number (required)
- Password (required, 8+ chars)
- Terms & Conditions acceptance
```

**Backend Process:**
- Create user in Supabase Auth
- Generate unique vendor slug from business name
- Create vendor record in database
- Send welcome email with next steps

### 2. Profile Setup
**Required Information:**
```
- Business Description
- Physical Address
- Business Logo (image upload)
- Business Category
- Operating Hours
- Social Media Links (optional)
```

**Validation Rules:**
- Logo: Max 2MB, JPG/PNG only
- Slug: Auto-generated, editable once
- Address: Required for contact display

### 3. First Product Creation
**Guided Tour:**
- Create first category
- Add first product with image
- Preview vendor page
- Generate QR code

## Database Operations

### Tables Involved
```sql
-- Vendor creation
INSERT INTO vendors (id, slug, name, email, phone, status)
VALUES (uuid, generated_slug, name, email, phone, 'pending');

-- Profile completion
UPDATE vendors SET 
  description = ?, 
  address = ?, 
  logo_url = ?,
  status = 'active'
WHERE id = ?;
```

## API Endpoints

### Registration
- `POST /api/auth/signup`
- `POST /api/vendors/create-profile`
- `PUT /api/vendors/[id]/profile`

### Validation
- `GET /api/vendors/check-slug/[slug]` - Check slug availability
- `POST /api/vendors/upload-logo` - Handle logo upload

## Frontend Components

### Pages
- `/signup` - Registration form
- `/onboarding/profile` - Profile setup
- `/onboarding/first-product` - Guided product creation
- `/dashboard` - Vendor dashboard

### Components
- `SignupForm` - Registration handling
- `ProfileSetup` - Multi-step profile form
- `LogoUpload` - Image upload with preview
- `SlugGenerator` - Auto-generate and validate slugs

## Edge Cases & Validation

### Slug Generation
- Remove special characters
- Convert to lowercase
- Handle duplicates with numbers (vendor-name-2)
- Max length: 50 characters

### Error Handling
- Email already exists
- Slug conflicts
- Image upload failures
- Network connectivity issues

### Status Management
```
pending -> active (profile completed)
active -> suspended (admin action)
suspended -> active (reactivation)
```

## Success Metrics
- Registration completion rate
- Time to first product
- Profile completion percentage
- Vendor activation rate

## Next Steps After Onboarding
1. Vendor receives confirmation email
2. QR code generated automatically
3. Vendor page becomes publicly accessible
4. Analytics tracking begins