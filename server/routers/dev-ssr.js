// koa-router dev-ssr.js 用于处理开发时服务端渲染的情况

const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs') // 一个简单的内存文件系统。将数据保存在JavaScript对象中。
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)

// 指定了webpack的输出目录在MemoryFS里面
const mfs = new MemoryFS()
serverCompiler.outputFileSystem = mfs

let bundle  // 用来记录webpack每次打包生成的新的文件

// 用watch()的好处是：跟使用webpack-dev-server一样，在client目录下每次修改一个文件，它都会重新执行一次打包，然后就可以拿到新的文件了。
// serverCompiler.watch()的第一个参数是空对象，第二个参数是一个回调。如果有err直接抛出。
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))

  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  // 读取生成的bundle文件，拼接读取文件的路径，设置文件名字，并且制定编码为utf-8，最后通过JSON.parse()将字符串转成JSON。
  console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }

  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8000/public/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  )

  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      inject: false,
      clientManifest
    })
    // 在服务端渲染期间，使用ejs模板引擎生成HTML。
    // 通过VueServerRenderer的createBundleRenderer()方法帮助生成一个可以直接调用renderer的函数。
    // 在这里面接收几个参数：
    // 第一个是inject，设置为false，这样它就不会执行其他的注入的操作了。
    // 第二个是clientManifest，它会自动生成一个带有script标签的js文件引用的字符串，这样可以直接添加到ejs的内容里面。

  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
