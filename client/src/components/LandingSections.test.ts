import { describe, expect, it } from "vitest";
import { landingConnectors, landingWorkflow } from "./LandingSections";

describe("landing frontend contract", () => {
  it("exposes the evidence-led workflow in the intended order", () => {
    expect(landingWorkflow.map((item) => item.label)).toEqual(["Knowledge", "AI Agent", "Reasoning", "Tools", "Decision"]);
  });

  it("limits public connector language to product capabilities", () => {
    expect(landingConnectors.map((item) => item.label)).toEqual(expect.arrayContaining(["HTTP sources", "Documents", "Memory", "Channels", "Actions", "Audit trail"]));
    expect(landingConnectors.some((item) => /salesforce|hubspot|zendesk|slack/i.test(item.label))).toBe(false);
  });
});
