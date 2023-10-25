<p align="center">
	<image src="https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/img/cat.png"  height="150" />
</p>

<h1 align="center">
Quick Create log
</h1>

## Why

调试时经常需要需要输入 `log` 生成 `console.log('|', |)` 的代码片段然后输入需要打印的内容。这太麻烦了！

在 `vscode` 搜索 `vs-quick-log` 或 `Quick Create log` 安装此扩展，让它直接帮你创建不香吗？

## Features

- `Ctrl + Shift + L` 创建 `console.log`
  - ✨ 打印 if 语句中的条件判断
  - ✨ 打印函数参数
  - ✨ 打印变量
- `Ctrl + Shift + DELETE` 删除该插件创建的 `console.log`

> 支持 `ts` `js` `tsx` `jsx` `vue` `html` 等文件类型。使用时将光标移动至目标所在行(或在目标的下一行)

![Guide](https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/initApi/Guide-dark.png)

## Mac

> mac 使用 cmd

- `Cmd + Shift + L` 创建 `console.log`
- `Cmd + Shift + L` 删除该插件创建的 `console.log`

## More

- 需要打印 `this.xx.xx` `obj.xx.xx` 这种非声明变量需要先选中内容然后使用打印命令
- 需要打印大批量的 `console.log` 可以选中所有需要打印的行然后使用打印命令

## FAQ

1. 当前行同时存在变量和参数只创建了参数的 console.log ？

   > 这是刻意为之, 如果同一行代码同时存在变量和参数大概率该行是一个函数表达式, 这种情况我们一般需要调试的是参数而不是函数

   ```javascript
   const fn = (a, b) => {
     // 这里一般需要打印的是 a, b 而不是 fn
   };
   ```

[GitHub 欢迎 issue & pr](https://github.com/xiaoyao-Ye/vs-quick-log)

## License

MIT
