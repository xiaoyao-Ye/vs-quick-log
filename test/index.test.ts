import { describe, expect, it } from "vitest";
import { handleSelectionText } from "../src/main";

// 这里应该是要 spyOn insertText 才可以

describe("Print the selected variable when a valid variable name is selected", () => {
  it("should return false when multi-line selection", () => {
    const isMultiple = true;

    const res = handleSelectionText(isMultiple, "name");

    expect(res).toEqual(false);
  });

  it("should return true when a valid variable name is selected", () => {
    const isMultiple = false;

    const res = handleSelectionText(isMultiple, "name");

    expect(res).toEqual(true);
  });
});
