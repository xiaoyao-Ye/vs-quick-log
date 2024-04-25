import ts from "typescript";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  findNodesInRange,
  isNodesToPrint,
  logCollectByAST,
  parseTsToAST,
} from "../src/ast";
import { offset } from "../src/config";
import { Config } from "../types";
import { code, vueCode } from "./codes";

describe("Should find in-range nodes by ast", () => {
  let ast: ts.SourceFile;
  let config: Config;

  beforeAll(() => {
    ast = parseTsToAST(code);
  });

  beforeEach(() => {
    config = {
      startLine: 0,
      endLine: 0,
      offset,
      language: "typescript",
      isMultiple: false,
      selectText: "",
    };
  });

  it("Should return variable or parameter or IfStatement nodes when print", () => {
    config.startLine = 0;
    config.endLine = 54;
    config.isMultiple = true;

    const nodes = findNodesInRange(ast, config);
    const isVariableNode = nodes.every((node) => isNodesToPrint(node));

    expect(isVariableNode).toBe(true);
  });

  it("Should return variable nodes when single-line print variable declaration", () => {
    config.startLine = 0;
    config.endLine = 0;

    const nodes = findNodesInRange(ast, config);

    expect(nodes.length).toBe(1);
  });

  it("Should return variable nodes when multi-line print variable declaration", () => {
    config.startLine = 3;
    config.endLine = 11;
    config.isMultiple = true;

    const nodes = findNodesInRange(ast, config);

    expect(nodes.length).toBe(3);
  });

  it("Should return IfStatement nodes when print IfStatement", () => {
    config.startLine = 47;
    config.endLine = 47;

    const nodes = findNodesInRange(ast, config);

    expect(nodes.length).toBe(1);
  });

  it("Should return parameter nodes when print function", () => {
    config.startLine = 21;
    config.endLine = 21;

    const nodes = findNodesInRange(ast, config);

    expect(nodes.length).toBe(4);
  });

  it("Should return identifier nodes when print vue methods", () => {
    const ast = parseTsToAST(vueCode);
    config.startLine = 10;
    config.endLine = 10;
    config.language = "vue";

    const nodes = findNodesInRange(ast, config);

    expect(nodes.length).toBe(1);
  });
});

describe("collect print info by nodes", () => {
  let ast: ts.SourceFile;
  let config: Config;
  let nodes: ts.Node[];

  beforeAll(() => {
    ast = parseTsToAST(code);
  });

  beforeEach(() => {
    config = {
      startLine: 0,
      endLine: 0,
      offset,
      language: "typescript",
      isMultiple: false,
      selectText: "",
    };
  });

  it("should return variable info when print variable", () => {
    config.startLine = 0;
    config.endLine = 0;
    nodes = findNodesInRange(ast, config);

    const contents = logCollectByAST(ast, nodes, config);

    expect(contents[0].text).toBe("a");
    expect(contents[0].endLine).toBe(0);
    expect(contents[0].variableType).toBe("variable");
  });

  it("should return statement endLine when print complex types variable", () => {
    config.startLine = 3;
    config.endLine = 3;
    nodes = findNodesInRange(ast, config);

    const contents = logCollectByAST(ast, nodes, config);

    expect(contents[0].text).toBe("d");
    expect(contents[0].endLine).toBe(6);
  });

  it("should return deconstruction name when print variable", () => {
    config.startLine = 11;
    config.endLine = 11;
    nodes = findNodesInRange(ast, config);

    const contents = logCollectByAST(ast, nodes, config);

    expect(contents[0].text).toBe("foo");
    expect(contents[1].text).toBe("z");
    expect(contents[2].text).toBe("args");
  });

  it("should return parameter when print function", () => {
    config.startLine = 21;
    config.endLine = 21;
    nodes = findNodesInRange(ast, config);

    const contents = logCollectByAST(ast, nodes, config);

    expect(contents[0].text).toBe("x");
    expect(contents[1].text).toBe("yy");
    expect(contents[2].text).toBe("z");
    expect(contents[3].text).toBe("args");
  });

  it("should return condition name when print IfStatement", () => {
    config.startLine = 51;
    config.endLine = 51;
    nodes = findNodesInRange(ast, config);

    const contents = logCollectByAST(ast, nodes, config);

    expect(contents[0].text).toBe(`this.name`);
    expect(contents[1].text).toBe(`fn("xx")`);
    expect(contents[2].text).toBe(`!userId`);
    expect(contents[3].text).toBe(
      `this.name === "核销码" && fn("xx") || !userId`
    );
  });
});
