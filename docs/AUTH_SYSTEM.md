# Authentication & Authorization System

## Overview
Complete authentication system using Supabase Auth with Next.js, featuring vendor-specific access control and secure session management.

## Authentication Architecture

### Auth Flow Overview
```
User Journey:
├── Registration/Login → Supabase Auth
├── Profile Creation → Vendor table
├── Dashboard Access → RLS policies
└── Public Pages → Anonymous/authenticated
```

### Supabase Auth Integration
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()

// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
```

## User Registration Flow

### Vendor Registration Process
```typescript
// app/auth/signup/page.tsx
interface VendorSignupForm {
  // Auth fields
  email: string;
  password: string;
  confirmPassword: string;
  
  // Business fields
  businessName: string;
  phone: string;
  agreeToTerms: boolean;
}

const handleSignup = async (formData: VendorSignupForm) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          business_name: formData.businessName,
          phone: formData.phone
        }
      }
    });

    if (authError) throw authError;

    // 2. Create vendor profile (triggered by database function)
    // 3. Send welcome email
    // 4. Redirect to email verification page
    
  } catch (error) {
    // Handle registration errors
  }
};
```

### Database Trigger for Vendor Creation
```sql
-- Create vendor profile when auth user is created
CREATE OR REPLACE FUNCTION create_vendor_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO vendors (
    user_id,
    name,
    email,
    phone,
    slug,
    status
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'business_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    generate_unique_slug(NEW.raw_user_meta_data->>'business_name'),
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_vendor_profile();
```

## Authentication Components

### Login Form Component
```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Auth Context Provider
```typescript
// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Vendor = Database['public']['Tables']['vendors']['Row'];

interface AuthContextType {
  user: User | null;
  vendor: Vendor | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshVendor: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchVendor = async (userId: string) => {
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    setVendor(data);
  };

  const refreshVendor = async () => {
    if (user) {
      await fetchVendor(user.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVendor(null);
    setSession(null);
  };

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchVendor(session.user.id);
      }
      
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchVendor(session.user.id);
        } else {
          setVendor(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        vendor,
        session,
        loading,
        signOut,
        refreshVendor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## Route Protection

### Middleware for Route Protection
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/auth/')) {
    if (session && !req.nextUrl.pathname.includes('/callback')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*']
}
```

### Server Component Auth Check
```typescript
// lib/auth/server.ts
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const supabase = createServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return session
}

export async function getVendor() {
  const session = await requireAuth()
  const supabase = createServerClient()
  
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error || !vendor) {
    redirect('/auth/setup-profile')
  }

  return vendor
}
```

### Protected Dashboard Layout
```typescript
// app/dashboard/layout.tsx
import { getVendor } from '@/lib/auth/server'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const vendor = await getVendor()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav vendor={vendor} />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
}
```

## Authorization System

### Role-Based Access Control
```typescript
// types/auth.ts
export type UserRole = 'vendor' | 'admin' | 'super_admin'
export type VendorStatus = 'pending' | 'active' | 'suspended' | 'archived'

export interface VendorPermissions {
  canManageProducts: boolean
  canManageCategories: boolean
  canViewAnalytics: boolean
  canEditProfile: boolean
  canAccessSupport: boolean
}

// lib/auth/permissions.ts
export function getVendorPermissions(vendor: Vendor): VendorPermissions {
  const isActive = vendor.status === 'active'
  
  return {
    canManageProducts: isActive,
    canManageCategories: isActive,
    canViewAnalytics: isActive,
    canEditProfile: true, // Always allowed
    canAccessSupport: true, // Always allowed
  }
}
```

### Permission-Based Components
```typescript
// components/auth/PermissionGate.tsx
import { useAuth } from '@/contexts/AuthContext'
import { getVendorPermissions } from '@/lib/auth/permissions'

interface PermissionGateProps {
  permission: keyof VendorPermissions
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGate({ 
  permission, 
  children, 
  fallback = null 
}: PermissionGateProps) {
  const { vendor } = useAuth()
  
  if (!vendor) {
    return <>{fallback}</>
  }

  const permissions = getVendorPermissions(vendor)
  
  if (!permissions[permission]) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Usage example
<PermissionGate 
  permission="canManageProducts"
  fallback={<div>Your account is pending approval</div>}
>
  <ProductManagement />
</PermissionGate>
```

## Session Management

### Session Configuration
```typescript
// lib/supabase/config.ts
export const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // More secure for web apps
  },
  global: {
    headers: {
      'X-Client-Info': 'easybuilder-web',
    },
  },
}
```

### Session Refresh Handling
```typescript
// hooks/useSessionRefresh.ts
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSessionRefresh() {
  const supabase = createClient()

  useEffect(() => {
    // Handle token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully')
      }
      
      if (event === 'SIGNED_OUT') {
        // Clear any local state
        localStorage.removeItem('vendor-cache')
      }
    })

    return () => subscription.unsubscribe()
  }, [])
}
```

## Security Features

### Password Requirements
```typescript
// lib/auth/validation.ts
export const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters`)
  }

  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
```

### Account Security
```typescript
// components/auth/SecuritySettings.tsx
export function SecuritySettings() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = async (data: {
    currentPassword: string
    newPassword: string
  }) => {
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })
      
      if (error) throw error
      
      // Show success message
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      })
      
      if (error) throw error
      
      // Email verification required
    } catch (error) {
      // Handle error
    }
  }

  return (
    <div className="space-y-6">
      <PasswordChangeForm 
        onSubmit={handlePasswordChange}
        loading={loading}
      />
      
      <EmailChangeForm 
        currentEmail={user?.email}
        onSubmit={handleEmailChange}
      />
      
      <TwoFactorSetup />
    </div>
  )
}
```

## Error Handling

### Auth Error Types
```typescript
// lib/auth/errors.ts
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'invalid_login_credentials',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  TOO_MANY_REQUESTS = 'too_many_requests',
  WEAK_PASSWORD = 'weak_password',
  EMAIL_ALREADY_EXISTS = 'email_address_already_exists',
}

export function getAuthErrorMessage(error: any): string {
  switch (error.message || error.error_description) {
    case AuthErrorCode.INVALID_CREDENTIALS:
      return 'Invalid email or password. Please try again.'
    
    case AuthErrorCode.EMAIL_NOT_CONFIRMED:
      return 'Please check your email and click the confirmation link.'
    
    case AuthErrorCode.TOO_MANY_REQUESTS:
      return 'Too many login attempts. Please try again later.'
    
    case AuthErrorCode.WEAK_PASSWORD:
      return 'Password is too weak. Please choose a stronger password.'
    
    case AuthErrorCode.EMAIL_ALREADY_EXISTS:
      return 'An account with this email already exists.'
    
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}
```

### Global Error Boundary
```typescript
// components/auth/AuthErrorBoundary.tsx
'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function AuthErrorBoundary({ 
  children,
  fallback 
}: {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
}) {
  const { user } = useAuth()

  useEffect(() => {
    // Monitor for auth errors
    const handleAuthError = (event: CustomEvent) => {
      console.error('Auth error:', event.detail)
      
      // Handle specific error types
      if (event.detail.code === 'SIGNED_OUT') {
        window.location.href = '/auth/login'
      }
    }

    window.addEventListener('auth:error', handleAuthError as EventListener)
    
    return () => {
      window.removeEventListener('auth:error', handleAuthError as EventListener)
    }
  }, [])

  return <>{children}</>
}
```

This authentication system provides secure, scalable user management with proper vendor isolation and comprehensive security features.