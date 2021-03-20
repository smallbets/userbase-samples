const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
        path: path.resolve(__dirname, 'dist'),
        template: 'index.html',
    })
  ]
}
