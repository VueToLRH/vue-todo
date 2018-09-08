//  Vue 服务器端渲染的配置文件 webpack 配置

const path = require('path')  //  path 模块用于处理文件和目录的路径。
const webpack = require('webpack')  //  调用 webpack 模块
const merge = require('webpack-merge')  //  将webpack的配置文件进行合并
const baseConfig = require('./webpack.config.base')  //  引入 webpack 基础配置
const ExtractPlugin = require('extract-text-webpack-plugin')  // 将样式文件单独打包
const VueServerPlugin = require('vue-server-renderer/server-plugin')
// 此插件能帮我们单独地生成一个json文件，用于在vue的服务端渲染里面能帮助我们处理一些很复杂的逻辑。

let config

config = merge(baseConfig, {
  // mode: 'development',
  target: 'node',  // 构建目标：打包出来的程序是在node端运行的，不是在浏览器端运行，所以要指定打包的目标是node环境。
  entry: path.join(__dirname, '../client/server-entry.js'),  // entry需要提供一个单独的入口文件，所以需要在client文件夹下新建一个server-entry.js文件。
  devtool: 'ource-map',  // Source Map vue-server-renderer 有个webpack插件，它能提供代码调试的功能，不过只能提示到出错的文件出在哪一行。
  output: {
    libraryTarget: 'commonjs2',
    // 指定libraryTarget的类型为commonjs2，用来指定代码 export出去的入口的形式。
    // 在node.js中模块是 module.exports = {...}，commonjs2打包出来的代码出口形式就类似于此。
    filename: 'server-entry.js',
    path: path.join(__dirname, '../server-build')
  },
  externals: Object.keys(require('../package.json').dependencies),
  // externals是外部因素的意思，可以打开 package.json 文件看看 dependencies
  // 用Object.keys()得到的就是一个数组。
  // externals就是告诉webpack不要去打包node_modules里面的js代码。
  // devDependencies里面是一些工具型的东西，在应用真正跑起来的时候是不需要的。只有在执行一些打包，工具化操作的时候才会需要它。
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
      // vue服务端官方建议这么去做的，在vue-server-renderer里面可能会用到这个属性
    }),
    new VueServerPlugin()
  ]
})

module.exports = config
