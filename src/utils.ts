function isLetter(char: string) {
  const wordRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
  return wordRegex.test(char);
}

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

function handleText(text: string, space: string, isLastLine: boolean) {
  const wrap = isLastLine ? "\r\n" : "";
  const log = `console.log(\`( ${text} )===============>\`, ${text});`;
  return `${wrap}${space}${log}\r\n`;
}

function findConsoleLogLineIndex(text: string) {
  // 如果使用全局匹配会导致每次匹配都会从上一次的位置继续, 导致 regex.test(line) 匹配同一个字符串第13579..是true246810....是false
  const regex = /^(?!\/\/|\/\*)\s*console.log(.*)/;
  const result = text.split("\r\n").map((line, rowIndex) => {
    if (regex.test(line)) return rowIndex;
  });
  const rowIndexList = result.filter((f) => f !== undefined) as number[];
  return rowIndexList;
}

export { isLetter, isBasicType, handleText, findConsoleLogLineIndex };
