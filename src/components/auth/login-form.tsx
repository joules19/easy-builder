'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message === 'Invalid login credentials') {
          setError('Invalid email or password. Please try again.')
        } else if (error.message === 'Email not confirmed') {
          setError('Please check your email and click the confirmation link.')
        } else {
          setError(error.message)
        }
        return
      }

      // Check if user has vendor profile
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, status')
        .eq('user_id', data.user.id)
        .single()

      if (!vendor) {
        router.push('/auth/setup-profile')
      } else {
        router.push('/dashboard')
      }
      router.refresh()
    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 bg-background/95 backdrop-blur shadow-modern-xl">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-heading-lg text-center text-foreground">Sign in to your account</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-label-lg text-foreground">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-11 transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-label-lg text-foreground">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 pr-12 transition-all duration-200"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-body-sm text-destructive-foreground bg-destructive/10 p-4 rounded-lg border border-destructive/20 animate-fade-in">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            size="lg"
            variant="gradient"
            className="w-full h-12" 
            disabled={loading || !email || !password}
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-label-lg text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-label-sm">
            <span className="bg-background px-2 text-muted-foreground">New to EasyBuilder?</span>
          </div>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="w-full h-12">
            <Link href="/auth/signup">
              Create an account
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}