# Change Log

## 0.1.4

- perf: 进一步优化 vue2 中打印效果
- docs: 文档更新

## 0.1.3

- fix: 修复了 clear console 无效的问题
- fix: 修复了 vue2 中打印失效问题
- fix: 修复一些不影响使用的 bug
- perf: 细节方面优化了用户体验

## 0.1.2

- perf: 优化打印 `if 条件语句` 时字符串冲突的问题
- perf: 优化打印 `if 条件语句` 会打印基础数据类型的问题

## 0.1.1

- feat: 支持选中打印 `xx.xx` | `this.xx.xx` 的变量
- feat: 打印新增 `(  )===============>` 标识
- fix: 打印 `if 语句中的条件` 时应该打印数值的问题

## 0.1.0

- feat: 可打印 if 语句中的所有条件
- fix: 多行打印时光标位置错误
- perf: 单行打印时有参数的情况下仅打印参数, 多行打印时将打印所有能打印的

## 0.0.6

- feat: icon
- chore: categories
- chore: Build vsce package

## 0.0.5

- fix: 尝试修复生产环境 clear console 无效的问题

## 0.0.4

- feat: 清除 console.log 使用 `ctrl+shift+delete`
- perf: 多选时打印所有变量和函数参数

## 0.0.3

- feat: 选中内容符合变量名称直接打印
- feat: 打印增加缩进
- feat: 打印完毕设置光标位置
- fix: 修复若干 bug
