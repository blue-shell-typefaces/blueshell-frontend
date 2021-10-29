module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Arial'],
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
      borderWidth: {
        '1': '2px',
      },
      colors: {
        'red': '#ff0000',
        'orange': '#ff7a4d',
        'beige': '#e4dbc8',
        'primary': 'var(--primary-color)',
        'secondary': 'var(--secondary-color)',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
      },
      animation: {
        alert: 'alert 500ms step-end 3'
      },
      keyframes: {
        alert: {
          '0%, 100%': { backgroundColor: 'white' },
          '50%': { backgroundColor: 'var(--alert-color)' },
        }
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
