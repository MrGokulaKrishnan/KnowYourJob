/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#000000',
          secondary: '#050505',
          card: 'rgba(8, 8, 10, 0.82)',
          elevated: '#0e0e11',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-hover': 'rgba(245, 158, 11, 0.40)',
          amoled: '#000000',
        },
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          glow: 'rgba(245, 158, 11, 0.25)',
        },
        text: {
          primary: '#f8fafc',
          secondary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'liquid-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'liquid-glass-hover': '0 12px 40px 0 rgba(245, 158, 11, 0.18)',
        'gold-glow': '0 0 25px rgba(245, 158, 11, 0.3)',
        'gold-glow-lg': '0 0 45px rgba(245, 158, 11, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
        'glass-xl': '24px',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
