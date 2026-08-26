import { useState } from "react";

const docs = [
  { id: 1, title: "Q3 2026 Board Report", type: "Report", date: "Dec 10, 2026", size: "2.4 MB", status: "indexed", category: "Reports" },
  { id: 2, title: "Enterprise Pricing Policy v4.2", type: "Policy", date: "Nov 28, 2026", size: "380 KB", status: "indexed", category: "Policies" },
  { id: 3, title: "2026 Strategic Plan", type: "Strategy", date: "Jan 5, 2026", size: "1.8 MB", status: "indexed", category: "Strategic" },
  { id: 4, title: "Customer Success Playbook", type: "Playbook", date: "Sep 14, 2026", size: "920 KB", status: "indexed", category: "Knowledge" },
  { id: 5, title: "Region North Pricing Decision — Dec 2026", type: "Decision", date: "Dec 14, 2026", size: "240 KB", status: "indexed", category: "Decisions" },
  { id: 6, title: "Market Analysis — APAC 2026", type: "Analysis", date: "Nov 15, 2026", size: "1.1 MB", status: "processing", category: "Reports" },
  { id: 7, title: "Vendor Contract — Snowflake", type: "Contract", date: "Dec 8, 2026", size: "560 KB", status: "indexed", category: "Knowledge" },
];

const categories = ["All", "Reports", "Policies", "Strategic", "Decisions", "Knowledge"];

export default function Memory() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [focused, setFocused] = useState(false);

  const filtered = docs.filter((d) => {
    const matchCat = cat === "All" || d.category === cat;
    const matchSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="sn-label mb-1">Memory</div>
          <h1 className="text-xl font-medium" style={{ fontFamily: "'Instrument Serif', serif", color: "#1A1F3C" }}>Enterprise Memory</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          style={{ background: "#1A1F3C", color: "#F8F6F2" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v7M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Upload Document
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 flex items-center gap-2 rounded-xl px-3 py-2.5 ring-1 ring-transparent transition-all"
          style={{ background: "#F4F3F0", outline: "none", boxShadow: focused ? "0 0 0 2px rgba(107,127,191,0.2)" : "none", border: `1px solid ${focused ? "#6B7FBF" : "transparent"}` }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "#B8B4AC", flexShrink: 0 }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            placeholder="Search memory…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#B8B4AC]"
            style={{ color: "#1A1F3C" }} />
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-colors"
              style={{ background: cat === c ? "#1A1F3C" : "#F4F3F0", color: cat === c ? "#F8F6F2" : "#6B6660" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.map((doc) => (
          <div key={doc.id} className="flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer"
            style={{ background: "#FAFAF8", borderColor: "#E8E6E2" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F4F3F0"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FAFAF8"; }}>
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl text-xs"
              style={{ background: "#F4F3F0", color: "#6B6660" }}>
              {doc.type[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: "#1A1F3C" }}>{doc.title}</p>
              <p className="text-xs mt-0.5" style={{ color: "#B8B4AC" }}>{doc.type} · {doc.date} · {doc.size}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: doc.status === "indexed" ? "#EEF6F6" : "#FDF4EE",
                color: doc.status === "indexed" ? "#4A8B8C" : "#C5974A"
              }}>{doc.status}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "#8C887F" }}>
            <p className="text-sm">No documents match your search.</p>
          </div>
        )}
      </div>

      <p className="text-xs" style={{ color: "#B8B4AC" }}>{filtered.length} documents · {docs.filter(d => d.status === "indexed").length} indexed</p>
    </div>
  );
}
