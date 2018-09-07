<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <p>获取state状态 - 箭头函数形式：{{counter}}</p>
    <p>获取state状态 - 传字符串参数：{{countAlias}}</p>
    <p>获取state状态 - 常规函数形式：{{countPlusLocalState}}</p>
    <p>vuex fullName：{{fullName}}</p>
    <p>vuex模块A textA：{{textA}}</p>
    <p>vuex模块A textPlus：{{textPlus}}</p>
    <p>vuex 注入模块C textC：{{textC}}</p>
    <router-link to="/app">app</router-link>
    <router-link to="/login">login</router-link>
    <!-- <Todo></Todo> -->
    <transition name="fade">  <!--路由动画-->
      <router-view></router-view>
    </transition>
    <Footer></Footer>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import Header from './layout/header.vue'
import Footer from './layout/footer.jsx'
import Todo from './views/todo/todo.vue'

export default {
  components: {
    Header, Footer, Todo
  },
  data () {
    return {
      localCount: '1'
    }
  },
  mounted () {
    // this.$store.state.count = 3  //  从外部修改 vuex 中的数据，不推荐

    // 使用 vuex mutation 修改状态
    // 调用 mutation 方式：this.$store.commit
    // let i = 1
    // setInterval(() => {
    //   this.$store.commit('updateCount', i++)  // commit 用于触发 mutation
    //    // 如果需要传递多个参数，需使用对象形式
    //    // this.$store.commit('updateCount', {
    //    //   num: i++,
    //    //   num2: 2
    //    // })
    // }, 1000)
    // 调用 mutation 方式：mapMutations
    // let i = 1
    // setInterval(() => {
    //    this.updateCount({
    //      num: i++,
    //      num2: 2
    //    })
    // }, 1000)
    // 通过 mapMutations 调用 模块a 中的 mutation 方式
    // this['a/updateText']('123')  // mapMutation 数组形式调用
      this.moduleAUpdateText('123')   // mapMutation 对象形式调用

    // 使用 vuex actions 异步修改状态
    // actions 异步修改状态：使用 this.$store.dispatch
    // this.$store.dispatch('updateCountAsync', {
    //   num: 5,
    //   time: 2000
    // })  // dispatch 用于触发 action
    // actions 异步修改状态：使用 mapActions
    // this.updateCountAsync({
    //   num: 5,
    //   time: 2000
    // })
    // this['a/add']()
    // this.testAction()
    // this['b/testAction']()
  },
  methods: {
    ...mapActions(['updateCountAsync', 'a/add', 'b/testAction']),
    // ...mapMutations(['updateCount', 'a/updateText'])
    ...mapMutations({
      updateCount: 'updateCount',  // 或者 updateCount
      moduleAUpdateText: 'a/updateText'
    })
  },
  computed: {
    // 获取 vuex state 状态
    // count () {
    //   return this.$store.state.count  // 获取state状态：使用 $store 全局对象获取
    // },
    // textA () {
    //   return this.$store.state.a.text  // 获取state状态：调用 模块a 中的 text
    // },
    ...mapState({
      // 获取state状态：箭头函数形式
      counter: (state) => state.count,
      textA: state => state.a.text,
      textC: state => state.c.text,
      // 获取state状态：传字符串参数，'count' 等同于 'state => state.count'
      countAlias: 'count',
      // 获取state状态：为了能够使用 `this` 获取局部状态，必须使用常规函数
      countPlusLocalState (state) {
        return state.count + this.localCount
      }
    }),
    // ...mapState(['count']),  // 获取state状态：数组形式

    // 获取 getters（store的计算属性）
    // fullName () {
    //   return this.$store.getters.fullName  // 获取getters：使用全局 $store 对象获取
    // }
    ...mapGetters({  // 获取getters：对象形式
      'fullName': 'fullName',  // 获取getters：store 全局的 getters
      textPlus: 'a/textPlus'   // 获取getters：模块a 中的 getters
    })
    // ...mapGetters(['fullName','a/textPlus']), // 获取getters：数组形式
  }
}
</script>

<style lang="stylus" scoped>
  #app {
    position absolute
    left 0
    right 0
    top 0
    bottom 0
  }
  #cover {
    position absolute
    left 0
    top 0
    right 0
    bottom 0
    background-color #999
    opacity .9
    z-index -1
  }
</style>
