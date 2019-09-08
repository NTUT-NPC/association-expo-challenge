
module.exports = {
  devServer: {
    // Enable dev server to accept the external requests.
    disableHostCheck: true
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/association-expo-challenge/'
    : '/'
}
