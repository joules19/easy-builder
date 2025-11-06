import Link from 'next/link'
import { Store } from 'lucide-react'
import { SignupForm } from '@/components/auth/signup-form'
import { AuthGuard } from '@/components/auth/auth-guard'

export const metadata = {
  title: 'Create Account',
  description: 'Create your EasyBuilder account and start showcasing your products',
}

export default function SignupPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-y-0 left-1/2 -z-10 ml-16 w-[200%] origin-bottom-right skew-x-[30deg] bg-gradient-to-tl from-background via-muted/20 to-background shadow-xl shadow-primary/10 ring-1 ring-primary/5 hidden sm:block" />
        </div>
        
        <div className="flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md mx-auto">
            {/* Logo */}
            <Link href="/" className="flex justify-center group">
              <div className="flex items-center space-x-3 transition-transform group-hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-modern">
                  <Store className="h-5 w-5" />
                </div>
                <span className="text-heading-xl font-bold gradient-text">EasyBuilder</span>
              </div>
            </Link>
            
            <div className="mt-6 text-center">
              <h1 className="text-display-sm font-bold text-foreground">Get started today</h1>
              <p className="mt-2 text-body-md text-muted-foreground">
                Create your account to start building your catalog
              </p>
            </div>
          </div>

          <div className="mt-8 w-full max-w-md mx-auto">
            <SignupForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-label-lg text-muted-foreground">
              Need help? Support coming soon
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}