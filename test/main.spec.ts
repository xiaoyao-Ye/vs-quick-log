import { it, expect, describe, beforeAll, beforeEach } from "vitest";
import { handleSelectionText } from "../src/main";
import { Config } from "../types";
import { offset } from "../src/config";

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

    expect(contents.length).toEqual(0);
  });

  it("should return true when a valid variable name is selected", () => {
    config.selectText = "name";

    const contents = handleSelectionText(config);

    expect(contents[0].text).toEqual("name");
  });
});

// TODO: ...
// getContents
// handleSelectionText
// createLog
//
