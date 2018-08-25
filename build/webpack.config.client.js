const path = require('path')  //  path 模块用于处理文件和目录的路径。
const webpack = require('webpack')  //  调用 webpack 模块
const merge = require('webpack-merge')  //  将webpack的配置文件进行合并
const VueLoaderPlugin = require('vue-loader/lib/plugin')  // Vue-loader在15.*之后的版本都是 vue-loader的使用都是需要伴生 VueLoaderPlugin的
const HTMLPlugin = require('html-webpack-plugin')  //  直接为项目生成一个或多个 HTML 文件（个数由插件实例的个数决定），并将webpack打包后输出的所有脚本文件自动添加到插件生成的HTML文件中
const ExtractPlugin = require('extract-text-webpack-plugin')  //  为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const baseConfig = require('./webpack.config.base')  //  引入 webpack 基础配置

//  process.env 属性返回一个包含用户环境信息的对象。
//  在入口处区分生产环境和开发环境：修改package.json的script项，通过set NODE_ENV来设置环境变量
//      此项目中使用了 cross-env，因为其能能跨平台地设置及使用环境变量，不同平台使用唯一指令，无需担心跨平台问题
//      开发环境设置：cross-env NODE_ENV=development    生产环境设置：cross-env NODE_ENV=production  （具体参见 package.json 设置）
//  Node 中有全局变量 process 表示当前node进程，process.env包含着关于系统环境的信息。process.env 中并不存在 NODE_ENV 这个东西。
//  其实NODE_ENV只是一个用户自定义的变量，但是这个 NODE_ENV 变量语义非常恰当，并且在前端工程化配置中作为判断生产环境/开发环境的依据是非常自然而方便的事情，因而在前端工程化中逐渐成为一个事实规范。
//  当我们在服务启动时配置 NODE_ENV,或在代码中给 process.env.NODE_ENV 赋值，js便能通过 process.env.NODE_ENV 获取信息。
const isDev = process.env.NODE_ENV === 'development'  

const defaultPlugin = [
  //  DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new VueLoaderPlugin(),  // make sure to include the plugin for the magic
  new HTMLPlugin,
]

const devServer = {
  port: 8000,
  host: '0.0.0.0',
  overlay: {
    errors: true
  },
  hot: true
}
let config

if (isDev) {
  config = merge(baseConfig, {
    devtool: '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.styl/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devServer,
    plugins: defaultPlugin.concat([
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  })
} else {
  config = merge(baseConfig, {
    entry: {
      app: path.join(__dirname, '../client/index.js'),
      vendor: ['vue']
    },
    output: {
      filename:'[name].[chunkhash:8].js'
    },
    module: {
      rules: [{
        test: /\.styl/,
        use: ExtractPlugin.extract({
          //  extract-text-webpack-plugin 插件参数：
          //    > use：指需要什么样的loader去编译文件，如果源文件是.css所以选择css-loader
          //    > fallback：编译后用什么loader来提取css文件
          //    > publicfile：用来覆盖项目路径，生成该css文件的文件路径
          fallback: 'style-loader',  
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              }
            },
            'stylus-loader'
          ]
        })
      }]
    },
    plugins: defaultPlugin.concat([
      new ExtractPlugin('style.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      })
    ])
  })
}

module.exports = config
