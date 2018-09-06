export default {
  updateCount (state, { num, num2 }) {
    console.log('vuex mutation num：', num2)
    state.count = num
  }
}
