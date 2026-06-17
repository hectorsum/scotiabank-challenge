import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        status: {
          pendiente: '#fbbf24',
          'en-revision': '#60a5fa',
          aprobada: '#10b981',
          rechazada: '#ef4444',
          cerrada: '#6b7280',
        },
        priority: {
          baja: '#3b82f6',
          media: '#f59e0b',
          alta: '#ef4444',
          critica: '#7c3aed',
        },
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;