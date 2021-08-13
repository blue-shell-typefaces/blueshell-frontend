module.exports = {
  publicPath: '/',
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Blue Shell Type'
    }
  },
  devServer: {
    host: '0.0.0.0',
    allowedHosts: [
      '.local',
    ]
  }
}
