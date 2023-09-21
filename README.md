# vs-log

- `ctrl+shift+L` 创建 console.log
  - 识别光标所在行的变量或函数参数的名称(`同时存在变量和参数只输出参数名称`)用于创建 console.log
  - 光标所在行没有声明变量或者函数参数会识别上一行的变量或者函数参数
  - 选中变量名称后按 `ctrl+shift+L` 直接创建该变量名称的 console.log
  - 选中一段代码后按 `ctrl+shift+L` 查找这段代码中的变量和参数创建 console.log
- `ctrl+shift+delete` 清除当前文件所有非注释的 console.log
