/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        managementBg: '#fcfcfd',
        managementAccent: '#51bc8f',
        publicPrimary: '#B91C1C',
        publicSecondary: '#F59E0B',
        publicBg: '#FFFBF0',
        corporateBlue: {
          50: '#f5f9ff',
          100: '#e1eefa',
          200: '#c3def4',
          300: '#a4cdef',
          400: '#7bb9e8',
          500: '#529fe0',
          600: '#3a7cc9',
          700: '#2c5a9a',
          800: '#1e3a6a',
          900: '#0f1a3a',
        },
        corporateGray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        corporateAccent: '#2563eb', // blue-600
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'screen-xxl': '1200px',
      },
    },
  },
  plugins: [],
};
