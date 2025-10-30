import Link from 'next/link'
import { Store } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { AuthGuard } from '@/components/auth/auth-guard'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your EasyBuilder account',
}

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="min-h-screen bg-background">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-tr from-background via-muted/20 to-background shadow-xl shadow-primary/10 ring-1 ring-primary/5" />
        </div>
        
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
              <h1 className="text-display-sm font-bold text-foreground">Welcome back</h1>
              <p className="mt-2 text-body-md text-muted-foreground">
                Sign in to continue to your dashboard
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <LoginForm />
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