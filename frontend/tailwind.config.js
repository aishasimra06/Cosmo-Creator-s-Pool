/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        light: {
          bg: '#F5F3ED', // Warm fog/ivory
          surface: 'rgba(255, 255, 255, 0.65)',
          surfaceHover: 'rgba(255, 255, 255, 0.85)',
          border: 'rgba(255, 255, 255, 0.6)',
          borderHover: 'rgba(255, 255, 255, 0.9)',
        },
        text: {
          main: '#1C1B1A', // Dark charcoal
          muted: '#7A7571', // Warm gray
          light: '#A39D98', // Soft warm gray
        },
        primary: {
          400: '#8B5CF6',
          500: '#6C63FF',
          600: '#5B21B6',
        },
        accent: {
          400: '#60A5FA',
          500: '#4F8CFF',
          600: '#1D4ED8',
        },
        sand: {
          300: '#E6E1D6',
          400: '#D4CBBB',
          500: '#BDB19C',
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
        'glass-gradient-hover': 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%)',
        'warm-radial': 'radial-gradient(circle at center, rgba(212, 203, 187, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(140, 130, 120, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(140, 130, 120, 0.12)',
        'glow-subtle': '0 0 20px rgba(108, 99, 255, 0.15)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
