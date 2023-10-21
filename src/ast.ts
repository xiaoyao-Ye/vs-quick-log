import * as ts from "typescript";
import { isBasicType } from "./utils";
import { Config, Content, VariableType } from "../types";

function isNodesToPrint(node: ts.Node) {
  return (
    ts.isIfStatement(node) ||
    ts.isVariableDeclaration(node) ||
    ts.isParameter(node)
  );
}

function getLineByPosition(ast: ts.SourceFile, position: number) {
  return ast.getLineAndCharacterOfPosition(position).line;
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

function findNodesInRange(ast: ts.SourceFile, config: Config) {
  let { startLine, endLine, offset, language, isMultiple } = config;
  const nodes: ts.Node[] = [];
  // 当鼠标光标起始行大于偏移量的时候, 需要修正起始行在 ast 中的位置
  if (startLine > offset) {
    endLine = endLine - startLine + offset;
    startLine = offset;
  }

  function visit(node: ts.Node) {
    const nodeStartLine = getLineByPosition(ast, node.getStart(ast));
    const nodeEndLine = getLineByPosition(ast, node.getEnd());

    const singleLineRange = nodeStartLine === startLine;
    const multipleLineRange =
      nodeStartLine >= startLine && nodeEndLine <= endLine;
    const isNodeInRange = isMultiple ? multipleLineRange : singleLineRange;

    if (isNodeInRange && isNodesToPrint(node)) {
      nodes.push(node);
    } else if (!isMultiple && isNodeInRange && language === "vue") {
      // 仅vue2中需要:
      if (ts.isCallExpression(node)) {
        node.arguments.forEach((argument) => {
          if (ts.isIdentifier(argument)) {
            nodes.push(argument);
          }
        });
      }
      // TODO: 如果是解构的参数, 会是下面这种类型
      // if (ts.isObjectLiteralExpression(node)) {
      //   node.properties.forEach((property) => {
      //     nodes.push(property);
      //   });
      // }
    }

    ts.forEachChild(node, visit);
  }

  visit(ast);

  return nodes;
}

// 这个函数理论上应该拆成三个函数
function logCollectByAST(ast: ts.SourceFile, nodes: ts.Node[], config: Config) {
  const { startLine, isMultiple, offset } = config;
  const contents: Content[] = [];

  function extractConditions(ast: ts.SourceFile, node: ts.BinaryExpression) {
    let result: string[] = [];

    function handle(nodeExpression: ts.Expression) {
      if (ts.isBinaryExpression(nodeExpression)) {
        const names = extractConditions(ast, nodeExpression);
        result.push(...names);
      } else {
        const name = nodeExpression.getText(ast);
        if (!isBasicType(name)) result.push(name);
      }
    }
    handle(node.left);
    handle(node.right);

    return result;
  }

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

  function handlePrintLine(printLine: number, startLine: number) {
    return startLine >= offset ? printLine + startLine - offset : printLine;
  }

  function handleVariableOrParameter(
    node: ts.VariableDeclaration | ts.ParameterDeclaration,
    printLine: number,
    variableType: VariableType
  ) {
    if (ts.isObjectBindingPattern(node.name)) {
      const names = getDeconstructionName(node.name);
      names.forEach((txt) =>
        contents.push(new Content(txt, printLine, variableType))
      );
    } else {
      const text = node.name.getText(ast);
      contents.push(new Content(text, printLine, variableType));
    }
  }

  function handleIdentifier(node: ts.Identifier, printLine: number) {
    // Identifier 类型可能没有 isObjectBindingPattern 类型的节点
    if (ts.isObjectBindingPattern(node)) {
      const names = getDeconstructionName(node);
      names.forEach((txt) =>
        contents.push(new Content(txt, printLine, "parameter"))
      );
    } else {
      // const text = node.text;
      const text = node.getText(ast);
      contents.push(new Content(text, printLine, "parameter"));
    }
  }

  function handleIfStatement(node: ts.IfStatement, printLine: number) {
    if (ts.isBinaryExpression(node.expression)) {
      const names = extractConditions(ast, node.expression);
      names.forEach((txt) =>
        contents.push(new Content(txt, printLine, "condition"))
      );
    }
    const text = node.expression.getText(ast);
    contents.push(new Content(text, printLine, "condition"));
  }

  for (const node of nodes) {
    const position = ts.isIfStatement(node)
      ? node.getStart(ast)
      : node.getEnd();
    let printLine = getLineByPosition(ast, position);
    printLine = handlePrintLine(printLine, startLine);

    if (ts.isIfStatement(node)) {
      handleIfStatement(node, printLine);
    } else if (ts.isParameter(node)) {
      handleVariableOrParameter(node, printLine, "parameter");
    } else if (ts.isVariableDeclaration(node)) {
      handleVariableOrParameter(node, printLine, "variable");
    } else if (ts.isIdentifier(node)) {
      handleIdentifier(node, printLine);
    }
  }

  const parameters = contents.filter((f) => f.variableType === "parameter");
  if (!isMultiple && parameters.length) return parameters;

  return contents;
}

export { parseTsToAST, findNodesInRange, logCollectByAST, isNodesToPrint };
