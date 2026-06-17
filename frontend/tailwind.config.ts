import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Courier New', 'monospace'],
      },
      colors: {
        'bg-page':    '#F4F1EA',
        'bg-surface': '#FFFFFF',
        'bg-hover':   '#FBF9F3',
        'fg-primary':   '#161310',
        'fg-secondary': '#57534A',
        'fg-muted':     '#8C857A',
        'fg-faint':     '#A8A293',
        accent:        '#C8965A',
        'accent-light': '#DDB07E',
        // Status text colors
        'status-pendiente': '#6E675B',
        'dot-pendiente':    '#B8AE9C',
        'status-revision':  '#97601C',
        'dot-revision':     '#C8965A',
        'status-aprobada':  '#2E7B4E',
        'dot-aprobada':     '#4BAB72',
        'status-rechazada': '#B23A3A',
        'dot-rechazada':    '#C84B4B',
        'status-cerrada':   '#57534A',
        'dot-cerrada':      '#57534A',
        // Priority colors
        'priority-baja':    '#8C857A',
        'priority-media':   '#B98A3A',
        'priority-alta':    '#C8965A',
        'priority-critica': '#C84B4B',
        // Semantic
        error:   '#C84B4B',
        success: '#4BAB72',
        warning: '#C8A94B',
      },
      borderRadius: {
        xs: '6px',
        sm: '7px',
        md: '8px',
        lg: '10px',
        xl: '12px',
      },
      boxShadow: {
        xs:    '0 1px 2px rgba(20,17,13,0.12)',
        sm:    '0 2px 4px rgba(20,17,13,0.10)',
        md:    '0 4px 12px rgba(20,17,13,0.10)',
        lg:    '0 10px 30px rgba(20,17,13,0.10)',
        xl:    '0 24px 64px rgba(20,17,13,0.22)',
        toast: '0 12px 40px rgba(20,17,13,0.28)',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
