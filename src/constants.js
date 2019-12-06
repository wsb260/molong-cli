// 存放用户的所需要的常量
const { version } = require('../package.json')

// 存放模板的位置
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}\\.template`
console.log(downloadDirectory)
module.exports = {
  version,
  downloadDirectory,
}
