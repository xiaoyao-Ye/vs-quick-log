<p align="center">
  <!-- <img src="https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/img/cat.png"  height="150" /> -->
    <img src="https://s2.loli.net/2023/10/31/yHlgxL8kUWG7AVo.png"  height="150" />
</p>

<h1 align="center">Quick Create log</h1>

<p align="center">
  <a href="https://github.com/xiaoyao-Ye/vs-quick-log/blob/main/README.en-US.md">English</a> | 中文
</p>

[![version](https://img.shields.io/visual-studio-marketplace/v/ghosteye.vs-quick-log?color=%232ba1f1&logo=visual-studio-code&logoColor=%232ba1f1)](https://marketplace.visualstudio.com/items?itemName=ghosteye.vs-quick-log)
[![installs](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/ghosteye.vs-quick-log?label=Installs)](https://marketplace.visualstudio.com/items?itemName=ghosteye.vs-quick-log)
[![star](https://img.shields.io/github/stars/xiaoyao-Ye/vs-quick-log)](https://github.com/xiaoyao-Ye/vs-quick-log/stargazers)

## Why

调试时经常需要输入 `log` 生成 `console.log('|', |)` 的代码片段然后输入需要打印的内容。这太麻烦了！

在 `vscode` 搜索 `vs-quick-log` 或 `Quick Create log` 安装此扩展，让它直接帮你创建不香吗？

目前已有的同类型扩展大多需要光标移动到声明变量附近, 这里的优势是光标在当前行或者下一行就能自己识别打印, 不需要刻意移动光标或者用鼠标去点一下

## Features

使用时将光标移动至打印目标所在行(或打印目标的下一行)

- `Ctrl + Shift + L` 创建 `console.log`
  - ✨ 可打印 if 语句中的条件判断
  - ✨ 可打印函数参数
  - ✨ 可打印变量
- `Ctrl + Shift + DELETE` 删除该插件创建的 `console.log`

> 支持 `ts` `tsx` `js` `jsx` `vue` `html` 等文件内使用。🍺enjoying!

<!-- ![Guide](https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/initApi/Guide-dark.png) -->
<!-- ![Guide](./public/Guide-dark.png) -->

![Guide.png](https://s2.loli.net/2023/10/31/kMy7bhTZgGOaVYw.png)

## Options

- printPath
  - type: `string`
  - default: `none`
  - enum: ['none', 'filename', 'fullpath']

  ```js
  // none
  console.log("======= foo =======\n", foo); // A.ts
  console.log("======= foo =======\n", foo); // B.ts
  // filename
  console.log("======= foo ( A.ts ) =======\n", foo); // A.ts
  console.log("======= foo ( B.ts ) =======\n", foo); // B.ts
  // fullpath
  console.log("======= foo ( /src/components/A.ts ) =======\n", foo); // A.ts
  console.log("======= foo ( /src/components/B.ts ) =======\n", foo); // B.ts
  ```

## Mac

> mac 使用 cmd

- `Cmd + Shift + L` 创建 `console.log`
- `Cmd + Shift + DELETE` 删除该插件创建的 `console.log`

## More

- 需要打印 `obj.xx.xx` 这种变量, 需要先选中内容然后使用打印命令
- 打印大批量的 `console.log` 可以选中所有需要打印的行然后使用打印命令

## FAQ

1. 当前行同时存在变量和参数只创建了参数的 console.log ？

   > 这是刻意为之, 如果同一行代码同时存在变量和参数大概率该行是一个函数表达式, 这种情况我们一般需要调试的是参数而不是函数

   ```javascript
   const fn = (a, b) => {
     // 这里一般需要打印的是 a, b 而不是 fn
   };
   ```

[欢迎 issue & pr](https://github.com/xiaoyao-Ye/vs-quick-log)

## License

MIT
