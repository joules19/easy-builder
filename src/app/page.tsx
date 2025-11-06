import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, Store, Smartphone, Users } from 'lucide-react'
import { getOptionalAuth } from '@/lib/auth/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function HomePage() {
  // Check if user is authenticated
  const session = await getOptionalAuth()
  let hasVendorProfile = false

  if (session) {
    // Check if user has completed vendor setup
    const supabase = createServerSupabaseClient()
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', session.user.id)
      .single()

    hasVendorProfile = !!vendor
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-responsive flex h-16 items-center">
          <nav className="flex w-full items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-heading-xl font-bold gradient-text">EasyBuilder</span>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                // User is logged in
                hasVendorProfile ? (
                  // User has vendor profile - show dashboard link
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  // User needs to complete vendor setup
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/auth/setup-profile">Complete Setup</Link>
                  </Button>
                )
              ) : (
                // User is not logged in - show auth links
                <>
                  <Button asChild variant="ghost" className="hidden text-muted-foreground hover:text-foreground sm:block">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button asChild variant="gradient" size="lg">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gradient-to-tr from-background via-muted/20 to-background shadow-xl shadow-primary/10 ring-1 ring-primary/5" />
        </div>
        
        <div className="container-responsive">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-label-lg text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-all duration-200">
                <span>Perfect for local businesses and vendors</span>
              </div>
            </div>
            
            <h1 className="text-display-md sm:text-display-lg lg:text-display-xl font-extrabold tracking-tight text-foreground mb-6">
              Create Your{' '}
              <span className="gradient-text">Digital Catalog</span>{' '}
              in Minutes
            </h1>
            
            <p className="text-body-md sm:text-body-lg lg:text-heading-sm text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform your business with a stunning online catalog. Showcase products, 
              share with QR codes, and connect with customers instantly. No technical skills required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                hasVendorProfile ? (
                  <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto sm:min-w-[200px]">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                ) : (
                  <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto sm:min-w-[200px]">
                    <Link href="/auth/setup-profile">Complete Your Setup</Link>
                  </Button>
                )
              ) : (
                <>
                  <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto sm:min-w-[200px]">
                    <Link href="/auth/signup">Start Free Today</Link>
                  </Button>
                  <Button asChild variant="ghost" size="xl" className="w-full sm:w-auto sm:min-w-[150px] text-muted-foreground">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-16 flex items-center justify-center gap-x-6 lg:gap-x-8">
              <div className="flex items-center gap-x-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-chart-4 ring-2 ring-background"
                    />
                  ))}
                </div>
                <span className="text-label-lg text-muted-foreground">Trusted by 1000+ vendors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-muted/30">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-display-sm lg:text-display-md font-bold text-foreground mb-6">
              Everything You Need to{' '}
              <span className="gradient-text">Showcase Your Business</span>
            </h2>
            <p className="text-body-lg text-muted-foreground leading-relaxed">
              Simple, powerful tools to create a professional online presence for your business. 
              Get started in minutes, not hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-1/10 text-chart-1 ring-1 ring-chart-1/20 group-hover:bg-chart-1/20 transition-colors">
                  <Store className="h-7 w-7" />
                </div>
                <CardTitle className="text-heading-md">Easy Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-sm leading-relaxed">
                  Create your vendor profile and start adding products in under 5 minutes. 
                  No technical knowledge required.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-2/10 text-chart-2 ring-1 ring-chart-2/20 group-hover:bg-chart-2/20 transition-colors">
                  <QrCode className="h-7 w-7" />
                </div>
                <CardTitle className="text-heading-md">QR Code Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-sm leading-relaxed">
                  Instantly share your catalog with customers using auto-generated QR codes. 
                  Perfect for print materials and in-store displays.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-4/10 text-chart-4 ring-1 ring-chart-4/20 group-hover:bg-chart-4/20 transition-colors">
                  <Smartphone className="h-7 w-7" />
                </div>
                <CardTitle className="text-heading-md">Mobile Optimized</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-sm leading-relaxed">
                  Your catalog looks perfect on all devices - desktop, tablet, and mobile. 
                  Responsive design ensures a great experience everywhere.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-chart-3/10 text-chart-3 ring-1 ring-chart-3/20 group-hover:bg-chart-3/20 transition-colors">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="text-heading-md">Contact Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-body-sm leading-relaxed">
                  Customers can contact you directly with click-to-call, email, and WhatsApp buttons. 
                  Make it easy for them to reach you.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-background">
        <div className="container-responsive">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-display-sm lg:text-display-md font-bold text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-body-lg text-muted-foreground leading-relaxed">
              Get your business online in three simple steps. No technical expertise required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="relative text-center group">
              {/* Step connector line (hidden on mobile) */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2" aria-hidden="true" />
              
              <div className="relative mb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-modern text-heading-lg font-bold">
                  1
                </div>
              </div>
              
              <h3 className="text-heading-lg font-semibold mb-4 text-foreground">
                Sign Up & Create Profile
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Register your business and add your basic information, logo, and contact details. 
                Get set up in minutes with our guided onboarding.
              </p>
            </div>

            <div className="relative text-center group">
              {/* Step connector line (hidden on mobile) */}
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-1/2" aria-hidden="true" />
              
              <div className="relative mb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-modern text-heading-lg font-bold">
                  2
                </div>
              </div>
              
              <h3 className="text-heading-lg font-semibold mb-4 text-foreground">
                Add Your Products
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Upload product photos, add descriptions, prices, and organize them into categories. 
                Drag and drop makes it effortless.
              </p>
            </div>

            <div className="relative text-center group">
              <div className="relative mb-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-modern text-heading-lg font-bold">
                  3
                </div>
              </div>
              
              <h3 className="text-heading-lg font-semibold mb-4 text-foreground">
                Share Your Catalog
              </h3>
              <p className="text-body-sm text-muted-foreground leading-relaxed">
                Get your unique URL and QR code to share with customers anywhere. 
                Perfect for social media, business cards, and in-store displays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-chart-4" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        <div className="relative container-responsive text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-display-sm lg:text-display-md font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-body-lg lg:text-heading-sm text-white/90 mb-10 leading-relaxed">
              Join thousands of vendors who trust EasyBuilder for their online presence. 
              Start building your digital catalog today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                hasVendorProfile ? (
                  <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto sm:min-w-[200px] shadow-modern-lg">
                    <Link href="/dashboard">Manage Your Catalog</Link>
                  </Button>
                ) : (
                  <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto sm:min-w-[200px] shadow-modern-lg">
                    <Link href="/auth/setup-profile">Complete Your Setup</Link>
                  </Button>
                )
              ) : (
                <>
                  <Button asChild size="xl" variant="secondary" className="w-full sm:w-auto sm:min-w-[200px] shadow-modern-lg">
                    <Link href="/auth/signup">Create Your Catalog Now</Link>
                  </Button>
                  <Button asChild size="xl" variant="ghost" className="w-full sm:w-auto sm:min-w-[150px] text-white/90 hover:text-white hover:bg-white/10">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-12 flex items-center justify-center text-white/80">
              <div className="flex items-center gap-x-3">
                <div className="h-1 w-8 bg-white/40 rounded-full" />
                <span className="text-label-lg">No credit card required</span>
                <div className="h-1 w-8 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container-responsive py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="h-4 w-4" />
                </div>
                <span className="text-heading-lg font-bold text-foreground">EasyBuilder</span>
              </div>
              <p className="text-body-md text-muted-foreground leading-relaxed max-w-md">
                Simple vendor catalogs with QR code sharing for local businesses. 
                Create your professional online presence in minutes.
              </p>
              <div className="mt-6 flex space-x-4">
                {session ? (
                  hasVendorProfile ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/auth/setup-profile">Get Started</Link>
                    </Button>
                  )
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-heading-sm font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-3">
                <li><span className="text-body-sm text-muted-foreground">Features</span></li>
                <li><span className="text-body-sm text-muted-foreground">Pricing</span></li>
                <li><span className="text-body-sm text-muted-foreground">Demo</span></li>
                <li><span className="text-caption text-muted-foreground/60">Coming Soon</span></li>
              </ul>
            </div>

            <div>
              <h3 className="text-heading-sm font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-3">
                <li><span className="text-body-sm text-muted-foreground">Help Center</span></li>
                <li><span className="text-body-sm text-muted-foreground">Contact Us</span></li>
                <li><span className="text-body-sm text-muted-foreground">System Status</span></li>
                <li><span className="text-caption text-muted-foreground/60">Coming Soon</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col-reverse gap-4 border-t pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-label-lg text-muted-foreground">
              &copy; 2025 EasyBuilder. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-label-lg text-muted-foreground">Privacy Policy</span>
              <span className="text-label-lg text-muted-foreground">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}