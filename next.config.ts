import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
       formats: ["image/avif", "image/webp"],
    remotePatterns: [
       {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '/**',
      },
       {
      protocol: 'https',
      hostname: '**.anilist.co',  // This allows any subdomain of anilist.co
      port: '',
      pathname: '/**',
    },
     {
      protocol: 'https',
      hostname: 'cdn.myanimelist.net',
      port: '',
      pathname: '/**',
    },
    ],

       deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              replaceAttrValues: {
                '#000': 'currentColor',
                '#000000': 'currentColor',
                'black': 'currentColor',
                '#fff': 'currentColor', 
                '#ffffff': 'currentColor',
                'white': 'currentColor',
                '#e5b23c': 'currentColor',
                '#ff5b47': 'currentColor',
                '#d8d5cc': 'currentColor',
                '#6C5CE7': 'currentColor',
              },
              svgProps: {
                fill: 'currentColor',
                stroke: 'currentColor',
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;