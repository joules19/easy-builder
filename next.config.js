/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental CSS optimization that requires critters
  experimental: {},
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Optimize imports
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce client bundle size
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects for vendor URLs
  async redirects() {
    return [
      {
        source: '/vendor/:slug*',
        destination: '/vendors/:slug*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig