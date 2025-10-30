import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, required, ...props }, ref) => {
    const errorId = props.id ? `${props.id}-error` : undefined
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-input-bg px-3 py-2 text-body-sm text-foreground ring-offset-background transition-all duration-200 file:border-0 file:bg-transparent file:text-body-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary hover:border-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && errorMessage ? errorId : undefined}
        aria-required={required}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }