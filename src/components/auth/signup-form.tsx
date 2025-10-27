'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent a confirmation link to <strong>{formData.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click the link in the email to confirm your account and complete your registration.
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/auth/login')}
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Start showcasing your products with a free catalog
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => updateFormData('businessName', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (8+ characters)"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
              className="rounded border-gray-300"
              disabled={loading}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}