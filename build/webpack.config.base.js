//  webpack基础配置

//  path 模块用于处理文件和目录的路径。
//  path.join() 方法使用平台特定的分隔符把全部给定的 path 片段连接到一起，并规范化生成的路径
//      path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');  返回: '/foo/bar/baz/asdf'
//  path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径。
//      给定的路径的序列是从右往左被处理的，后面每个 path 被依次解析，直到构造完成一个绝对路径。如果处理完全部给定的 path 片段后还未生成一个绝对路径，则当前工作目录会被用上。
//      例如，给定的路径片段的序列为：/foo、/bar、baz，则调用 path.resolve('/foo', '/bar', 'baz') 会返回 /bar/baz。
const path = require('path')  
const createVueLoaderOptions = require('./vue-loader.config')

const isDev = process.env.NODE_ENV === 'development'
console.log('isDev: ',isDev);

const config = {
  //  构建目标（target）：因为服务器和浏览器代码都可以用JavaScript编写，所以webpack提供了多种构建目标(target)，可以在webpack配置中设置
  //  每个target都有各种部署(deployment)/环境(environment)特定的附加项，以支持满足其需求。
  //  示例：target: 'node' —— 用node，webpack会编译为用于「类Node.js」环境（使用Node.js的require，而不是使用任意内置模块（如fs或path）来加载chunk）。
  target: 'web', //   默认是 'web'，可省略
  entry: path.join(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist')
  },
  module: {
    rules: [
      // {
      //   text: /\.(vue|js|jsx)$/,
      //   loader: 'eslint-loader',
      //   exclude: /node_modules/,
      //   enforce: 'pre' //  预处理，在使用真正的loader之前，都会经过 eslint-loader 进行处理
      // },
      {
        // 处理vue文件 loader
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderOptions(isDev)
      },
      {
        //  处理jsx文件 loader
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        //  处理JavaScript文件loader
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/  // exclude 排除，不需要编译的目录，提高编译速度
      },
      {
        //  处理图片loader
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'resources/[path][name]-[hash:8].[ext]'  // 生成到dist底下的resource中，路径按照原路径已有的名字命名
            }
          }
        ]
      }
    ]
  }
}

module.exports = config
