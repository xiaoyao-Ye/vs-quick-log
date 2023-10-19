import { it, expect, describe } from "vitest";
// import { QuickLog } from "../src/main";
// import * as vs from "vscode";

const code = `
var a;
let b: string;
const c = 1;
const d = {
  a: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx a",
  b: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx b",
};
const e = [
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx e",
  "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx e",
];
const f: string = "";
const { foo, bar } = { foo: 1, bar: 2 };
const { g, ...fb } = { g: 1, foo: 1, bar: 2 };
const { foo: foo1, bar: bar1 } = { foo: 1, bar: 2 };
const { x, y }: { x?: string; y?: number } = {};
const fn = (a: string, b: number) => {

};
`;

describe("create log", () => {
  it("should print selected", () => {
    // const quickLog = new QuickLog();
    // quickLog.startLine = 1;
    // quickLog.endLine = 1;
    // quickLog.createLog();
    // expect(quickLog.isMultiple).toEqual(false);
  });
});

describe("clear log", () => {
  it("exported", () => {
    expect(1).toEqual(1);
  });
});
