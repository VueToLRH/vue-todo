import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
  const store = new Vuex.Store({
    // strict: true,
    // 进行数据修改限制，不能从外部进行修改。  外部修改数据示例： this.$store.state.count = 3
    // 在开发环境中可以设置为 true 进行代码规范，但是在正式环境需要关闭：
    strict: isDev,

    state: defaultState,

    mutations,
    // 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
    // 不能写异步代码
    // mutations 中的方法只接受两个参数，第一个是 state，第二个是一个对象
    // updateCount (state, num)
    // 如果需要传两个参数，那个需要传递一个对象 this.$store.commit('updateCount', { num1, num2 })，通过解构，可以传入，即：updateCount (state, { num1, num2 })

    getters,
    // 可以认为是 store 的计算属性
    // 像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

    actions,
    // Action 类似于 mutation，不同在于：
    // >>> Action 提交的是 mutation，而不是直接变更状态。
    // >>> Action 可以包含任意异步操作。

    // 插件
    // plugins: [
    //   (store) => {
    //     console.log('my plugin invoked')
    //   }
    // ],

    modules: {
      // 分模块解决的问题：由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。
      // Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割
      a: {
        namespaced: true,  //  设置命名空间
        // 如果不设置 namespaced，那么 mutations、getters 等中的方法可以不加限制直接进行调用，会将这些方法放在全局的命名空间当中。如果方法名相同，会产生冲突
        // 示例：...mapMutations(['updateCount', 'updateText'])
        // 如果设置 那么spaced 为 true，则 mutations、getters 等中的方法需要加入限制才能进行调用，可以在不同模块中使用相同方法名
        // 调用：...mapMutations(['a/updateText'])    使用：this['a/updateText']('123')
        state: {
          text: 1
        },
        mutations: {
          updateText (state, text) {
            console.log('a.state', state)
            state.text = text
          }
        },
        getters: {
          textPlus (state, getters, rootState) {
            //  参数 state 是当前模块下的 state
            //  参数 getters 是所有的 getter 方法
            //  参数 rootState 是全局的 state
            return state.text + rootState.b.text
          }
        },
        actions: {
          add ({ state, commit, rootState }) {
            commit('updateCount', { num: 56789 }, { root: true })
            // commit 会默认在 a模块中查找，不会全局的模块中查找
            // 如果需要在全局中查找，需要加上 {root: true} 参数
          }
        }
      },
      b: {
        namespaced: true,
        state: {
          text: 2
        },
        actions: {
          testAction ({ commit }) {
            commit('a/updateText', 'test text', { root: true })
          }
        }
      }
    }
  })

  // vuex 热更新
  if (module.hot) {
    module.hot.accept([
      './state/state',
      './mutations/mutations',
      './actions/actions',
      './getters/getters'
    ], () => {
      const newState = require('./state/state').default
      const newMutations = require('./mutations/mutations').default
      const newActions = require('./actions/actions').default
      const newGetters = require('./getters/getters').default

      store.hotUpdate({
        state: newState,
        mutations: newMutations,
        getters: newGetters,
        actions: newActions
      })
    })
  }

  return store
}
