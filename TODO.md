# TODO

- [x] 当前行未找到时找上一行的语句
- [x] 缩进
- [x] 完成 clearlog
- [x] 打包发布上线
- [ ] 选中变量打印需要匹配类似(this.xx.xx)这种情况, 也就是说只要选中的内容中间没有空格并且有.的也可以打印(trim 后去掉.再匹配正则即可?更好的应该是排除/r/n, {,},=>, 等情况? 因为选中打印 a && b 或者 fn(1)也是合理的)
- [ ] vue2 中 methods 声明的函数参数打印不了, 是因为 ast 识别类型不是参数?
- [x] 打印 if 里面的所有条件
- [ ] vue3 是 ref 的打印 xx.value?
- [ ] clearLog 发布版本不生效问题
- [x] 打印选中(只选中一个单词的时候)变量或者参数(endLine 还是得通过 ast 找, 挺麻烦的, 控制选中的只有是变量或者参数才打印的话应该会简单点, 就直接拿这个名称去变量和参数里面找)(目前只打印到下一行)
- [ ] 打印选中也需要有缩进
- [ ] 函数闭合状态下应该在函数 body 中打印
- [x] 有参数时不打印变量需要调整, 是单行中有参数时不打印变量而不是所有选中文本中有参数就不打印变量
- [x] 同时选中多行的情况下打印位置错误的问题
- [x] 同时打印多个变量或者参数时光标位置错误
- [x] const fn = (x,y) => {} 的情况下不打印 fn 的 bug
- [x] 同时有参数和变量的情况下只打印参数
- [ ] const { 的情况下会将 { 当做变量的 bug
- [x] 打印完毕光标位置
- [x] 当打印行就是最后一行时, 会导致打印到当前行
- [ ] 光标设置优化不使用 999
- [x] 测试在 vue 文件是否存在异常
- [ ] class 和 import 变量处理
- [ ] 多行打印时, 如果有同名变量会导致打印到第一个地方打印 n 行(一般不会同时打印多行, 所以没必要的话不需要处理)

## feature

一个新的思路:

- 先获取当前行, 根据当前行获取附近 10 行, 将这块区域的文本解析成 ast
- 根据 ast 获取当前行的语句(若无, 则获取上一行语句) (语句指完整的 ts 语法)
- 获取选定语句中的变量(同时获取该语句的结束行)或者参数(同时该参数所在的行一般是 rowIndex 也可能是一个范围就需要获取了)(class 和 import 这种先不处理)
- 在对应位置打印变量或者参数的值

- vs 绑定 command
- 快捷键触发 command 创建 log
- 获取当前选中(默认当前行)文本以及上下 10 行文本解析成 ast 和 all ast
- 根据 ast 查找所有 variable 和 parameter
- 创建单个 log 设置默认值
- 处理变量或者参数的值
  - xx
- 打印所有 log

> 现在有个问题就是类似 class 这种需要完整的 class 才能正确解析, 那我以当前行去+100 获取完整文本
> 然后将完整的文本解析成 ast, 在从完整本文的第 100 行(也就是当前行)的节点开始识别可打印内容
> (其他打印内容也可以这样, 而不用从原始本文找打印内容再从完整 ast 找结束行, 现在可以直接拿到结束行)
> vue 文件可以尝试过滤出只拿 script 解析?
> 缺点可能是内容会比较多

通过` vscode.window.activeTextEditor.document.languageId`获取文件类型, 如果是 vue 需要获取 script 去解析, js 或者 ts 直接解析 (jsx 和 tsx 需要测试看情况, 目前是否支持 jsx 和 tsx 都待测试)

获取 vue 的 script:

```typescript
function getScriptContentAndStartLine(fileContent) {
  // 非贪婪模式
  // const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/;
  // 贪婪模式
  const scriptRegex = /<script\b[^>]*>([\s\S]*)<\/script>/;
  const match = fileContent.match(scriptRegex);

  if (match) {
    const scriptContent = match[1];
    const scriptStartLine = fileContent
      .substr(0, match.index)
      .split("\n").length;
    return { scriptContent, scriptStartLine };
  }

  return null;
}

const result = getScriptContentAndStartLine(code);
console.log(result);
```

转换 TypeScript 代码为 JavaScript 代码:

```js
const result = ts.transpileModule(code, {
  compilerOptions: {
    target: ts.ScriptTarget.ESNext,
    allowJs: true,
  },
});

// 输出 JavaScript 代码
console.log(result.outputText);
```

解析 ast

```js
let acorn = require("acorn");
const parser = require("@typescript-eslint/parser");

// 解析成 ast
const ast = parser.parse(code, {
  // sourceType: 'module',
});

console.log(ast);
console.log(acorn.parse(code, { ecmaVersion: "latest" }));
console.log(acorn.parse(code, { ecmaVersion: "latest", sourceType: "module" }));
```

## ast

```ts
import * as ts from "typescript";

// 解析成 ast
const ast = ts.createSourceFile(
  "dummy.ts",
  // 解析成 ast 的文本
  selectedText,
  // 解析的ts版本
  ts.ScriptTarget.Latest,
  // ast 节点是否包含父节点属性
  false,
  // 解析类型
  3
);

// 循环指定节点将每一个子节点都传入回调函数中, 返回真则停止
ts.forEachChild(node, (son_node) => {});
// 判断是否为变量声明
ts.isVariableDeclaration(node);
// 判断是否为函数声明
ts.isFunctionDeclaration(node);
// 判断是否为参数
ts.isParameter(node);
// 判断是否为对象(解构赋值)
ts.isObjectBindingPattern(node.name);
// 判断是否为语句
ts.isStatement(node);
// 判断是否为变量声明
ts.isIdentifier(element.name); // element.name.text

// 获取节点行数
ast.getLineAndCharacterOfPosition(node.end).line + 1;
// 获取节点名
node.name.getText(ast);
// 获取节点开始位置
node.getStart(ast);
// 获取节点结束位置
node.getEnd();
// 获取节点文本
ast.text;
// 如果是解构赋值, 可以循环获取变量名
node.name.elements;
// 判断...
node.name.text === "foo";
// 当前节点是函数, 并且函数体为空
node.body === undefined || node.body.statements.length === 0;
```

## refactor

- [ ] feature: switch 是否有需要打印的情况
- [ ] feature: 打印是否需要去重
- [x] bug: vs-log 中的 extension.ts 测试, create 单行时变量打印不出, 全选可以. 单行 if 没问题, if+下一行选中时打印异常
- [x] bug: 多行时打印 if 异常
- [x] bug: contents 为空时打印上一行失效
- [x] bug: 打印变量时可能无缩进
- [x] bug: 打印完毕光标位置问题
- [x] bug: 超过 100 行, 鼠标光标指向有问题(也可能是 ts 解析 vue2 的 ast 导致行数有问题, vue 可能解析出 script 标签里的内容单独计算比较好)(作为两个问题去测试)
- [x] bug: vue 中还是有位置错乱问题
- [x] perf: 有 ===> 的 log 才清除
- [x] perf: (vue2 需要获取 script 去打印)(`现在应该可以直接打印了, methods 中的参数解构参数还是打印不了, 有时会把html解析成节点, 导致html中使用的变量打印在template中!`)
- [x] perf: 目前为了打印 vue methods 声明的函数参数, 导致任何标识符都能打印, 需要改进
- [ ] perf: else if 应该打印在 if 上面而不是单个 else if 上面
- [ ] perf: 选中多行时, 如果选中的语句不完整, 会导致无法识别
- [ ] perf: 函数参数多行时打印位置应该在函数体内而不是参数的下一行
- [ ] perf: clearlog 如果有夸多行的 log 应该匹配不上, 会导致失败
- [ ] perf: for of 和 for in 循环的打印应该+缩进
- [ ] perf: 函数闭合状态打印的时候可以展开函数就更好了(展开函数会导致行数增加, 需要处理)
- [ ] 打印时, 有时会 Illegal value for `line`(目前仅 vue 文件中多行时存在问题)
- [x] delete: 调试的时候, 当前 vscode 打开的项目文件是可以删除成功的, 如果把项目外的文件放进来就只能 create 不能 delete, 怀疑是 vscode 的权限问题
- [ ] ...

- tsx 或者 jsx 在函数内部暂时没发现问题, 在 return 的 html 中会异常(应该不影响使用)
- 千行文件还没测试
