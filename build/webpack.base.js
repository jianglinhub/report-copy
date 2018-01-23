const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../webapp')
  },
  resolve: {
    extensions: [' ', '.js', '.vue', '.json']
  },
  module: {
    rules: [{
        enforce: 'pre',
        test: /.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.html$/,
        loader: 'html-loader'
      },
      {
        test: /.(less|css)$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      },
      {
        test: /.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
}
