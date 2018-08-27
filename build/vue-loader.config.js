module.exports = (isDev) => {
  console.log('vue-loader.config isDev:', isDev);
  return {
    preserveWhitepace: true,  // 清除 .vue文件 中文本换行等情况空格
    extractCSS: !isDev,  // 将对 *.vue 文件内的 <style> 提取,可以根据环境进行判断。
    cssModules: {
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',  // 自定义生成的类名
      camelCase: true // 将css中用 '-' 连接的转化为驼峰
    },
    // hotReload: true  //   热更新，默认会自动判断是否开发环境自动开启关闭，其实关闭后也会刷新页面更新
    // loader: { }  //  自定义loader
    // preLoader: { }  //  在使用 loader 解析之前，先用 preLoader 中的进行解析
    // postLoader: { } //  在使用 loader 解析之后，再用 postLoader 中的进行解析
  }
}