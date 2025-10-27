# QR Code & Sharing Documentation

## Overview
QR code generation and link sharing system to help vendors promote their catalog pages.

## QR Code Generation

### Automatic Generation
```javascript
// Generate QR code when vendor activates
const generateVendorQR = async (vendor) => {
  const vendorURL = `${process.env.BASE_URL}/vendors/${vendor.slug}`;
  
  const qrCodeDataURL = await QRCode.toDataURL(vendorURL, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  // Store QR code in database
  await updateVendor(vendor.id, { qr_code_url: qrCodeDataURL });
};
```

### QR Code Features
- **Size Options:** 150px, 300px, 600px (for print)
- **Formats:** PNG, SVG, PDF download
- **Customization:** Logo overlay, custom colors
- **Analytics:** Scan tracking with UTM parameters

## Database Schema

### QR Code Storage
```sql
-- Add to vendors table
vendors:
- qr_code_url (text) -- Base64 data URL or CDN URL
- qr_code_generated_at (timestamp)
- qr_scan_count (integer, default 0)

-- QR Analytics table
qr_scans:
- id (uuid, primary key)
- vendor_id (uuid, foreign key)
- scanned_at (timestamp)
- user_agent (text)
- referrer (text)
- ip_address (inet)
- utm_source (varchar)
- utm_medium (varchar)
- utm_campaign (varchar)
```

## URL Structure & UTM Tracking

### QR Code URLs
```
Base URL: /vendors/[vendorSlug]
With Tracking: /vendors/[vendorSlug]?utm_source=qr&utm_medium=scan&utm_campaign=vendor_promotion
```

### Link Sharing URLs
```javascript
const generateSharableLinks = (vendor) => ({
  qr: `/vendors/${vendor.slug}?utm_source=qr&utm_medium=scan`,
  whatsapp: `/vendors/${vendor.slug}?utm_source=whatsapp&utm_medium=social`,
  email: `/vendors/${vendor.slug}?utm_source=email&utm_medium=direct`,
  social: `/vendors/${vendor.slug}?utm_source=social&utm_medium=share`
});
```

## QR Code Dashboard

### Vendor QR Management
```
Dashboard Features:
- QR code preview
- Download options (PNG, SVG, PDF)
- Regenerate QR code
- Scan analytics
- Share link generator
```

### Analytics Display
```typescript
interface QRAnalytics {
  totalScans: number;
  scansToday: number;
  scansThisWeek: number;
  scansThisMonth: number;
  topSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  scanHistory: Array<{
    date: string;
    scans: number;
  }>;
}
```

## API Endpoints

### QR Management
- `GET /api/vendors/[id]/qr` - Get QR code and analytics
- `POST /api/vendors/[id]/qr/regenerate` - Generate new QR code
- `GET /api/vendors/[id]/qr/download` - Download QR in format
- `POST /api/qr/scan` - Track QR code scan

### Analytics
- `GET /api/vendors/[id]/analytics/qr` - QR scan analytics
- `GET /api/vendors/[id]/analytics/traffic` - Traffic source breakdown

## Frontend Components

### QR Code Display
```typescript
interface QRCodeComponentProps {
  vendor: Vendor;
  size?: 'small' | 'medium' | 'large';
  downloadable?: boolean;
  showAnalytics?: boolean;
}

const QRCodeComponent = ({ vendor, size = 'medium', downloadable = true }: QRCodeComponentProps) => {
  // QR code display with download options
};
```

### Share Options
```typescript
const ShareButtons = ({ vendor }: { vendor: Vendor }) => {
  const shareURL = `/vendors/${vendor.slug}`;
  
  const shareOptions = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=Check out ${vendor.name}: ${shareURL}?utm_source=whatsapp`,
      icon: WhatsAppIcon
    },
    {
      name: 'Email',
      url: `mailto:?subject=${vendor.name}&body=Check out ${vendor.name}: ${shareURL}?utm_source=email`,
      icon: EmailIcon
    },
    {
      name: 'Copy Link',
      action: () => copyToClipboard(`${shareURL}?utm_source=copy`),
      icon: LinkIcon
    }
  ];
};
```

## Scan Tracking Implementation

### Client-Side Tracking
```javascript
// Track QR code scans on page load
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  
  if (utmSource === 'qr') {
    // Track QR scan
    fetch('/api/qr/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor_id: vendor.id,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign')
      })
    });
  }
}, [vendor.id]);
```

### Server-Side Processing
```javascript
// /api/qr/scan endpoint
export async function POST(request) {
  const { vendor_id, user_agent, referrer, utm_source, utm_medium } = await request.json();
  
  // Record scan
  await db.qr_scans.create({
    vendor_id,
    user_agent,
    referrer,
    utm_source,
    utm_medium,
    scanned_at: new Date(),
    ip_address: getClientIP(request)
  });
  
  // Increment vendor scan count
  await db.vendors.update(vendor_id, {
    qr_scan_count: { increment: 1 }
  });
  
  return new Response('OK');
}
```

## QR Code Customization

### Design Options
```javascript
const qrCodeOptions = {
  basic: {
    width: 300,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' }
  },
  branded: {
    width: 300,
    margin: 2,
    color: { dark: vendor.brandColor || '#000000', light: '#FFFFFF' },
    logo: vendor.logo_url,
    logoOptions: {
      width: 60,
      height: 60,
      margin: 10
    }
  },
  print: {
    width: 600,
    margin: 4,
    color: { dark: '#000000', light: '#FFFFFF' }
  }
};
```

### Download Formats
```javascript
const downloadQR = async (format, size) => {
  const options = qrCodeOptions[size];
  
  switch (format) {
    case 'png':
      return await QRCode.toDataURL(vendorURL, options);
    case 'svg':
      return await QRCode.toString(vendorURL, { ...options, type: 'svg' });
    case 'pdf':
      // Generate PDF with QR code and vendor info
      return generateQRPDF(vendorURL, vendor, options);
  }
};
```

## Print-Ready Materials

### QR Code Flyer Generation
```javascript
const generateQRFlyer = async (vendor) => {
  const doc = new jsPDF();
  
  // Add vendor logo
  if (vendor.logo_url) {
    doc.addImage(vendor.logo_url, 'PNG', 20, 20, 50, 50);
  }
  
  // Add vendor info
  doc.setFontSize(24);
  doc.text(vendor.name, 20, 90);
  doc.setFontSize(14);
  doc.text(vendor.description, 20, 110);
  
  // Add QR code
  const qrCode = await QRCode.toDataURL(vendorURL, { width: 200 });
  doc.addImage(qrCode, 'PNG', 20, 130, 60, 60);
  
  // Add scan instruction
  doc.text('Scan to view our catalog', 90, 160);
  
  return doc.output('blob');
};
```

## Marketing Integration

### Social Media Sharing
```javascript
const socialShareTemplates = {
  instagram: {
    caption: `🛍️ Check out our latest products! Scan the QR code or visit our catalog at ${vendorURL}`,
    hashtags: ['#shopping', '#catalog', '#qrcode']
  },
  facebook: {
    text: `Visit our product catalog! Easy access via QR code: ${vendorURL}`,
    image: qrCodeURL
  },
  twitter: {
    text: `🔗 Browse our catalog instantly! ${vendorURL} #QRCode #Shopping`,
    image: qrCodeURL
  }
};
```

### Email Templates
```html
<!-- QR code email template -->
<div style="text-align: center; padding: 20px;">
  <h2>{{vendor.name}} Product Catalog</h2>
  <p>Scan the QR code below to browse our products:</p>
  <img src="{{qrCodeURL}}" alt="QR Code for {{vendor.name}}" style="width: 200px; height: 200px;">
  <p>Or visit directly: <a href="{{vendorURL}}">{{vendorURL}}</a></p>
</div>
```

## Analytics & Insights

### QR Performance Metrics
```sql
-- Daily scan trends
SELECT 
  DATE(scanned_at) as scan_date,
  COUNT(*) as total_scans,
  COUNT(DISTINCT ip_address) as unique_scans
FROM qr_scans 
WHERE vendor_id = ? 
GROUP BY DATE(scanned_at)
ORDER BY scan_date DESC;

-- Traffic source analysis
SELECT 
  utm_source,
  utm_medium,
  COUNT(*) as scans,
  COUNT(DISTINCT ip_address) as unique_visitors
FROM qr_scans 
WHERE vendor_id = ?
GROUP BY utm_source, utm_medium;
```

### Success Metrics
- QR scan to contact conversion rate
- Popular scan locations (based on IP geo-location)
- Peak scanning times
- Device types (mobile vs desktop)