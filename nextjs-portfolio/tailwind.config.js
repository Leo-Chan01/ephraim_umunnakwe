/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0B', // Rich black
          light: '#141415',
          dark: '#050505',
        },
        secondary: {
          DEFAULT: '#FDFDFD', // Off-white
          dark: '#EAEAEA',
        },
        accent: {
          DEFAULT: '#2563EB', // Vibrant blue (retaining some brand identity but cleaner)
          light: '#3B82F6',
          dark: '#1D4ED8',
          text: '#FFFFFF',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      borderWidth: {
        '3': '3px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      letterSpacing: {
        tightest: '-.075em',
        tighter: '-.05em',
      },
    },
  },
  plugins: [],
}
