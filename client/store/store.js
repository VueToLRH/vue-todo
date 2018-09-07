import Vuex from 'vuex'

import defaultState from './state/state'
import mutations from './mutations/mutations'
import getters from './getters/getters'
import actions from './actions/actions'

const isDev = process.env.NODE_ENV === 'development'

export default () => {
  const store = new Vuex.Store({
    strict: isDev,
    // strict: true  开启严格模式，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。
    // 其实可以直接现在外部修改，但是不推荐。 如：this.$store.state.count = 3
    // **不要在发布环境下启用严格模式！**
    // >>> 严格模式会深度监测状态树来检测不合规的状态变更——确保在发布环境下关闭严格模式，以避免性能损失。
    // >>> 可以使用 process.env.NODE_ENV 对环境进行判断

    state: defaultState,
    // 用来存放组件之间共享的数据
    // 单一状态树，因为用一个对象包含了全部的应用层级状态。在Vue组件中如果想要获取Vuex的状态，都需要从state中获取。
    // 最简单的方法就是在计算属性中返回某个状态：return this.$store.state.count

    getters,
    // 可以看作在获取数据之前进行的一种再编辑,相当于对数据的一个过滤和加工。
    // 可以把它看作store.js的计算属性。
    // 像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

    mutations,
    // 修改状态，更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。
    // mutation不能直接调用，而要通过相应的 type 调用相应的 store.commit 方法：this.$store.commit('updataState')
    // 在 mutations 中不能写异步代码，必须是同步函数
    // mutations 中的方法只接受两个参数，第一个是 state，第二个是一个对象:
    // >>> 两个参数: updateCount (state, num)
    // >>> 两个参数以上: 需要传递对象 updateCount (state, obj)，也可以通过解构的方式传入： updateCount(state, { num1, num2 })
    // 调用：this.$store.commit('updateCount', { num1, num2 })

    actions,
    // Action 类似于 mutation，不同在于：
    // >>> Action 提交 mutation 来修改状态，而不是直接变更状态。
    // >>> Action 可以包含任意异步操作。
    // 调用：this.$store.dispatch('updateStore')

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
        namespaced: true, //  设置命名空间
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
          textPlus (state, getters, rootState, rootGetters) {
            //  参数 state 是当前模块下的 state
            //  参数 getters 是所有的 getter 方法
            //  参数 rootState 是全局的 state
            return state.text + rootState.b.text + getters.afull
          },
          afull (state) {
            return state.text
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
        },
        getters: {
          bfull (state) {
            return state.text
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
