# Change Log

## 1.0.3

- fix: if 语句只有一个变量时打印失败

## 1.0.2

- perf: 不再打印 if 语句冗余部分内容
- docs: 更新文档

## 1.0.1

- feat: 可以使用命令直接打印vue2的 `this.xx` 不在需要选中才能打印.
- perf: 修改打印横线的长度

## 1.0.0

- feat: 移除 printFilename 配置项, 相关功能移动至 printPath
- feat: 允许打印中括号语法变量
- perf: 使用删除命令时, 被格式化换行的 console 也能正常删除
- style: 调整了打印内容, 现在查看打印内容更直观

## 0.2.0

- feat: 新增扩展配置项, 启用将会打印当前文件名称

## 0.1.8

- docs: 修复文档描述错误

## 0.1.7

- docs: 修复图片无法加载的问题

## 0.1.6

- docs: 默认展示中文文档

## 0.1.5

- docs: 新增英文文档

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
