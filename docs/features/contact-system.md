# Contact System Documentation

## Overview
Simple contact display system allowing customers to reach vendors directly through their catalog pages.

## Contact Information Display

### Vendor Contact Data
```typescript
interface VendorContact {
  business_name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  operating_hours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}
```

### Contact Card Component
```typescript
const ContactCard = ({ vendor }: { vendor: Vendor }) => {
  return (
    <div className="contact-card">
      <h3>Contact {vendor.name}</h3>
      
      {/* Primary contact methods */}
      <div className="primary-contact">
        <ContactMethod 
          type="phone" 
          value={vendor.phone} 
          action={() => window.open(`tel:${vendor.phone}`)}
        />
        <ContactMethod 
          type="email" 
          value={vendor.email} 
          action={() => window.open(`mailto:${vendor.email}`)}
        />
      </div>
      
      {/* Business address */}
      {vendor.address && (
        <ContactMethod 
          type="address" 
          value={vendor.address}
          action={() => openMapsLocation(vendor.address)}
        />
      )}
      
      {/* Social media links */}
      <SocialMediaLinks social={vendor.social_media} />
      
      {/* Operating hours */}
      <OperatingHours hours={vendor.operating_hours} />
    </div>
  );
};
```

## Contact Methods

### Phone Contact
```javascript
const handlePhoneClick = (phoneNumber) => {
  // Clean phone number for tel: link
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
  
  // Track contact attempt
  analytics.track('contact_attempted', {
    vendor_id: vendor.id,
    method: 'phone',
    value: phoneNumber
  });
  
  // Open phone dialer
  window.open(`tel:${cleanPhone}`);
};
```

### Email Contact
```javascript
const handleEmailClick = (email) => {
  const subject = `Inquiry about ${vendor.name}`;
  const body = `Hi ${vendor.name},\n\nI found your catalog and I'm interested in learning more about your products.\n\nThank you!`;
  
  // Track contact attempt
  analytics.track('contact_attempted', {
    vendor_id: vendor.id,
    method: 'email',
    value: email
  });
  
  // Open email client
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
};
```

### Address/Location
```javascript
const openMapsLocation = (address) => {
  // Track location view
  analytics.track('location_viewed', {
    vendor_id: vendor.id,
    address: address
  });
  
  // Open in maps application
  const encodedAddress = encodeURIComponent(address);
  
  // Try to detect device and open appropriate map app
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    window.open(`maps://maps.apple.com/?q=${encodedAddress}`);
  } else if (isAndroid) {
    window.open(`geo:0,0?q=${encodedAddress}`);
  } else {
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`);
  }
};
```

## Database Schema

### Contact Information Storage
```sql
-- Extended vendors table with contact fields
vendors:
- id (uuid, primary key)
- slug (varchar, unique)
- name (varchar, required)
- email (varchar, required)
- phone (varchar, required)
- address (text)
- website (varchar)
- operating_hours (jsonb)
- social_media (jsonb)
- contact_preferences (jsonb)

-- Contact interaction tracking
contact_interactions:
- id (uuid, primary key)
- vendor_id (uuid, foreign key)
- interaction_type (enum: phone, email, location, social)
- interaction_value (varchar)
- user_ip (inet)
- user_agent (text)
- referrer (text)
- created_at (timestamp)
```

## Contact Analytics

### Tracking Contact Attempts
```sql
-- Daily contact attempts by method
SELECT 
  DATE(created_at) as contact_date,
  interaction_type,
  COUNT(*) as total_attempts,
  COUNT(DISTINCT user_ip) as unique_users
FROM contact_interactions 
WHERE vendor_id = ?
GROUP BY DATE(created_at), interaction_type
ORDER BY contact_date DESC;

-- Most popular contact methods
SELECT 
  interaction_type,
  COUNT(*) as attempts,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM contact_interactions 
WHERE vendor_id = ?
GROUP BY interaction_type
ORDER BY attempts DESC;
```

### Conversion Metrics
```typescript
interface ContactAnalytics {
  totalContacts: number;
  contactsToday: number;
  contactsThisWeek: number;
  contactsThisMonth: number;
  topContactMethods: Array<{
    method: string;
    count: number;
    percentage: number;
  }>;
  contactTrends: Array<{
    date: string;
    contacts: number;
  }>;
  viewToContactRate: number; // percentage of page views that result in contact
}
```

## Contact Preferences

### Vendor Contact Settings
```typescript
interface ContactPreferences {
  preferred_contact_method: 'phone' | 'email' | 'both';
  business_hours_only: boolean;
  auto_response_email: boolean;
  contact_form_enabled: boolean; // Future feature
  whatsapp_enabled: boolean;
  whatsapp_number?: string;
}
```

### Operating Hours Display
```typescript
const OperatingHours = ({ hours }: { hours: OperatingHours }) => {
  const currentDay = new Date().toLocaleLowerCase().slice(0, 3); // 'mon', 'tue', etc.
  const isOpen = checkIfOpen(hours, currentDay);
  
  return (
    <div className="operating-hours">
      <h4>
        Business Hours 
        <span className={`status ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open Now' : 'Closed'}
        </span>
      </h4>
      <ul>
        {Object.entries(hours).map(([day, time]) => (
          <li key={day} className={day === currentDay ? 'current-day' : ''}>
            <span className="day">{day}</span>
            <span className="time">{time || 'Closed'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Social Media Integration

### Social Media Links
```typescript
const socialPlatforms = {
  facebook: {
    icon: FacebookIcon,
    baseUrl: 'https://facebook.com/',
    label: 'Facebook'
  },
  instagram: {
    icon: InstagramIcon,
    baseUrl: 'https://instagram.com/',
    label: 'Instagram'
  },
  twitter: {
    icon: TwitterIcon,
    baseUrl: 'https://twitter.com/',
    label: 'Twitter'
  },
  linkedin: {
    icon: LinkedInIcon,
    baseUrl: 'https://linkedin.com/company/',
    label: 'LinkedIn'
  }
};

const SocialMediaLinks = ({ social }: { social: SocialMedia }) => {
  return (
    <div className="social-media">
      <h4>Follow Us</h4>
      <div className="social-links">
        {Object.entries(social).map(([platform, username]) => {
          if (!username) return null;
          
          const config = socialPlatforms[platform];
          const url = `${config.baseUrl}${username}`;
          
          return (
            <a 
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackSocialClick(platform, username)}
            >
              <config.icon />
              <span>{config.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};
```

## WhatsApp Integration

### WhatsApp Contact
```javascript
const openWhatsApp = (vendor) => {
  const whatsappNumber = vendor.contact_preferences?.whatsapp_number || vendor.phone;
  const message = `Hi ${vendor.name}! I found your catalog and I'm interested in your products.`;
  
  // Track WhatsApp contact
  analytics.track('contact_attempted', {
    vendor_id: vendor.id,
    method: 'whatsapp',
    value: whatsappNumber
  });
  
  // Open WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '');
  window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`);
};
```

## Contact Form (Future Enhancement)

### Simple Contact Form
```typescript
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  product_interest?: string;
}

const ContactForm = ({ vendor }: { vendor: Vendor }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send contact form submission
    await fetch('/api/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor_id: vendor.id,
        ...formData
      })
    });
    
    // Track form submission
    analytics.track('contact_form_submitted', {
      vendor_id: vendor.id
    });
  };
};
```

## API Endpoints

### Contact Tracking
- `POST /api/contact/track` - Track contact interaction
- `GET /api/vendors/[id]/contact-analytics` - Get contact statistics

### Contact Form (Future)
- `POST /api/contact/submit` - Submit contact form
- `GET /api/vendors/[id]/messages` - Get contact messages

## Mobile Optimization

### Touch-Friendly Contact Buttons
```css
.contact-button {
  min-height: 44px; /* iOS minimum touch target */
  padding: 12px 20px;
  font-size: 16px; /* Prevent zoom on iOS */
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 20px 0;
}

@media (max-width: 480px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
```

### Progressive Enhancement
- Phone numbers automatically become clickable links on mobile
- Email addresses open default email client
- Addresses open native map applications
- WhatsApp integration for messaging

## Privacy & Security

### Contact Information Protection
- Email addresses are not exposed in plain text in HTML
- Phone numbers use click-to-call functionality
- No sensitive information stored in client-side code
- Contact attempts are logged but don't store personal information

### Spam Prevention
- Rate limiting on contact tracking API
- Basic bot detection
- Honeypot fields in future contact forms