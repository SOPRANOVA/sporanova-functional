import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export const consoleSurface = "rounded-2xl border border-[#E8E6E2] bg-[#FAFAF8]";

export function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="flex items-start justify-between gap-4"><div><p className="sn-label text-[#6B7FBF]">{eyebrow}</p><h2 className="mt-1 text-xl font-medium text-[#1A1F3C]">{title}</h2></div>{action}</div>;
}

export function MetricBlock({ label, value, detail, icon: Icon, loading = false }: { label: string; value: string | number; detail: string; icon: LucideIcon; loading?: boolean }) {
  return <div className={`${consoleSurface} group p-5 transition hover:-translate-y-0.5 hover:bg-white`}><div className="flex items-start justify-between"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#F0EFF8] text-[#6B7FBF]"><Icon size={16} /></span><ArrowUpRight size={14} className="text-[#D4D1CB] transition group-hover:text-[#6B7FBF]" /></div><p className="sn-label mt-5">{label}</p><p className="mt-2 text-2xl font-medium tracking-[-0.02em] text-[#1A1F3C]">{loading ? "…" : value}</p><p className="mt-1 text-xs text-[#B8B4AC]">{detail}</p></div>;
}

export function StatusPill({ value, tone = "neutral" }: { value: string; tone?: "neutral" | "success" | "warning" | "error" }) {
  const tones = { neutral: "bg-[#F4F3F0] text-[#6B6660]", success: "bg-[#EEF6F6] text-[#4A8B8C]", warning: "bg-[#FBF5E9] text-[#A87C32]", error: "bg-[#FDF0ED] text-[#B8675A]" };
  return <span className={`rounded-full px-2 py-0.5 text-[11px] capitalize ${tones[tone]}`}>{value.replaceAll("_", " ")}</span>;
}

export function ConsoleEmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="grid min-h-48 place-items-center text-center"><div><p className="text-sm font-medium text-[#1A1F3C]">{title}</p><p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#8C887F]">{description}</p>{action && <div className="mt-3">{action}</div>}</div></div>;
}
