import GenericPage from "./GenericPage";
export default function AgentsPublic() {
  return GenericPage({ label:"AI Agents", title:"Agents that work while you think.", subtitle:"Deploy autonomous AI agents that monitor, analyze, generate, and act — without manual intervention.", sections:[{heading:"Autonomous Execution",body:"Agents run continuously, triggering on data signals, schedules, or business events."},{heading:"Intelligent Decision-Making",body:"Each agent applies AI reasoning to determine the best course of action."},{heading:"Audit Trail",body:"Every agent action is logged, explainable, and reversible."},{heading:"Custom Agent Builder",body:"Define new agents with natural language — no code required."}]});
}
