<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <p>vuex count：{{counter}}</p>
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
  mounted () {
    // console.log(this.$store)
    // console.log(this.$store.commit)
    // this.$store.state.count = 3  //  从外部修改 vuex 中的数据
    // let i = 1
    // setInterval(() => {
    //   this.$store.commit('updateCount', i++)  // commit 用于触发 mutation
    //    // 如果需要传递多个参数，需使用对象形式
    //    // this.$store.commit('updateCount', {
    //    //   num: i++,
    //    //   num2: 2
    //    // })
    // }, 1000)
    // let i = 1
    // setInterval(() => {
    //    this.updateCount({
    //      num: i++,
    //      num2: 2
    //    })
    // }, 1000)
    console.log('this.$store:', this.$store)
    // this.updateCountAsync({
    //   num: 5,
    //   time: 2000
    // })

    // this['a/updateText']('123')
    // this['a/add']()
    // this.testAction()
    this['b/testAction']()


    // this.
    // this.$store.dispatch('updateCountAsync', {
    //   num: 5,
    //   time: 2000
    // })  // dispatch 用于触发 action
  },
  methods: {
    ...mapActions(['updateCountAsync', 'a/add', 'b/testAction']),
    ...mapMutations(['updateCount', 'a/updateText']),
  },
  computed: {
    ...mapState({
      counter: (state) => state.count,
      textA: state => state.a.text,
      textC: state => state.c.text
    }),

    // textA () {
    //   return this.$store.state.a.text  //  调用模块 a 中的 text
    // },
    // ...mapState(['count']),
    // ...mapState({
    //   counter: 'count'
    //   // counter: (state) => state.count
    // })
    // count () {
    //   return this.$store.state.count
    // },
    // ...mapGetters(['fullName','a/textPlus']),
    ...mapGetters({
      'fullName': 'fullName',
      textPlus: 'a/textPlus'
    })
    // fullName () {
    //   return this.$store.getters.fullName
    // }
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
