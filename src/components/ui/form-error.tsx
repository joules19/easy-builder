import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string
  children?: React.ReactNode
}

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, id, children, ...props }, ref) => {
    if (!children) return null

    return (
      <div
        ref={ref}
        id={id}
        className={cn(
          "flex items-center space-x-2 text-destructive text-label-sm mt-2",
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
        <span>{children}</span>
      </div>
    )
  }
)
FormError.displayName = "FormError"

export { FormError }