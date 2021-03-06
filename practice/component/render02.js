import Vue from 'vue'

const component = {
  name: 'wii-second',
  data() {
    return {
      myProp: '我是data的值, 只是为了证明props不是走这儿'
    }
  },
  props: {

  },
  render: function(createElement) {
    // 等价于
    // <div id="second" class="wii-second blue-color" style="color: green;" @click="clickHandler">
    //     我是第二个组件测试, 点我触发组件内部click和外部定义的@click.native事件。
    //     <div>{{myProp}}</div>
    //     <button @click="buttonClick">触发emit</button>
    // </div>
    return createElement(
      'div', {
        //【class】和`v-bind:class`一样的 API
        // 接收一个字符串、对象或字符串和对象组成的数组
        // class: 'wii-second',
        // class: {
        //     'wii-second': true,
        //     'grey-color': true
        // },
        class: [{
          'wii-second': true
        }, 'blue-color'],

        //【style】和`v-bind:style`一样的 API
        // 接收一个字符串、对象或对象组成的数组
        style: {
          color: 'green'
        },
        //【attrs】正常的 HTML 特性, id、title、align等，不支持class，原因是上面的class优先级最高[仅猜测]
        // 等同于DOM的 Attribute
        attrs: {
          id: 'second',
          title: '测试'
        },
        // 【props】组件 props，如果createElement定义的第一个参数是组件，则生效，此处定义的数据将被传到组件内部
        props: {
          myProp: 'bar'
        },
        // DOM 属性 如 value, innerHTML, innerText等, 是这个DOM元素作为对象, 其附加的内容
        // 等同于DOM的 Property
        // domProps: {
        //   innerHTML: 'baz'
        // },
        // 事件监听器基于 `on`, 用于组件内部的事件监听
        on: {
          click: this.clickHandler
        },
        // 仅对于组件，同props，等同@click.native，用于监听组件内部原生事件，而不是组件内部使用 `vm.$emit` 触发的事件。
        // nativeOn: {
        //   click: this.nativeClickHandler
        // },
        // 如果组件是其他组件的子组件，需为插槽指定名称，见 wii-third 组件
        // slot: 'testslot',
        // 其他特殊顶层属性
        // key: 'myKey',
        // ref: 'myRef'
      }, [
        `我是第二个组件测试, 点我触发组件内部click和外部定义的@click.native事件。`,
        createElement('div', `${this.myProp}`),
        createElement('button', {
          on: {
            click: this.buttonClick
          }
        }, '触发emit')
      ]
    )
  },
  methods: {
    clickHandler() {
      console.log('我点击了第二个组件，这是组件内部触发的事件')
    },
    buttonClick(e) {
      e.stopPropagation() // 阻止事件冒泡 等价于 click.stop
      console.log('我点击了第二个组件的button，将会通过emit触发外部的自定义事件')
      this.$emit('on-click-button', e)
    }
  }
}

new Vue({
  name: 'app',
  el: '#root',
  components: {
    WiiSecond: component
  },
  data() {
    return {
    }
  },
  methods: {
    nativeClick() {
      console.log('这是组件外部click.native触发的事件，第二个组件被点击了')
    },
    clickButton() {
      console.log('这是组件外部触发的【emit】事件，第二个组件被点击了')
    }
  },
  template: `
    <div id="app">
      <wii-second @click.native="nativeClick" @on-click-button="clickButton"></wii-second>
    </div>
  `
})
