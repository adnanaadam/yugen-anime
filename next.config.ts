import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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