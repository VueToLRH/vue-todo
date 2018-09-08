//  Vue 基础知识dome webpack配置

const path = require('path')  //  path 模块用于处理文件和目录的路径。
const webpack = require('webpack')  //  调用 webpack 模块
const merge = require('webpack-merge')  //  将webpack的配置文件进行合并
const baseConfig = require('./webpack.config.base')  //  引入 webpack 基础配置
const ExtractPlugin = require('extract-text-webpack-plugin')  // 将样式文件单独打包
const VueServerPlugin = require('vue-server-renderer/server-plugin') //

let config

config = merge(baseConfig, {
  mode: 'development',
  entry: path.join(__dirname, '../client/server-entry.js'),
  devtool: 'ource-map',  // Source Map
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  externals: Object.keys(require('../package.json').dependencies),
  module: {
    rules: [
      {
        test: /\.styl/,
        use: ExtractPlugin.extract({
          fallback: 'vue-style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  resolve: {
    alias: {
      'model': path.join(__dirname, '../client/model/server-model.js')
    }
  },
  plugins: [
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"',
    }),
    new VueServerPlugin()
  ]
})

module.exports = config
