//  Vue 基础知识dome webpack配置

const path = require('path')  //  path 模块用于处理文件和目录的路径。
const webpack = require('webpack')  //  调用 webpack 模块
const merge = require('webpack-merge')  //  将webpack的配置文件进行合并
const baseConfig = require('./webpack.config.base')  //  引入 webpack 基础配置
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

//  process.env 属性返回一个包含用户环境信息的对象。
//  在入口处区分生产环境和开发环境：修改package.json的script项，通过set NODE_ENV来设置环境变量
//      此项目中使用了 cross-env，因为其能能跨平台地设置及使用环境变量，不同平台使用唯一指令，无需担心跨平台问题
//      开发环境设置：cross-env NODE_ENV=development    生产环境设置：cross-env NODE_ENV=production  （具体参见 package.json 设置）
//  Node 中有全局变量 process 表示当前node进程，process.env包含着关于系统环境的信息。process.env 中并不存在 NODE_ENV 这个东西。
//  其实NODE_ENV只是一个用户自定义的变量，但是这个 NODE_ENV 变量语义非常恰当，并且在前端工程化配置中作为判断生产环境/开发环境的依据是非常自然而方便的事情，因而在前端工程化中逐渐成为一个事实规范。
//  当我们在服务启动时配置 NODE_ENV,或在代码中给 process.env.NODE_ENV 赋值，js便能通过 process.env.NODE_ENV 获取信息。

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
