module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
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
