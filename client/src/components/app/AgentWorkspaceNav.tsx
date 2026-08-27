import { ArrowUpRight, CheckCircle2, CircleDashed, LockKeyhole } from "lucide-react";
import { agentWorkspaceTabs, getAgentWorkspaceCopy } from "./AgentWorkspaceModel";

export default function AgentWorkspaceNav({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  let phase = "";
  return <nav aria-label="Agent workspace" className="space-y-4">{agentWorkspaceTabs.map((tab) => { const heading = tab.phase !== phase; phase = tab.phase; return <div key={tab.id}>{heading && <p className="mb-1 px-2 text-[10px] uppercase tracking-[.16em] text-[#B8B4AC]">{tab.phase}</p>} {tab.href ? <a href={tab.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-[#6B6660] transition hover:bg-[#F4F3F0] hover:text-[#1A1F3C]"><span className="h-1.5 w-1.5 rounded-full bg-[#75B7B0]" />{tab.label}<ArrowUpRight className="ml-auto text-[#B8B4AC]" size={13} /></a> : <button type="button" onClick={() => tab.state !== "deferred" && onSelect(tab.id)} aria-current={activeId === tab.id ? "page" : undefined} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${activeId === tab.id ? "bg-[#F0EFF8] font-medium text-[#1A1F3C]" : "text-[#6B6660] hover:bg-[#F4F3F0]"} ${tab.state === "deferred" ? "cursor-not-allowed opacity-55" : ""}`}><span className="text-[#6B7FBF]">{tab.state === "deferred" ? <LockKeyhole size={13} /> : tab.state === "available" ? <CircleDashed size={13} /> : <CheckCircle2 size={13} />}</span>{tab.label}{tab.state === "deferred" && <span className="ml-auto text-[10px] text-[#B8B4AC]">Scoped later</span>}</button>}</div>; })}</nav>;
}

export { getAgentWorkspaceCopy };
