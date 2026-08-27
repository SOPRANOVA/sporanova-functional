export type AgentWorkspaceTab = {
  id: string;
  label: string;
  phase: "Build" | "Test" | "Deploy" | "Optimize";
  state: "available" | "linked" | "deferred";
  href?: string;
};

export const agentWorkspaceTabs: AgentWorkspaceTab[] = [
  { id: "overview", label: "Overview", phase: "Build", state: "available" },
  { id: "build", label: "Build", phase: "Build", state: "available" },
  { id: "knowledge", label: "Knowledge", phase: "Build", state: "linked", href: "/app/data" },
  { id: "instructions", label: "Instructions", phase: "Build", state: "available" },
  { id: "procedures", label: "Procedures", phase: "Build", state: "linked", href: "/app/operations" },
  { id: "actions", label: "Actions", phase: "Build", state: "linked", href: "/app/operations" },
  { id: "guardrails", label: "Guardrails", phase: "Build", state: "deferred" },
  { id: "test", label: "Test", phase: "Test", state: "available" },
  { id: "deploy", label: "Deploy", phase: "Deploy", state: "available" },
  { id: "activity", label: "Activity", phase: "Optimize", state: "linked", href: "/app/activity" },
  { id: "analytics", label: "Analytics", phase: "Optimize", state: "linked", href: "/app/analytics" },
  { id: "backstage", label: "Backstage", phase: "Optimize", state: "deferred" },
  { id: "integrations", label: "Integrations", phase: "Optimize", state: "linked", href: "/app/operations" },
  { id: "settings", label: "Settings", phase: "Optimize", state: "linked", href: "/app/settings" },
];

export function getAgentWorkspaceCopy(id: string, agentName: string) {
  const copy: Record<string, { eyebrow: string; title: string; description: string }> = {
    overview: { eyebrow: "Overview", title: `${agentName} workspace`, description: "A focused operating view for the agent's purpose, current status, and next authorized run." },
    build: { eyebrow: "Build", title: "Shape the agent before it acts.", description: "Build groups the agent's knowledge, instructions, procedures, actions, and guardrails into one deliberate configuration surface." },
    instructions: { eyebrow: "Instructions", title: "Make the role explicit.", description: "Use the agent purpose and run instruction to keep work specific, reviewable, and grounded in workspace context." },
    test: { eyebrow: "Test", title: "Run a real instruction before you deploy.", description: "The existing Run now action executes through the protected agent API and returns the persisted result without inventing test metrics." },
    deploy: { eyebrow: "Deploy", title: "Control the agent's operating state.", description: "Activate or pause this agent from the current workspace. Deployment channels can be connected when their provider contract is configured." },
  };
  return copy[id] ?? copy.overview;
}
