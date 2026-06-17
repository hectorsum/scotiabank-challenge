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
          pendiente: '#6E675B',
          'en-revision': '#97601C',
          aprobada: '#2E7B4E',
          rechazada: '#B23A3A',
          cerrada: '#57534A',
        },
        priority: {
          baja: '#8C857A',
          media: '#B98A3A',
          alta: '#C8965A',
          critica: '#C84B4B',
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