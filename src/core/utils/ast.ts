import * as ts from "typescript";

function createAST(text: string) {
  const ast = ts.createSourceFile(
    "dummy.ts",
    text,
    ts.ScriptTarget.Latest,
    false
    // 3
  );

  return ast;
}

export interface Log {
  variableType: "parameter" | "variable";
  name: string | string[];
  endLine: number;
}

function collectLogs(
  ast: ts.SourceFile,
  astAll: ts.SourceFile,
  rowIndex: number,
  isMultiple: boolean
) {
  const variables: Log[] = [];
  const parameters: Log[] = [];

  function traverseNode(node: ts.Node) {
    if (ts.isVariableDeclaration(node) || ts.isParameter(node)) {
      const log: Log = {
        variableType: "parameter",
        name: "",
        endLine: rowIndex,
      };
      log.name = node.name.getText(ast);
      
      if (ts.isVariableDeclaration(node)) {
        const endLine = findEndLine(astAll, log.name);
        if (endLine) {
          // 因为astAll是rowIndex行的上下10行, 如果rowIndex大于10, 则astAll获取的行不是从0开始的, 所以需要根据行号去计算
          log.endLine = rowIndex >= 10 ? endLine + rowIndex - 10 : endLine;
        }
        log.variableType = "variable";
        variables.push(log);
      }

      if (ts.isParameter(node)) {
        const endLine = ast.getLineAndCharacterOfPosition(node.getEnd()).line;
        log.endLine = endLine + rowIndex;
        parameters.push(log);
      }

      // 如果是解构
      if (ts.isObjectBindingPattern(node.name)) {
        const names = getDeconstructionName(node.name);
        if (names.length) log.name = names;
      }
    }

    ts.forEachChild(node, traverseNode);
  }

  traverseNode(ast);
  // 有参数的情况下, 只保留参数
  return isMultiple ? [...variables, ...parameters] : parameters.length ? parameters : variables;
  // return parameters.length ? parameters : variables;
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

// 获取当前节点所在的语句的结束行
function findEndLine(ast: ts.SourceFile, name: string) {
  let endLine;
  const targetNode = findNodeByName(ast, name);
  if (targetNode) {
    endLine = ast.getLineAndCharacterOfPosition(targetNode.getEnd()).line;
  }
  return endLine;
}

function findNodeByName(ast: ts.SourceFile, name: string) {
  function visit(node: ts.Node): ts.Node | undefined {
    if (ts.isVariableDeclaration(node) || ts.isParameter(node)) {
      if (node.name.getText(ast) === name) {
        return node;
      }
    }
    return ts.forEachChild(node, visit);
  }
  return visit(ast);
}

export { createAST, collectLogs };
