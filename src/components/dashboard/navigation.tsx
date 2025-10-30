'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  Folder,
  QrCode,
  BarChart3,
  // Settings,
  Store,
  User,
  LogOut,
  ExternalLink,
  X
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Categories', href: '/dashboard/categories', icon: Folder },
  { name: 'QR Code', href: '/dashboard/qr-code', icon: QrCode },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  // { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface DashboardNavigationProps {
  vendor?: {
    name: string
    slug: string
    email?: string
  }
}

export function DashboardNavigation({ vendor }: DashboardNavigationProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      toast.success('Signed out successfully')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Error signing out. Please try again.')
    }
  }

  // Handle mobile menu toggle
  useEffect(() => {
    const handleMenuToggle = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const menuButton = document.getElementById('mobile-menu-button')
    if (menuButton) {
      menuButton.addEventListener('click', handleMenuToggle)
      return () => menuButton.removeEventListener('click', handleMenuToggle)
    }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-navigation')
      const button = document.getElementById('mobile-menu-button')
      if (isMobileMenuOpen && nav && !nav.contains(event.target as Node) && !button?.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" />
      )}

      {/* Navigation Sidebar */}
      <nav
        id="mobile-navigation"
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "sidebar fixed left-0 top-0 z-50 h-screen w-64 border-r bg-sidebar/95 backdrop-blur overflow-y-auto supports-[backdrop-filter]:bg-sidebar/60 transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </div>
            <span className="ml-3 text-heading-md font-bold gradient-text">EasyBuilder</span>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-between h-[calc(100vh-5rem)]">
          <div className="px-3 py-6">
            <ul className="space-y-1" role="list">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href))

                return (
                  <li key={item.name} role="listitem">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center px-3 py-3 lg:py-2.5 text-body-sm font-medium rounded-lg transition-all duration-200 group touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                        isActive
                          ? 'bg-nav-active text-nav-active-foreground shadow-sm'
                          : 'text-sidebar-foreground hover:bg-nav-hover hover:text-foreground active:bg-nav-hover'
                      )}
                      onClick={() => {
                        // Close mobile menu when navigation item is clicked
                        if (window.innerWidth < 1024) {
                          setIsMobileMenuOpen(false)
                        }
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      tabIndex={0}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 mr-3 transition-colors',
                          isActive ? 'text-nav-active-foreground' : 'text-muted-foreground group-hover:text-foreground'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* User Info & Actions */}
          <div className="border-t border-sidebar-border">
            {/* Vendor Info */}
            {vendor && (
              <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-sidebar-foreground truncate">
                      {vendor.name}
                    </p>
                    <p className="text-label-sm text-muted-foreground truncate">
                      {vendor.email}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full justify-start text-label-lg h-10 touch-manipulation"
                  >
                    <Link
                      href={`/vendors/${vendor.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        // Close mobile menu when external link is clicked
                        if (window.innerWidth < 1024) {
                          setIsMobileMenuOpen(false)
                        }
                      }}
                      aria-label={`View ${vendor.name} public storefront (opens in new window)`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                      View Your Store
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Sign Out */}
            <div className="p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleSignOut()
                  // Close mobile menu when signing out
                  if (window.innerWidth < 1024) {
                    setIsMobileMenuOpen(false)
                  }
                }}
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 touch-manipulation focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                aria-label="Sign out of your account"
              >
                <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
                Sign Out
              </Button>
            </div>

            {/* Version */}
            <div className="px-4 pb-4">
              <div className="text-label-sm text-muted-foreground text-center">
                EasyBuilder v1.0
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}