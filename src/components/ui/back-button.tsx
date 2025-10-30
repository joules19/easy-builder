'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function BackButton({ 
  children, 
  className, 
  variant = "outline", 
  size = "lg" 
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to home page if no history
      router.push('/')
    }
  }

  return (
    <Button 
      onClick={handleBack}
      variant={variant}
      size={size}
      className={className}
    >
      {children || (
        <>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </>
      )}
    </Button>
  )
}