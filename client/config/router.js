import Router from 'vue-router'
import routes from './routes'

// 好处：项目如果需要用到服务端渲染，如果只 export default router 的话，会导致在服务端渲染出现内存溢出
// 因为 export default router 只有一个router，每一次服务端渲染都会生成一个 app ，
// 然而 router 只有一个对象，就会缓存每次新建的 app，导致服务端渲染流程结束之后，app 的对象没有被释放，导致内存不会下降，一直处于在很高的点，就会导致内存溢出
export default () => {
  return new Router({
    routes,
    mode: 'history', //  或者 hash
    // base: '/base/',  //  记得加上前后的斜杠 '/'
    // linkActiveClass: 'active-link',
    // linkExactActiveClass: 'exact-active-link',
    scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    fallback: true
    // parseQuery (query) {

    // },
    // stringifyQuery (obj) {

    // }
  })
}

// const router = new Router({
//   routes
// })
// export default router
// 如果在全局 import router的时候，那么将会是同一个 router，
// 如果需要每次 import 之后，创建一个新的 router 就需要采用函数的方式 返回一个 router
