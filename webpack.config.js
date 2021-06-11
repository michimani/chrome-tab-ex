module.exports = {
  mode: 'production',
  watch: true,
  entry: './raw/tabs.js',
  output: {
      path: __dirname + '/js',
      filename: 'tabs.js',
  }
};
