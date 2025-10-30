'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Check } from 'lucide-react'
import { validateEmail, validatePhone } from '@/lib/utils'

interface FormData {
  businessName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
}

export function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const validateForm = () => {
    if (!formData.businessName.trim()) {
      return 'Business name is required'
    }
    if (!validateEmail(formData.email)) {
      return 'Please enter a valid email address'
    }
    if (!validatePhone(formData.phone)) {
      return 'Please enter a valid phone number'
    }
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    if (!formData.agreeToTerms) {
      return 'You must agree to the terms and conditions'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            business_name: formData.businessName,
            phone: formData.phone,
          }
        }
      })

      if (authError) {
        if (authError.message === 'User already registered') {
          setError('An account with this email already exists. Please sign in instead.')
        } else {
          setError(authError.message)
        }
        return
      }

      if (authData.user && !authData.session) {
        // Email confirmation required
        setSuccess(true)
      } else if (authData.session) {
        // User is automatically signed in (email confirmation disabled)
        router.push('/dashboard')
        router.refresh()
      }

    } catch (error: any) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear error when user starts typing
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto border-0 bg-background/95 backdrop-blur shadow-modern-xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success ring-1 ring-success/20">
            <Check className="h-8 w-8" />
          </div>
          <CardTitle className="text-heading-lg text-foreground">Check your email</CardTitle>
          <CardDescription className="text-muted-foreground">
            We've sent a confirmation link to{' '}
            <span className="font-medium text-foreground">{formData.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-body-sm text-muted-foreground text-center leading-relaxed">
            Click the link in the email to confirm your account and complete your registration. 
            The link will expire in 24 hours.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full h-12"
            onClick={() => router.push('/auth/login')}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 bg-background/95 backdrop-blur shadow-modern-xl">
      <CardHeader className="space-y-1 pb-8">
        <CardTitle className="text-heading-lg text-center text-foreground">Create your account</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Start showcasing your products with a free catalog
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-label-lg text-foreground">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your business name"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                required
                disabled={loading}
                className="h-11 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-label-lg text-foreground">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                required
                disabled={loading}
                className="h-11 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-label-lg text-foreground">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
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
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-label-lg text-foreground">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  required
                  disabled={loading}
                  className="h-11 pr-12 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <input
              id="terms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-body-sm text-muted-foreground leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </Label>
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
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-label-sm">
            <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
          </div>
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="w-full h-12">
            <Link href="/auth/login">
              Sign in instead
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}