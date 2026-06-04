/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        navy: {
          950: '#080e1e',
          900: '#0F1629',
          800: '#162040',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.04)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
