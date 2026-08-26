import { useState } from "react";

const all = [
  { id: 1, time: "14:23", date: "Today", action: "Revenue Analyst detected anomaly in Region North — 8.3% revenue decline", type: "agent", tag: "Agents" },
  { id: 2, time: "13:05", date: "Today", action: "Intelligence analysis completed: Q4 forecast variance root cause identified", type: "ai", tag: "AI" },
  { id: 3, time: "12:41", date: "Today", action: "Salesforce CRM synchronized — 2,847 new records ingested", type: "data", tag: "Data" },
  { id: 4, time: "11:30", date: "Today", action: "Pricing Strategy — Region North decision approved by CFO", type: "decision", tag: "Decisions" },
  { id: 5, time: "09:18", date: "Today", action: "Revenue Anomaly Response automation triggered and executed", type: "automation", tag: "Automations" },
  { id: 6, time: "08:00", date: "Today", action: "Customer Intelligence completed churn risk scoring for Q2 cohort", type: "agent", tag: "Agents" },
  { id: 7, time: "16:45", date: "Yesterday", action: "Market Analyst identified competitor pricing change — 6% increase in North America", type: "agent", tag: "Agents" },
  { id: 8, time: "14:00", date: "Yesterday", action: "Snowflake data warehouse full sync completed — 89M records verified", type: "data", tag: "Data" },
  { id: 9, time: "10:30", date: "Yesterday", action: "Q4 forecast updated by Forecast Agent — upside scenario probability increased to 34%", type: "ai", tag: "AI" },
  { id: 10, time: "09:00", date: "Yesterday", action: "Vendor Contract — Snowflake decision approved", type: "decision", tag: "Decisions" },
];

const typeColor: Record<string, { bg: string; color: string; dot: string }> = {
  agent: { bg: "#EEF6F6", color: "#4A8B8C", dot: "#4A8B8C" },
  ai: { bg: "#F0EFF8", color: "#5B6FA8", dot: "#6B7FBF" },
  data: { bg: "#F4F3F0", color: "#6B6660", dot: "#B8B4AC" },
  decision: { bg: "#FDF4EE", color: "#C5974A", dot: "#C5974A" },
  automation: { bg: "#F4F3F0", color: "#8C887F", dot: "#8C887F" },
};

export default function Activity() {
  const [filter, setFilter] = useState("All");
  const tabs = ["All", "AI", "Agents", "Data", "Decisions", "Automations"];

  const filtered = filter === "All" ? all : all.filter((a) => a.tag === filter);
  const grouped = filtered.reduce((acc, item) => {
    const key = item.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof all>);

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <div className="sn-label mb-1">Activity</div>
        <h1 className="text-xl font-medium" style={{ fontFamily: "'Instrument Serif', serif", color: "#1A1F3C" }}>Activity Center</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
            style={{ background: filter === t ? "#1A1F3C" : "#F4F3F0", color: filter === t ? "#F8F6F2" : "#6B6660" }}>
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: "#FAFAF8", borderColor: "#E8E6E2" }}>
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="px-5 py-2.5 border-b" style={{ background: "#F4F3F0", borderColor: "#E8E6E2" }}>
              <span className="sn-label">{date}</span>
            </div>
            {items.map((item, i) => {
              const tc = typeColor[item.type];
              return (
                <div key={item.id} className={`flex items-start gap-4 px-5 py-3.5 ${i < items.length - 1 ? "border-b" : ""} transition-colors`}
                  style={{ borderColor: "#F4F3F0" }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "#F4F3F0"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                    <span className="w-12 text-xs text-right" style={{ color: "#B8B4AC" }}>{item.time}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: tc.dot }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed" style={{ color: "#1A1F3C" }}>{item.action}</p>
                  </div>
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: tc.bg, color: tc.color }}>{item.tag}</span>
                </div>
              );
            })}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: "#8C887F" }}>
            <p className="text-sm">No activity for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
