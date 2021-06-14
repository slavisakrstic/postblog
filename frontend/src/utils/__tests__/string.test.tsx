import { truncateString } from "../string";

describe("truncateString", () => {
  it("should not truncate string", () => {
    const result = truncateString("String not to be trancate!");
    expect(result).toEqual("String not to be trancate!");
  });

  it("should truncate string", () => {
    let str = "";
    for (let i = 0; i < 60; i++) {
      str += "QWERTYUIOP";
    }
    const result = truncateString(str);
    expect(result).toContain("...");
  });
});