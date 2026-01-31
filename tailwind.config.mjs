/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // カスタムカラーパレット（落ち着いた大人の雰囲気）
        navy: {
          950: '#0a0e1c',
          900: '#141b36',
          800: '#1e294f',
          700: '#27355e',
        },
        gold: {
          500: '#b8984a',
          600: '#a68940',
        },
        ink: {
          100: '#f8f9fa',
          200: '#dee2e6',
          300: '#adb5bd',
          400: '#6c757d',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Garamond', 'serif'],
        sans: ['Source Sans 3', 'Noto Sans JP', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
