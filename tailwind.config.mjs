/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // カスタムカラーパレット（明るく温かみのある大人の雰囲気）
        cream: {
          50: '#fdfcfa',
          100: '#faf8f3',
          200: '#f5f1e8',
          300: '#ede6d9',
        },
        mocha: {
          100: '#e8dfd5',
          200: '#d4c4b0',
          300: '#b8a38a',
          400: '#9d8367',
          500: '#7d6650',
        },
        terracotta: {
          400: '#c87d5c',
          500: '#b86f4f',
          600: '#a05d42',
        },
        charcoal: {
          600: '#5a5350',
          700: '#3d3735',
          800: '#2a2523',
          900: '#1a1614',
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
