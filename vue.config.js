const path = require('path') //引入path模块
const resolve = dir => path.join(__dirname, dir) //设置绝对路径
module.exports = {
  // outputDir: process.env.outputDir,
  // publicPath: '/',
  productionSourceMap: false, //取消打包后生成的.map文件
  devServer: {
    public: require('os').networkInterfaces()[Object.keys(require('os').networkInterfaces())[0]][1].address + ':8080',
    disableHostCheck: true,
    hot: true
  },

  chainWebpack: config => {
    // 设置快捷路径，components 表示 'src/components'
    config.resolve.alias
      .set('src', resolve('@'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('network', resolve('src/network'))
  },
  lintOnSave: true,

  devtool: 'source-map'
}
