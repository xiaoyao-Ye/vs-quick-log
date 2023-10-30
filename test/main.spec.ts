import { it, expect, describe, beforeEach, vi } from "vitest";
import {
  clearLog,
  createLog,
  getContents,
  handleSelectionText,
} from "../src/main";
import { Config } from "../types";
import { offset } from "../src/config";
import { clearCode, code } from "./codes";
import * as vscodeAPI from "../src/vscode";

// 因为无法导入 vscode 这个模块, 不 mock 会报错:
// Error: Failed to load url vscode (resolved id: vscode) in E:/xiaoyao-Ye/vs-quick-log/src/vscode.ts. Does the file exist?
vi.mock("../src/vscode", async () => {
  return {
    getRangeTextFromEditor: () => code,
    getActiveFileInfo: vi.fn(),
    insertText: vi.fn(),
    deleteText: vi.fn(),
    getAllText: vi.fn(),
  };
});

describe("Print the selected variable when a valid variable name is selected", () => {
  let config: Config;

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

  it("should return false when multi-line selection", () => {
    config.isMultiple = true;
    config.selectText = "name";

    const contents = handleSelectionText(config);

    expect(contents.length).toBe(0);
  });

  it("should return true when a valid variable name is selected", () => {
    config.selectText = "name";

    const contents = handleSelectionText(config);

    expect(contents[0].text).toBe("name");
  });
});

describe("should create console.log by active file", () => {
  let config: Config;

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

  it("should return print info when a valid line is selected", () => {
    config.startLine = 1;
    config.endLine = 6;
    config.isMultiple = true;

    const contents = getContents(config);

    expect(contents.length).toBe(3);
  });

  it("should print log when a valid line is selected", () => {
    config.startLine = 3;
    config.endLine = 3;
    vi.spyOn(vscodeAPI, "getActiveFileInfo").mockReturnValue(config);
    vi.spyOn(vscodeAPI, "insertText");

    expect(vscodeAPI.insertText).not.toBeCalled();

    createLog();

    expect(vscodeAPI.insertText).toBeCalled();
  });

  it("should print log when a valid next line is selected", () => {
    config.startLine = 4;
    config.endLine = 4;
    vi.spyOn(vscodeAPI, "getActiveFileInfo").mockReturnValue(config);
    vi.spyOn(vscodeAPI, "insertText");

    expect(vscodeAPI.insertText).not.toBeCalled();

    createLog();

    expect(vscodeAPI.insertText).toBeCalled();
  });
});

describe("should clear console.log", () => {
  it("should find all console.log lines and delete when call clearLog", () => {
    vi.spyOn(vscodeAPI, "getAllText").mockReturnValue(clearCode);
    vi.spyOn(vscodeAPI, "deleteText");

    expect(vscodeAPI.deleteText).not.toBeCalled();

    clearLog();

    expect(vscodeAPI.deleteText).toHaveBeenCalledWith([4, 2, 0]);
  });
});
