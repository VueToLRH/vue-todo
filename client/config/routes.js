// import Todo from '../views/todo/todo.vue'
// import Login from '../views/login/login.vue'

export default [
  {
    // 当 vue 发现路由为默认路由，就会自动重定向到 '/app'
    path: '/',
    redirect: '/app'
  },
  {
    path: '/app',
    // path: '/app/:id', // /app/xxx
    props: true,
    // props: (route) => ({ id: route.query.b }),
    component: () => import(/* webpackChunkName: "todo-view" */ '../views/todo/todo.vue'),
    // component: Todo,
    name: 'app', //  可用于进行路由的跳转，eg： <router-link :to="{name: 'app'}">app</router-link>
    meta: { //  用于保存路由中的信息
      title: 'this is app',
      description: 'app'
    },
    beforeEnter (to, from, next) {
      console.log('app route before enter')
      next()
    }
    // childre: [  //  子路由,嵌套路由
    //   {
    //     path: 'test',
    //     component: Login
    //   }
    // ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login-view" */ '../views/login/login.vue')
    // component: Login
  }
]
