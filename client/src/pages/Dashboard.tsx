import { useWorkspace } from "@/contexts/WorkspaceContext";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, ArrowUpRight, Bot, CheckCircle2, Database, FileSearch, GitBranch, Lightbulb, RefreshCw, Sparkles, Zap } from "lucide-react";
import { Link } from "wouter";
import { consoleSurface, MetricBlock } from "@/components/app/ConsolePrimitives";

function relativeTime(value: Date | string | null) {
  if (!value) return "—";
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Dashboard() {
  const { workspaceId, workspace } = useWorkspace();
  const { user } = useAuth();
  const overview = trpc.dashboard.overview.useQuery({ workspaceId: workspaceId ?? 0, range: "1Y" }, { enabled: Boolean(workspaceId) });
  const data = overview.data;
  const cards = [
    { label: "Revenue (YTD)", value: data?.kpis.revenue ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(data.kpis.revenue) : "—", icon: ArrowUpRight, detail: "Workspace revenue" },
    { label: "Active agents", value: data ? String(data.kpis.activeAgents) : "—", icon: Bot, detail: "Configured for work" },
    { label: "Data sources", value: data ? String(data.kpis.dataSources) : "—", icon: Database, detail: "Connected context" },
    { label: "Insights today", value: data ? String(data.kpis.insightsToday) : "—", icon: Lightbulb, detail: "Signals to review" },
  ];

  if (overview.error) return <ErrorPanel onRetry={() => overview.refetch()} />;
  return <div className="space-y-6 pb-8">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="sn-label mb-2 text-[#6B7FBF]">Command Center</p><h1 className="text-3xl font-medium tracking-[-0.02em] text-[#1A1F3C]">Good morning, {user?.name?.split(" ")[0] || workspace?.workspace.name || "there"}.</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8C887F]">A clear view of what is connected, what needs attention, and where the next decision can happen.</p></div>
      <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs text-[#6B6660] sm:flex"><span className="h-2 w-2 rounded-full bg-[#75B7B0]" />Workspace-scoped</span><button type="button" onClick={() => overview.refetch()} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#6B6660] ring-1 ring-[#E8E6E2] transition hover:-translate-y-0.5 hover:text-[#1A1F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7FBF]"><RefreshCw size={14} className={overview.isFetching ? "animate-spin" : ""} />Refresh</button></div>
    </header>

    <section className="relative overflow-hidden rounded-[1.75rem] bg-[#1A1F3C] p-6 text-[#FAFAF8] md:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(169,184,255,.2),transparent_32%),radial-gradient(circle_at_15%_100%,rgba(117,183,176,.16),transparent_34%)]" /><div className="relative grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div><p className="sn-label text-[#A9B8FF]">Operating loop</p><h2 className="mt-4 max-w-lg font-[Inter] text-2xl font-medium leading-tight md:text-3xl">Your workspace is the interface between context and action.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">Use the signals below to move from connected data to a decision your team can trace.</p><Link href="/app/intelligence" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-[#A9B8FF] hover:text-white">Ask Intelligence <ArrowUpRight size={15} /></Link></div><OperatingLoop data={data} loading={overview.isLoading} /></div></section>

    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map((card) => <MetricBlock key={card.label} label={card.label} value={card.value} detail={card.detail} icon={card.icon} loading={overview.isLoading} />)}</section>

    <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <section className={`${consoleSurface} p-6`}><div className="flex items-start justify-between"><div><p className="sn-label text-[#6B7FBF]">Revenue trend</p><h2 className="mt-1 text-xl font-medium">Workspace revenue</h2></div><span className="rounded-lg bg-[#F0EFF8] px-2.5 py-1 text-xs text-[#5B6FA8]">1Y</span></div>{data?.revenueSeries.length ? <RevenueSpark values={data.revenueSeries.map(item => item.value)} /> : <EmptyState icon={ArrowUpRight} title="No revenue data yet" description="Connect a data source or add business metrics to populate analytics." action={{ href: "/app/data", label: "Manage data" }} />}</section>
      <section className={`${consoleSurface} p-6`}><div className="flex items-start justify-between"><div><p className="sn-label text-[#6B7FBF]">Intelligence signals</p><h2 className="mt-1 text-xl font-medium">What needs attention</h2></div><Link href="/app/intelligence" className="text-xs font-medium text-[#6B7FBF] hover:text-[#1A1F3C]">Open all →</Link></div>{data?.signals.length ? <div className="mt-5 space-y-2">{data.signals.slice(0, 4).map(signal => <Link key={signal.id} href="/app/intelligence" className="group block rounded-xl bg-[#F4F3F0] p-3 transition hover:bg-[#F0EFF8]"><div className="flex items-start gap-3"><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${signal.severity === "high" ? "bg-[#B8675A]" : signal.severity === "medium" ? "bg-[#C5974A]" : "bg-[#4A8B8C]"}`} /><div className="min-w-0"><p className="text-sm font-medium">{signal.title}</p><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#8C887F]">{signal.description}</p></div><ArrowUpRight size={14} className="mr-0.5 mt-0.5 shrink-0 text-[#B8B4AC] transition group-hover:text-[#6B7FBF]" /></div></Link>)}</div> : <EmptyState icon={Sparkles} title="No open signals" description="Signals appear here when intelligence identifies an actionable pattern." action={{ href: "/app/intelligence", label: "Ask Intelligence" }} />}</section>
    </div>

    <div className="grid gap-4 lg:grid-cols-2"><section className={`${consoleSurface} p-6`}><div className="mb-5 flex items-center justify-between"><div><p className="sn-label text-[#6B7FBF]">Active agents</p><h2 className="mt-1 text-xl font-medium">Agents at work</h2></div><Link href="/app/agents" className="text-xs font-medium text-[#6B7FBF] hover:text-[#1A1F3C]">View all →</Link></div>{data?.activeAgents.length ? <div className="grid gap-2 sm:grid-cols-2">{data.activeAgents.slice(0, 4).map(agent => <Link key={agent.id} href="/app/agents" className="group flex items-center gap-3 rounded-xl bg-[#F4F3F0] p-3 transition hover:bg-[#F0EFF8]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1A1F3C] text-sm font-semibold text-[#A9B8FF]">{agent.name[0]}</span><span className="min-w-0"><span className="block truncate text-sm font-medium">{agent.name}</span><span className="mt-1 block truncate text-xs text-[#8C887F]">{agent.purpose}</span></span><span className="mr-0 ml-auto h-2 w-2 shrink-0 rounded-full bg-[#75B7B0]" /></Link>)}</div> : <EmptyState icon={Bot} title="No active agents" description="Deploy an agent to begin capturing operational intelligence." action={{ href: "/app/agents", label: "Deploy agent" }} />}</section><section className={`${consoleSurface} p-6`}><div className="mb-5 flex items-center justify-between"><div><p className="sn-label text-[#6B7FBF]">Recent activity</p><h2 className="mt-1 text-xl font-medium">The workspace trail</h2></div><Link href="/app/activity" className="text-xs font-medium text-[#6B7FBF] hover:text-[#1A1F3C]">Open log →</Link></div>{data?.activity.length ? <div>{data.activity.slice(0, 5).map(item => <div key={item.id} className="flex gap-4 border-b border-[#F4F3F0] py-3 last:border-0"><span className="w-16 shrink-0 pt-0.5 text-xs text-[#B8B4AC]">{relativeTime(item.createdAt)}</span><span className="text-sm text-[#6B6660]">{item.action.replaceAll("_", " ")}</span></div>)}</div> : <p className="py-4 text-sm text-[#8C887F]">No audit activity exists in this workspace yet.</p>}</section></div>
  </div>;
}

function OperatingLoop({ data, loading }: { data?: { kpis: { dataSources: number; activeAgents: number; insightsToday: number }; signals: Array<unknown> }; loading: boolean }) {
  const stages = [
    { label: "Data", value: data?.kpis.dataSources ?? "—", detail: "sources", icon: Database },
    { label: "Knowledge", value: data?.kpis.dataSources ?? "—", detail: "connected context", icon: FileSearch },
    { label: "Intelligence", value: data?.kpis.insightsToday ?? "—", detail: "insights", icon: Sparkles },
    { label: "Agents", value: data?.kpis.activeAgents ?? "—", detail: "active", icon: Bot },
    { label: "Decisions", value: data?.signals.length ?? "—", detail: "signals", icon: CheckCircle2 },
    { label: "Actions", value: "—", detail: "on demand", icon: GitBranch },
    { label: "Automation", value: "—", detail: "not measured", icon: Zap },
    { label: "Optimization", value: "—", detail: "review cycle", icon: Lightbulb },
  ];
  return <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-x-3">{stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.label} className="relative min-w-0"><div className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/10 text-[#A9B8FF]"><Icon size={14} /></span><span className="truncate text-xs font-medium text-white/75">{stage.label}</span></div><p className="mt-4 text-2xl font-semibold">{loading ? "…" : stage.value}</p><p className="mt-1 truncate text-[11px] text-white/40">{stage.detail}</p>{index < stages.length - 1 && <span className="absolute right-[-10px] top-4 hidden h-px w-4 bg-white/15 xl:block" />}</div>; })}</div>;
}

function RevenueSpark({ values }: { values: number[] }) { const max = Math.max(...values); const min = Math.min(...values); const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${100 - ((value - min) / Math.max(max - min, 1)) * 84 - 8}`).join(" "); return <div className="mt-10"><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-44 w-full overflow-visible" role="img" aria-label="Workspace revenue trend"><defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#6B7FBF" stopOpacity=".22" /><stop offset="1" stopColor="#6B7FBF" stopOpacity="0" /></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#revenueFill)" /><polyline points={points} fill="none" stroke="#5B6FA8" strokeWidth="1.4" vectorEffect="non-scaling-stroke" /></svg></div>; }
function EmptyState({ icon: Icon, title, description, action }: { icon: typeof Bot; title: string; description: string; action: { href: string; label: string } }) { return <div className="grid min-h-48 place-items-center text-center"><div><Icon size={22} className="mx-auto mb-3 text-[#B8B4AC]" /><p className="text-sm font-medium">{title}</p><p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#8C887F]">{description}</p><Link href={action.href} className="mt-3 inline-block text-xs font-medium text-[#6B7FBF] hover:text-[#1A1F3C]">{action.label} →</Link></div></div>; }
function ErrorPanel({ onRetry }: { onRetry: () => void }) { return <div className={`${consoleSurface} p-10 text-center`}><AlertCircle className="mx-auto mb-3 text-[#B8675A]" /><h1 className="text-lg font-medium">Dashboard data is unavailable</h1><p className="mt-2 text-sm text-[#8C887F]">The request could not be completed. No local fallback data is shown.</p><button type="button" onClick={onRetry} className="mt-4 rounded-xl bg-[#1A1F3C] px-4 py-2 text-sm font-medium text-[#F8F6F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7FBF]">Retry</button></div>; }
