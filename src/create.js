const axios = require('axios')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const Inquirer = require('inquirer')
const { promisify } = require("util")

let downloadGitReop = require("download-git-repo")
downloadGitReop = promisify(downloadGitReop)

const { downloadDirectory } = require("./constants")

let ncp = require("ncp")
ncp = promisify(ncp)

const Metalsmith = require('metalsmith') // 遍历文件夹找需不需要渲染
let { render } = require('consolidate').ejs // 统一所有模板引擎
// 把api转换成promise
render = promisify(render)
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
// 远程下载模板仓库
const download = async (repo, tag) => {
  // 仓库路径 组织/用户名 + 仓库名 + 版本号
  let api = `vuejs-templates/${repo}`
  if (tag) {
    api += `#${tag}`
  }
  const dest = `${downloadDirectory}\\${repo}`
  // 参数1：仓库连接，参数2：要存放的地址，参数3：回调函数
  await downloadGitReop(api, dest)
  console.log('下载到：', dest)
  return dest // 下载的最终目录
}

module.exports = async (projectName) => {
  // 1.获取项目模板
  const msg = 'fetching template ...'
  const list = await waitFnloading(fetchRepoList,msg)()
  const repos = list.map((item) => item.name)
  // const repos = Array.of(list.name)
  // 在获取之前显示loading ora模块
  // 选择模板 inquirer模块
  const {
    repo
  } = await Inquirer.prompt({
    name: 'repo', // 获取选择后的结果
    type: 'list',
    message: 'please choise a template to create project',
    choices: repos
  })

  // 2.获取对应的版本
  let tags = await waitFnloading(fetchTagList,'fetching tags ...')(repo)

  if(tags.length === 0){
    tag = ''
  }else{
    tags = tags.map(item => item.name)

    const { tag } = await Inquirer.prompt({
      name: "tag",
      type: "list",
      message: "please choices the Version",
      choices: tags
    })
  }

  console.log(repo, tag)

  // 3.把模板放到一个临时位置
  const result = await waitFnloading(download,'download...')(repo, tag)

  // 4.拿到下载的目录，直接拷贝当前执行的目录下即可 ncp
  // 把template下的文件拷贝到执行命令的目录下
  if(!fs.existsSync(path.join(result,'ask.js'))){
    await ncp(result, path.resolve(projectName))
  }else{
  // 复杂的需要渲染，渲染后再拷贝
  // 把git上的项目下载下来,如果有ask文件就是一个复制的模板,我们需要用户选择,选择后编译模板
  // metalsmith 只要是模板编译都需要这个
  // 1) 让用户填写的信息去渲染模板
    await new Promise((resolve,reject)=>{
      Metalsmith(__dirname)
      .source(result)
      .destination(path.resolve(projectName))
      .use(async (files,metal,done)=>{
        const args = require(path.join(result,'ask.js'))
        const obj = await Inquirer.prompt(args)
        const meta = metal.metadata()
        Object.assign(meta,obj)
        delete files['ask.js']
        done()
      })
      .use(async (files,metal,done)=>{
        let obj = metal.metadata()
        Reflect.ownKeys(files).forEach(file=>{
          if(file.includes('js')||file.includes('json')){
            let content = files[file].contents.toString()
            if(content.includes('<%')){
              render(content,obj)
              files[file].contents = Buffer.from(content)
            }
          }
        })
        done()
      })
      .build((err)=>{
        if(err){
          reject()
        }else{
          resolve()
        }
      })
    })
  }
}
