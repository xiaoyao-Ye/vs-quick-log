<p align="center">
  <!-- <img src="https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/img/cat.png"  height="150" /> -->
  <img src="https://s2.loli.net/2023/10/31/yHlgxL8kUWG7AVo.png"  height="150" />
</p>

<h1 align="center">Quick Create log</h1>

<p align="center">
  English | <a href="https://github.com/xiaoyao-Ye/vs-quick-log">中文</a>
</p>

[![version](https://img.shields.io/visual-studio-marketplace/v/ghosteye.vs-quick-log?color=%232ba1f1&logo=visual-studio-code&logoColor=%232ba1f1)](https://marketplace.visualstudio.com/items?itemName=ghosteye.vs-quick-log)
[![installs](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/ghosteye.vs-quick-log?label=Installs)](https://marketplace.visualstudio.com/items?itemName=ghosteye.vs-quick-log)
[![star](https://img.shields.io/github/stars/xiaoyao-Ye/vs-quick-log)](https://github.com/xiaoyao-Ye/vs-quick-log/stargazers)

## Why

When debugging, you often need to type `log` to generate a `console.log('|', |)` snippet and then type in what you need to print. This is a pain in the ass!

Install this extension by searching `vscode` for `vs-quick-log` or `Quick Create log`, and let it create it for you directly.

Most of the existing extensions of the same type need to move the cursor near the declared variable, the advantage here is that the cursor in the current line or the next line will recognize the print itself, do not need to intentionally move the cursor or use the mouse to click on it

## Features

To use, move the cursor to the print target line (or to the next line of the print target).

- `Ctrl + Shift + L` Create `console.log`
  - ✨ You can print "conditional judgment in an if statement"
  - ✨ You can print function parameters
  - ✨ You can print variable names
- `Ctrl + Shift + DELETE` Delete the `console.log` created by the plugin.

> Supports use within `ts` `tsx` `js` `jsx` `html` `vue(vue2 & vue3)` files.🍺enjoying!

<!-- ![Guide](https://raw.githubusercontent.com/xiaoyao-ye/blog/main/docs/public/initApi/Guide-dark.png) -->
<!-- ![Guide](./public/Guide-dark.png) -->

![Guide.png](https://s2.loli.net/2024/04/30/NvEnKcDRCSkbiLh.png)

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

> mac Use cmd

- `Cmd + Shift + L` Create `console.log`
- `Cmd + Shift + DELETE` Delete the `console.log` created by the plugin.

## More

- To print variables like `obj.xx.xx`, you need to select the contents and then use the print command.
- To print a large `console.log`, you can select all the lines you want to print and use the print command.

## FAQ

1. The current line with both variables and parameters only creates a `console.log` of the parameters?

   > This is intentional, if there are both variables and parameters in the same line of code there is a high probability that the line is a function expression, in this case we generally need to debug the parameters rather than the function.

   ```javascript
   const fn = (a, b) => {
     // Here it is usually necessary to print a, b instead of fn.
   };
   ```

[Feel free to ask questions or pull requests](https://github.com/xiaoyao-Ye/vs-quick-log)

## License

MIT
