import { describe, expect, it } from "vitest";
import { chunkText } from "./worker";

describe("worker document helpers", () => {
  it("splits normalized document text into bounded chunks", () => {
    const chunks = chunkText("  alpha\u0000beta\n" + "x".repeat(9), 5);
    expect(chunks).toEqual(["alpha", "beta\n", "xxxxx", "xxxx"]);
    expect(chunks.every(chunk => chunk.length <= 5)).toBe(true);
  });

  it("returns no chunks for empty or whitespace-only documents", () => {
    expect(chunkText(" \u0000 \n", 10)).toEqual([]);
  });
});
