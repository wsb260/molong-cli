const program = require('commander')
const { version } = require('./constants')

const mapActions = {
  create: {
    alias: 'c',
    description: 'create a project',
    examples: [
      'molong-cli create <project-name>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'molong-cli config set <k><v>',
      'molong-cli config get <k>',
    ],
  },
  '*': { // 都没有匹配到走最后
    alias: '',
    description: 'command not found',
    examples: [],
  },
}

// 和Object.keys()功能一样，循环所有的key
Reflect.ownKeys(mapActions).forEach((action) => {
  program
    .command(action) // 配置命令名字
    .alias(mapActions[action].alias) // 命令别名
    .description(mapActions[action].description) // 命令对应的描述
    .action(() => {
      if (action === '*') {
        console.log(mapActions[action].description)
      } else {
        console.log(action)

      }
    })
})
// 监听用户的help 事件
program.on('--help', () => {
  console.log('\nExample:')
  Reflect.ownKeys(mapActions).forEach((action) => {
    mapActions[action].examples.forEach((example) => {
      console.log(` ${example}`)
    })
  })
})
program.version(version).parse(process.argv)
