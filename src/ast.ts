import * as ts from "typescript";
import { isBasicType } from "./utils";

type VariableType = "parameter" | "variable" | "condition" | "other";
export class Content {
  variableType: VariableType;
  text: string = "";
  endLine: number = 0;
  constructor(text: string, endLine: number, variableType: VariableType) {
    this.text = text;
    this.endLine = endLine;
    this.variableType = variableType;
  }
}

function parseTsToAST(text: string) {
  const ast = ts.createSourceFile(
    "dummy.ts",
    text,
    ts.ScriptTarget.Latest,
    false
    // 3
  );
  return ast;
}

function findNodesInRange(
  ast: ts.SourceFile,
  startLine: number,
  endLine: number,
  offset: number,
  language: string
) {
  const nodes: ts.Node[] = [];
  const isMultiline = startLine !== endLine;
  /** offset 是 100 对于ast来说当前start最大是100, 如果start大于100，endline也需要重新计算, 小于等于则不需要 */
  const largerThanOffset = startLine > offset;
  if (largerThanOffset) {
    endLine = endLine - startLine + offset;
    startLine = offset;
  }

  function visit(node: ts.Node) {
    const nodeStartLine = ast.getLineAndCharacterOfPosition(
      node.getStart(ast)
    ).line;
    const nodeEndLine = ast.getLineAndCharacterOfPosition(node.getEnd()).line;

    if (!isMultiline) {
      if (nodeStartLine === startLine) {
        const isIfStatement = ts.isIfStatement(node);
        const isVariable = ts.isVariableDeclaration(node);
        const isParameter = ts.isParameter(node);
        if (isIfStatement || isVariable || isParameter) {
          nodes.push(node);
        }
        // 仅vue2中需要:
        if (language === "vue") {
          if (ts.isCallExpression(node)) {
            node.arguments.forEach((argument) => {
              if (ts.isIdentifier(argument)) {
                nodes.push(argument);
              }
            });
          }
          // 如果是解构的参数, 会是下面这种类型
          // if (ts.isObjectLiteralExpression(node)) {
          //   node.properties.forEach((property) => {
          //     nodes.push(property);
          //   });
          // }
        }
      }
    } else {
      const isNodeInRange =
        nodeStartLine >= startLine && nodeEndLine <= endLine;
      if (isNodeInRange) {
        const isIfStatement = ts.isIfStatement(node);
        const isVariable = ts.isVariableDeclaration(node);
        const isParameter = ts.isParameter(node);
        if (isIfStatement || isVariable || isParameter) {
          nodes.push(node);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(ast);

  return nodes;
}

// 这个函数理论上应该拆成三个函数
function collectLogs(
  ast: ts.SourceFile,
  nodes: ts.Node[],
  startLine: number,
  isMultiple: boolean,
  offset: number
) {
  const contents: Content[] = [];

  function findNode(node: ts.Node) {
    if (ts.isIfStatement(node)) {
      const text = node.expression.getText(ast);
      let printLine = ast.getLineAndCharacterOfPosition(
        node.getStart(ast)
      ).line;
      printLine =
        startLine >= offset ? printLine + startLine - offset : printLine;

      if (ts.isBinaryExpression(node.expression)) {
        const names = extractConditions(ast, node.expression);
        names.forEach((txt) =>
          contents.push(new Content(txt, printLine, "condition"))
        );
      }

      const log = new Content(text, printLine, "condition");
      contents.push(log);
    }

    if (ts.isParameter(node)) {
      const text = node.name.getText(ast);
      let printLine = ast.getLineAndCharacterOfPosition(node.end).line;
      printLine =
        startLine >= offset ? printLine + startLine - offset : printLine;

      if (ts.isObjectBindingPattern(node.name)) {
        const names = getDeconstructionName(node.name);
        names.forEach((txt) =>
          contents.push(new Content(txt, printLine, "parameter"))
        );
      } else {
        const log = new Content(text, printLine, "parameter");
        contents.push(log);
      }
    }

    if (ts.isVariableDeclaration(node)) {
      const text = node.name.getText(ast);
      let printLine = ast.getLineAndCharacterOfPosition(node.end).line;
      printLine =
        startLine >= offset ? printLine + startLine - offset : printLine;

      if (ts.isObjectBindingPattern(node.name)) {
        const names = getDeconstructionName(node.name);
        names.forEach((txt) =>
          contents.push(new Content(txt, printLine, "variable"))
        );
      } else {
        const log = new Content(text, printLine, "variable");
        contents.push(log);
      }
    }

    if (ts.isIdentifier(node)) {
      const text = node.text;
      let printLine = ast.getLineAndCharacterOfPosition(node.end).line;
      printLine =
        startLine >= offset ? printLine + startLine - offset : printLine;
      if (ts.isObjectBindingPattern(node)) {
        const names = getDeconstructionName(node);
        names.forEach((txt) =>
          contents.push(new Content(txt, printLine, "variable"))
        );
      } else {
        const log = new Content(text, printLine, "parameter");
        contents.push(log);
      }
    }

    // ts.forEachChild(node, findNode);
  }

  nodes.forEach(findNode);

  const parameters = contents.filter((f) => f.variableType === "parameter");
  if (!isMultiple && parameters.length) return parameters;

  return contents;
}

// 递归获取解构变量名
function getDeconstructionName(node: ts.ObjectBindingPattern): string[] {
  let names: string[] = [];
  node.elements.forEach((element) => {
    if (ts.isIdentifier(element.name)) {
      names.push(element.name.text);
    } else if (ts.isObjectBindingPattern(element.name)) {
      names.push(...getDeconstructionName(element.name));
    }
  });
  return names;
}

function extractConditions(ast: ts.SourceFile, node: ts.BinaryExpression) {
  let result: string[] = [];
  if (ts.isBinaryExpression(node.left)) {
    const names = extractConditions(ast, node.left);
    result.push(...names);
  } else {
    const name = node.left.getText(ast);
    if (!isBasicType(name)) result.push(name);
  }

  if (ts.isBinaryExpression(node.right)) {
    const names = extractConditions(ast, node.right);
    result.push(...names);
  } else {
    const name = node.right.getText(ast);
    if (!isBasicType(name)) result.push(name);
  }

  return result;
}

export { parseTsToAST, findNodesInRange, collectLogs };
