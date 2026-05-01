/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#0a0a0b',
        panel: '#141416',
        border: '#27272a',
        accent: '#3b82f6',
      },
    },
  },
  plugins: [],
};
