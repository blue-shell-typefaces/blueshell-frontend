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
        'blue': '#2c78ff',
        'orange': '#ff6c3d',
        'beige': '#e4dbc8',
        'green': '#00bb00',
      },
      cursor: {
        grab: 'grab',
        grabbing: 'grabbing',
      },
      inset: {
        '1/2': '50%',
        '1/8': '12.5%',
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
