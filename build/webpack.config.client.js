const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js'),
  },
  output: {
    filename: '[name].[hash].js',
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})

// localhost:8888/filename
if (isDev) {
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    host: '0.0.0.0',
    compress: true,
    port: '8888',
    contentBase: path.join(__dirname, '../webapp'),
    hot: true,
    overlay: {
      errors: true
    },
    historyApiFallback: {
      index: '/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: [
      'axios',
      'iview',
      'vue',
      'vue-i18n',
      'vue-router'
    ]
  }
  config.output.filename = '[name].[chunkhash].js'
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(), // 压缩代码
    new webpack.optimize.CommonsChunkPlugin({ // 分离业务代码和vendor里面的代码单独打包
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 将每次打包webpack自动生成的代码无限压缩，因为是不变的，就算没有业务代码也是这么多
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NamedChunksPlugin((chunk) => { // 保证webpack打包的所有模块都是有名字的
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}

module.exports = config
