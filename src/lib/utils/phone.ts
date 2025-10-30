/**
 * Phone number utility functions for better contact integration
 */

/**
 * Format phone number for click-to-call functionality
 * Removes all non-digit characters and ensures proper format
 */
export function formatPhoneForCall(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle different country codes
  if (cleaned.length === 10) {
    // US number without country code
    return `+1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US number with country code
    return `+${cleaned}`
  } else if (cleaned.length > 11) {
    // International number
    return `+${cleaned}`
  } else {
    // Fallback - just add + if not present
    return phone.startsWith('+') ? phone : `+${cleaned}`
  }
}

/**
 * Format phone number for display purposes
 * Creates a user-friendly display format
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    // US format: (555) 123-4567
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US with country code: +1 (555) 123-4567
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  } else {
    // International format - just add + if not present
    return phone.startsWith('+') ? phone : `+${phone}`
  }
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  
  // Must be at least 10 digits, max 15 (international standard)
  return cleaned.length >= 10 && cleaned.length <= 15
}

/**
 * Format phone number for WhatsApp
 * WhatsApp requires country code without + symbol
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    // US number without country code
    return `1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // US number with country code
    return cleaned
  } else {
    // International number - remove + if present
    return phone.replace(/^\+/, '').replace(/\D/g, '')
  }
}

/**
 * Generate SMS link with formatted phone number
 */
export function generateSMSLink(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForCall(phone)
  const encodedMessage = message ? `?body=${encodeURIComponent(message)}` : ''
  return `sms:${formattedPhone}${encodedMessage}`
}

/**
 * Generate WhatsApp link with formatted phone and message
 */
export function generateWhatsAppLink(phone: string, message?: string): string {
  const whatsappPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${whatsappPhone}${encodedMessage}`
}