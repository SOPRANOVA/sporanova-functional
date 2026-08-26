import { describe, expect, it } from "vitest";
import { chunkText, normalizedRecords } from "./worker";

describe("worker document helpers", () => {
  it("splits normalized document text into bounded chunks", () => {
    const chunks = chunkText("  alpha\u0000beta\n" + "x".repeat(9), 5);
    expect(chunks).toEqual(["alpha", "beta\n", "xxxxx", "xxxx"]);
    expect(chunks.every(chunk => chunk.length <= 5)).toBe(true);
  });

  it("returns no chunks for empty or whitespace-only documents", () => {
    expect(chunkText(" \u0000 \n", 10)).toEqual([]);
  });

  it("normalizes API arrays and scalar records for idempotent sync", () => {
    const records = normalizedRecords({ data: [{ id: 42, name: "North" }, { externalId: "customer-7", name: "Acme" }] });
    expect(records).toHaveLength(2);
    expect(records[0]).toMatchObject({ externalId: "42", payload: { id: 42, name: "North" } });
    expect(records[1]).toMatchObject({ externalId: "customer-7", payload: { externalId: "customer-7", name: "Acme" } });
    expect(records[0].searchableText).toContain("North");
  });

  it("caps normalized records to the worker safety limit", () => {
    const records = normalizedRecords(Array.from({ length: 1005 }, (_, id) => ({ id })));
    expect(records).toHaveLength(1000);
  });
});
