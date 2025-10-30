import { Button } from './button'
import { Card, CardContent } from './card'
import { 
  Package, 
  Folder, 
  QrCode, 
  BarChart3, 
  Search,
  ShoppingBag,
  Store,
  Image as ImageIcon,
  AlertCircle,
  Wifi,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "success" | "warning" | "gradient"
  }
  secondary?: {
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | "success" | "warning" | "gradient"
  }
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  secondary 
}: EmptyStateProps) {
  return (
    <Card className="border-0 bg-gradient-to-br from-muted/30 to-muted/20">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
            {icon}
          </div>
          <div className="space-y-3">
            <h3 className="text-heading-lg font-bold text-foreground">{title}</h3>
            <p className="text-body-lg text-muted-foreground max-w-md leading-relaxed">
              {description}
            </p>
          </div>
          {(action || secondary) && (
            <div className="flex items-center gap-3">
              {action && (
                action.href ? (
                  <Button asChild variant={action.variant || "default"}>
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                ) : (
                  <Button 
                    onClick={action.onClick} 
                    variant={action.variant || "default"}
                  >
                    {action.label}
                  </Button>
                )
              )}
              {secondary && (
                secondary.href ? (
                  <Button asChild variant={secondary.variant || "outline"}>
                    <Link href={secondary.href}>{secondary.label}</Link>
                  </Button>
                ) : (
                  <Button 
                    onClick={secondary.onClick} 
                    variant={secondary.variant || "outline"}
                  >
                    {secondary.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function NoProductsEmpty() {
  return (
    <EmptyState
      icon={<Package className="h-10 w-10" />}
      title="No products yet"
      description="Start building your catalog by adding your first product. Products help customers discover what you offer."
      action={{
        label: "Add Your First Product",
        href: "/dashboard/products/new",
        variant: "gradient"
      }}
      secondary={{
        label: "Learn More",
        href: "/help/products"
      }}
    />
  )
}

export function NoCategoriesEmpty() {
  return (
    <EmptyState
      icon={<Folder className="h-10 w-10" />}
      title="No categories yet"
      description="Create categories to organize your products and make them easier for customers to browse."
      action={{
        label: "Create First Category",
        href: "/dashboard/categories",
        variant: "gradient"
      }}
    />
  )
}

export function NoQRScansEmpty() {
  return (
    <EmptyState
      icon={<QrCode className="h-10 w-10" />}
      title="No QR code scans yet"
      description="Share your QR code to start tracking visits to your catalog. Generate and download your QR code to get started."
      action={{
        label: "Generate QR Code",
        href: "/dashboard/qr-code",
        variant: "gradient"
      }}
    />
  )
}

export function NoAnalyticsEmpty() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-10 w-10" />}
      title="No analytics data yet"
      description="Analytics data will appear here once customers start visiting your catalog and interacting with your products."
      secondary={{
        label: "Share Your Catalog",
        href: "/dashboard/qr-code"
      }}
    />
  )
}

export function SearchNoResultsEmpty({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<Search className="h-10 w-10" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or browse all products.`}
      action={{
        label: "Clear Search",
        onClick: () => window.location.href = window.location.pathname
      }}
    />
  )
}

export function VendorNotFoundEmpty() {
  return (
    <EmptyState
      icon={<Store className="h-10 w-10" />}
      title="Vendor not found"
      description="The vendor page you're looking for doesn't exist or may have been removed."
      action={{
        label: "Browse All Vendors",
        href: "/vendors"
      }}
    />
  )
}

export function NoImagesEmpty() {
  return (
    <EmptyState
      icon={<ImageIcon className="h-10 w-10" />}
      title="No images uploaded"
      description="Add images to showcase your products. High-quality images help customers understand what you're offering."
      action={{
        label: "Upload Images",
        onClick: () => document.getElementById('image-upload')?.click()
      }}
    />
  )
}

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  showRetry?: boolean
}

export function ErrorState({ 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  onRetry,
  showRetry = true
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/10">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-10 w-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-heading-lg font-bold text-foreground">{title}</h3>
            <p className="text-body-lg text-muted-foreground max-w-md leading-relaxed">
              {description}
            </p>
          </div>
          {showRetry && (
            <div className="flex items-center gap-3">
              <Button 
                onClick={onRetry || (() => window.location.reload())}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function NetworkErrorState() {
  return (
    <ErrorState
      title="Connection problem"
      description="Check your internet connection and try again. If the problem persists, please contact support."
      onRetry={() => window.location.reload()}
    />
  )
}

export function ServerErrorState() {
  return (
    <ErrorState
      title="Server error"
      description="Our servers are experiencing issues. Please try again in a few moments."
      onRetry={() => window.location.reload()}
    />
  )
}

export function NotFoundState({ 
  title = "Page not found",
  description = "The page you're looking for doesn't exist or has been moved.",
  homeLink = true 
}: {
  title?: string
  description?: string
  homeLink?: boolean
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Store className="h-12 w-12" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-display-md font-bold text-foreground">{title}</h1>
          <p className="text-body-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        {homeLink && (
          <div className="mt-8">
            <Button asChild variant="gradient" size="lg">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}