module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Arial', 'sans-serif'],
    },
    fontSize: {
      'sm': ['.76rem', {
        letterSpacing: '.015em',
        lineHeight: '1.2',
      }],
      'base': ['1rem', {
        letterSpacing: '.015em',
        lineHeight: '1.25',
      }],
      'lg': ['1.08rem', {
        letterSpacing: '.025em',
        lineHeight: '1.2',
      }]
    },
    extend: {
      backgroundImage: {
        'caret': 'url("/assets/caret.svg")',
        'plus': 'url("/assets/plus.svg")',
        'times': 'url("/assets/times.svg")',
      },
      colors: {
        'red': 'red',
        'lightgray': 'lightgray',
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
      },
      animation: {
        alert: 'alert 250ms step-end 5',
        bounce: 'bounce 750ms infinite',
      },
      keyframes: {
        alert: {
          '0%, 100%': {
            backgroundColor: 'white',
            color: 'black'
          },
          '50%': {
            backgroundColor: 'var(--alert-color)',
            color: 'white'
          },
        },
        bounce: {
          '0%, 100%': {
            top: '0%',
            transform: 'var(--tw-transform)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
          '50%': {
            top: '-25%',
            transform: 'var(--tw-transform)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          }
        }
      },
      screens: {
          'can-hover': {'raw': '(hover: hover)'},
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['checked'],
      display: ['group-hover'],
    },
  },
  plugins: [],
}
