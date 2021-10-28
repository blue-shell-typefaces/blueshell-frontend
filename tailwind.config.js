module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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
        '1': '1px',
      },
      colors: {
        'blue': '#2c78ff',
        'orange': '#ff7a4d',
        'beige': '#e4dbc8',
        'green': '#00bb00',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
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
