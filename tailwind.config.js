/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        'background-secondary': '#111118',
        primary: {
          DEFAULT: '#06b6d4',
          light: '#22d3ee',
          dark: '#0891b2'
        },
        secondary: {
          DEFAULT: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb'
        },
        income: '#10b981',
        expense: '#f43f5e'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
}