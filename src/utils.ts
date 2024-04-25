function isNumeric(text: string): boolean {
  const regex = /^[+-]?\d+(\.\d+)?$/;
  return regex.test(text);
}

const isString = (str: string) => {
  return /^["'].*["']$/.test(str);
};

const isBoolean = (str: string) => {
  return str === "true" || str === "false";
};

const isBasicType = (str: string) => {
  return isNumeric(str) || isString(str) || isBoolean(str);
};

function handleText(
  text: string,
  space: string,
  isLastLine: boolean,
  fileName?: string
) {
  const wrap = isLastLine ? "\r\n" : "";
  const info = fileName ? `${fileName}: ${text}` : text;
  const log = `console.log(\`( ${info} )===============>\`, ${text});`;
  return `${wrap}${space}${log}\r\n`;
}

function findConsoleLogLineIndex(text: string) {
  // 如果使用全局匹配会导致每次匹配都会从上一次的位置继续, 导致 regex.test(line) 匹配同一个字符串第13579..是true246810....是false
  // const regex = /^(?!\/\/|\/\*)\s*console.log(.*)/;
  const regex = /^(?!\/\/|\/\*)\s*console.log(\(.*\)\=+>.*)/;
  const rowIndexList: number[] = [];
  // text.split("\r\n").forEach((line, rowIndex) => {
  text.split("\n").forEach((line, rowIndex) => {
    if (regex.test(line)) rowIndexList.push(rowIndex);
  });
  return rowIndexList;
}

function isVariable(char: string) {
  const wordRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return wordRegex.test(char);
}

function isVariableNameValid(text: string = "") {
  if (!text) return false;
  const nestedVariable = text.split(".").every((s) => isVariable(s));
  return isVariable(text) || nestedVariable;
}

function getScriptContentAndStartLine(fileContent: string) {
  // 非贪婪模式
  // const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/;
  // 贪婪模式
  const scriptRegex = /<script\b[^>]*>([\s\S]*)<\/script>/;
  const match = fileContent.match(scriptRegex);

  if (match) {
    const scriptContent = match[1];
    const scriptStartLine =
      fileContent.substr(0, match.index).split("\n").length - 1;
    return { scriptContent, scriptStartLine };
  }

  return { scriptContent: "", scriptStartLine: 0 };
}

export {
  findConsoleLogLineIndex,
  getScriptContentAndStartLine,
  handleText,
  isBasicType,
  isVariableNameValid,
};
