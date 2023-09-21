# TODO

- [x] 当前行未找到时找上一行的语句
- [x] 缩进
- [x] 完成 clearlog
- [x] 打包发布上线
- [ ] clearLog 发布版本不生效问题
- [x] 打印选中(只选中一个单词的时候)变量或者参数(endLine 还是得通过 ast 找, 挺麻烦的, 控制选中的只有是变量或者参数才打印的话应该会简单点, 就直接拿这个名称去变量和参数里面找)(目前只打印到下一行)
- [ ] 打印选中也需要有缩进
- [ ] 函数闭合状态下应该在函数 body 中打印
- [ ] 有参数时不打印变量需要调整, 是单行中有参数时不打印变量而不是所有选中文本中有参数就不打印变量
- [x] 同时选中多行的情况下打印位置错误的问题
- [ ] 同时打印多个变量或者参数时光标位置错误
- [x] const fn = (x,y) => {} 的情况下不打印 fn 的 bug
- [x] 同时有参数和变量的情况下只打印参数
- [ ] const { 的情况下会将 { 当做变量的 bug
- [x] 打印完毕光标位置
- [x] 当打印行就是最后一行时, 会导致打印到当前行
- [ ] 光标设置优化不使用999
- [x] 测试在 vue 文件是否存在异常
- [ ] class 和 import 变量处理

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
