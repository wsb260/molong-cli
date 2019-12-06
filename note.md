### 必备模块
+ commander:参数解析 --help其实就是借助了他
+ inquirer: 交互式命令行工具,有他就可以实现命令行的选择功能
+ download-git-repo: 在git中下载模板
+ chalk: 帮我们在控制台中画出各种各样的颜色
+ metalsmith: 读取所有文件,实现模板渲染
+ consolidate: 统一模板引擎

### 创建全局命令 molong-cli
+ 在根目录下创建bin/www.js文件
+ 写入#! /usr/bin/env node 告诉让让node环境执行
+ 在package.json文件中新增属性"bin":{"molong-cli":"./bin/www.js"}
+ 在窗口中输入 npm link 把命令连接到全局中
+ 这个时候执行molong-cli 就可以打印出结果

### 代码规范工具
+ npm install eslint
+ 初始化eslint配置文件 npx  eslint --init 帮我们执行node_modules/.bin/eslint 生成.eslintrc.js

### 解析用户参数
+ require('commander')
+ 创建一个常量文件 /src/constants.js
+ 暴露package.json中的常量
+ 在main.js中引入,使用program.version(version).parse(process.argv)
+ 这个时候执行 molong-cli --help 就可以看到解析出来的参数
### 创建命令
+ 在main.js中写入 parogram.command('create').alias('c').description('create a project').action(()=>{console.log('create')})
+ parogram后调用了函数就要传入参数不然会报错
+ command() 配置命令名字
+ alias() 命令别名
+ description() 命令对应的描述
+ action() 要执行的动作
+ 可以提取写成对象集合然后循环，如mapActions一样
+ 监听用户的help 事件,本身无法解析example自己配置一个
+ github开发api https://developer.github.com/v3
+ 从github上获取资源
  -https://developer.github.com/v3/repos/
+ 从github上拉取模板项目
  - get:/repos/:owner/:repo
    -'https://api.github.com/repos/wsb260/cli-template'
  - get: /user/repo #如果这个报错就使用上面那个
  - own:github的用户名
  - repo: 你的仓库名称
+ 从github上拉取项目,如果是一个组织,里面有很多模板,那么要使用以下的格式
  - api.github.com/orgs/:own/repos
  - own是你的组织用户名，其他的不变
+ npm install ora 使用loading
  -ora.start()
  -ora.succeed()
+ npm install inquirer 选择模板
  - Inquirer.prompt({options})
  - options.name 获取选择后的结果
  - type
  - message
  - choices 使用那个数据
