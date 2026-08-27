import { describe, expect, it } from "vitest";
import { agentWorkspaceTabs, getAgentWorkspaceCopy } from "./AgentWorkspaceModel";

describe("Agent workspace contract", () => {
  it("keeps the canonical navigation phases and a distinct Build entry", () => {
    expect(agentWorkspaceTabs.map((tab) => tab.id)).toContain("build");
    expect(new Set(agentWorkspaceTabs.map((tab) => tab.phase))).toEqual(new Set(["Build", "Test", "Deploy", "Optimize"]));
    expect(agentWorkspaceTabs.filter((tab) => tab.phase === "Build").map((tab) => tab.label)).toEqual(expect.arrayContaining(["Knowledge", "Instructions", "Procedures", "Actions", "Guardrails"]));
  });

  it("links supported surfaces and explicitly scopes deferred capabilities", () => {
    expect(agentWorkspaceTabs.find((tab) => tab.id === "knowledge")?.href).toBe("/app/data");
    expect(agentWorkspaceTabs.find((tab) => tab.id === "procedures")?.href).toBe("/app/operations");
    expect(agentWorkspaceTabs.find((tab) => tab.id === "backstage")?.state).toBe("deferred");
    expect(getAgentWorkspaceCopy("build", "Revenue Agent").description).toContain("knowledge");
  });
});
