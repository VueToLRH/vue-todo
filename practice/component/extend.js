import Vue from 'vue'

// const compoent = {
//   props: {
//     active: Boolean,
//     propOne: String
//   },
//   template: `
//     <div>
//       <input type="text" v-model="text">
//       <span @click="handleChange">{{propOne}}</span>
//       <p>{{comptest}}</p>
//       <span v-show="active">see me if active</span>
//     </div>
//   `,
//   data () {
//     return {
//       text: 0
//     }
//   },
//   computed: {
//     comptest () {
//       console.log('继承之前：计算属性 compoent computed')
//       return this.propOne + 'ceshi'
//     }
//   },
//   beforeCreate () {
//     console.log('继承之前：生命周期-实例初始化 compoent beforeCreate')
//   },
//   created() {
//     console.log('继承之前：生命周期-实例创建完成 compoent created')
//   },
//   mounted () {
//     console.log('继承之前：生命周期-实例挂载完成 mounted')
//   },
//   methods: {
//     handleChange () {
//       this.$emit('change')
//     }
//   }
// }

// const CompVue = Vue.extend(compoent)

// new CompVue({
//   el: '#root',
//   propsData: {
//     propOne: '123'
//   },
//   data: {
//     text: '123'
//   },
//   computed: {
//     comptest () {
//       console.log('继承之后：计算属性 CompVue computed')
//       return this.propOne + 'ceshi11111'
//     }
//   },
//   beforeCreate () {
//     console.log('继承之后：生命周期-实例初始化 CompVue beforeCreate')
//   },
//   created() {
//     console.log('继承之后：生命周期-实例创建完成 CompVue created')
//   },
//   mounted () {
//     console.log('继承之后：生命周期-实例挂载完成 CompVue mounted')
//   }
// })

// const componet2 = {
//   extends: compoent,
//   data () {
//     return {
//       text: 1
//     }
//   },
//   mounted () {
//     console.log(this.$parent.$options.name)
//   }
// }

// new Vue({
//   el: '#root',
//   components: {
//     Comp: componet2
//   },
//   template: `
//     <div>
//       <comp></comp>
//     </div>
//   `
// })














const compoent = {
  props: {
    active: Boolean,
    propOne: String
  },
  template: `
    <div>
      <input type="text" v-model="text">
      <span @click="handleChange">{{propOne}}</span>
      <span v-show="active">see me if active</span>
    </div>
  `,
  data () {
    return {
      text: 0
    }
  },
  mounted () {
    console.log('comp mounted')
  },
  methods: {
    handleChange () {
      this.$emit('change')
    }
  }
}

const parent = new Vue({
  name: 'parent'
})

const componet2 = {
  extends: compoent,
  data () {
    return {
      text: 1
    }
  },
  mounted () {
    console.log(this.$parent.$options.name)
  }
}

new Vue({
  parent: parent,
  name: 'Root',
  el: '#root',
  mounted () {
    console.log(this.$parent.$options.name)
  },
  components: {
    Comp: componet2
  },
  data: {
    text: 23333
  },
  template: `
    <div>
      <span>{{text}}</span>
      <comp></comp>
    </div>
  `
})

