module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'homepage': 'url("./illustration.png")',
      },
      borderWidth: {
        '1': '1px',
      },
      colors: {
        'pink': '#f095d8',
        'yellow': '#ff0',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
      },
      fontFamily: {
        'chrastina': 'ChrastinaProGX',
        'zaum': 'Zaum',
      }
    },
  },
  variants: {
    extend: {
      display: ['group-hover']
    },
  },
  plugins: [],
}
