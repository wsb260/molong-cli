const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')
// 1.获取项目列表
const fetchRepoList = async () => {
  // const { data } = await axios.get('https://github.com/PanJiaChen/vue-admin-template')
  // const { data } = await axios(
  //   'https://api.github.com/repos/webpack/cli-template',
  // )
  const { data } = await axios.get(
    'https://api.github.com/orgs/vuejs-templates/repos',
  )
  return data
}

// 抓取tab列表，版本号
const fetchTagList = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/vuejs-templates/${repo}/tags`)
  return data
}
// 封装loading效果
const waitFnloading = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start()
  const result = await fn(...args)
  spinner.succeed()
  return result
}


module.exports = async (projectName) => {
  // 1.获取项目模板
  const msg = 'fetching template ...'
  const list = await waitFnloading(fetchRepoList, msg)()
  console.log(list)
  const repos = list.map((item) => item.name)
  // const repos = Array.of(list.name)
  // 在获取之前显示loading ora模块
  // 选择模板 inquirer模块
  const { repo } = await Inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos,
  })
  // 2.获取对应的版本
  console.log(repo)
  const tags = await waitFnloading(fetchTagList, 'fetching tags ...')(repo)
  const tag = tags.map((item) => item.name)
  console.log(tag)
}
