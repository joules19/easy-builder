import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-modern hover:shadow-modern-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-modern hover:shadow-modern-lg",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-modern",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm hover:shadow-modern",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-modern hover:shadow-modern-lg",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-modern hover:shadow-modern-lg",
        gradient: "gradient-primary text-white shadow-modern hover:shadow-modern-lg hover:scale-[1.02]",
      },
      size: {
        xs: "h-8 px-3 text-label-sm rounded-sm",
        sm: "h-9 px-3 text-label-lg rounded-md",
        default: "h-10 px-4 py-2 text-body-sm",
        lg: "h-11 px-6 text-body-md rounded-lg",
        xl: "h-12 px-8 text-body-lg rounded-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-sm",
        "icon-lg": "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, disabled, loading = false, ...props }, ref) => {
    const isDisabled = disabled || loading

    if (asChild) {
      // Simple asChild implementation without Radix UI Slot
      return React.cloneElement(
        React.Children.only(children as React.ReactElement),
        {
          className: cn(buttonVariants({ variant, size, className })),
          ref,
          'aria-disabled': isDisabled,
          ...props,
        }
      )
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }