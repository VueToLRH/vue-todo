import Vue from 'vue'

const component = {
  name: 'wii-forth',
  data() {
    return {}
  },
  components: {
    WiiScoped: {
      name: 'wii-scoped',
      props: {
        message: String
      },
      render(createElement) {
        // 等价于 <div><slot :text="message"></slot></div>
        return createElement(
          'div', [
            this.$scopedSlots.default({
              text: this.message
            })
          ]
        )
      }
    }
  },
  render: function(createElement) {
    // 等价于
    // <div style="margin-top: 15px;">
    //   <wii-scoped message="测试scopedSlots，我是传入的message">
    //     <span slot-scope="props">{{props.text}}</span>
    //   </wii-scoped>
    // </div>
    return createElement(
      'div', {
        style: {
          marginTop: '15px'
        }
      }, [
        createElement('wii-scoped', {
          props: {
            message: '测试scopedSlots，我是传入的message'
          },
          // 传递scopedSlots，通过props(自定义名称)取值
          scopedSlots: {
            default: function(props) {
              return createElement('span', props.text)
            }
          }
        })
      ]
    )
  }
}

new Vue({
  name: 'app',
  el: '#root',
  components: {
    WiiForth: component
  },
  data() {
    return {}
  },
  template: `
  <div id="app">
    <wii-forth></wii-forth>
  </div>
  `
})
