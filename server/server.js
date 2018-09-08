const Koa = require('koa')

const app = new Koa()

const isDev = process.env.NODE_ENV === 'development'
// 服务端渲染是分开发环境和生产环境两种不同的情况。需要对环境进行判断

// 中间件，用来记录所有的请求和抓取的错误，可以很好的了解到在服务端渲染的过程中是否出现了一些错误，并及时排查掉错误。
app.use(async (ctx, next) => {
  try {
    console.log(`request with path ${ctx.path}`)
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = 500
    if (isDev) {
      ctx.body = err.message
    } else {
      ctx.bosy = 'please try again later'
    }
  }
})
// 说明：在函数前面加一个async，就代表异步处理函数，而参数next表示执行下一个 异步处理的函数。
//      在try循环体内，console打印出请求的路径。
//      如果是isDev为true的情况，可以直接将错误信息写到body里面，这样就可以在页面上直接看到错误信息。
//      如果不是开发环境，可以写一个友善的提醒文字，例如：“please try again later”。
//      这就是最简单的一个koa中间件，用来记录所有的请求及出现的错误，并且返回一个错误信息。

