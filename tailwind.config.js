/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEFA',
          100: '#FAF7F0',
          200: '#F5EFE6',
          300: '#EDE4D4',
        },
        atc: {
          black: '#121316',
          navy: '#0B0F19',
          darkBlue: '#151A2E',
          purple: '#6C5CE7',
          lavender: '#A29BFE',
          softPurple: '#EBE8FC',
          yellow: '#FFD32A',
          brightYellow: '#FFE600',
          coral: '#FF6B6B',
          pink: '#FF8ED4',
          softPink: '#FFE5EC',
          blue: '#2E86DE',
          lightBlue: '#54A0FF',
          skyBlue: '#48DBFB',
          green: '#10AC84',
          lime: '#2ED573',
          softGreen: '#D4F8E8',
          orange: '#FF793F',
          amber: '#FFA502',
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Fredoka', 'sans-serif'],
        hand: ['"Caveat"', '"Patrick Hand"', 'cursive'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'pop': '4px 4px 0px #121316',
        'pop-lg': '6px 6px 0px #121316',
        'pop-xl': '8px 8px 0px #121316',
        'pop-sm': '2px 2px 0px #121316',
        'pop-purple': '4px 4px 0px #6C5CE7',
        'pop-yellow': '4px 4px 0px #FFD32A',
        'pop-blue': '4px 4px 0px #2E86DE',
        'pop-pink': '4px 4px 0px #FF6B6B',
        'pop-hover': '1px 1px 0px #121316',
      },
      borderRadius: {
        'doodle': '255px 15px 225px 15px/15px 225px 15px 255px',
        'doodle-2': '20px 255px 20px 255px/255px 20px 255px 20px',
        'badge': '9999px',
        'card': '24px',
        'card-lg': '32px',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-fast': 'float 3.5s ease-in-out infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
