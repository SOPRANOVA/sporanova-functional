import { useState } from "react";

const members = [
  { name: "Alex Chen", email: "alex.chen@acme.com", role: "Owner", avatar: "AC", joined: "Jan 2025", active: true },
  { name: "Sarah Martinez", email: "s.martinez@acme.com", role: "Admin", avatar: "SM", joined: "Mar 2025", active: true },
  { name: "James Okafor", email: "j.okafor@acme.com", role: "Manager", avatar: "JO", joined: "May 2025", active: true },
  { name: "Priya Nair", email: "p.nair@acme.com", role: "Analyst", avatar: "PN", joined: "Jun 2025", active: true },
  { name: "David Lee", email: "d.lee@acme.com", role: "Analyst", avatar: "DL", joined: "Aug 2025", active: false },
  { name: "Clara Mäkinen", email: "c.makinen@acme.com", role: "Viewer", avatar: "CM", joined: "Sep 2025", active: true },
];

const roles = [
  { name: "Owner", desc: "Full platform control, billing, workspace deletion", color: "#1A1F3C" },
  { name: "Admin", desc: "Manage members, agents, data sources, and automations", color: "#5B6FA8" },
  { name: "Manager", desc: "Create and approve decisions, run agents, view all analytics", color: "#4A8B8C" },
  { name: "Analyst", desc: "Use intelligence workspace, view dashboards and decisions", color: "#C5974A" },
  { name: "Viewer", desc: "Read-only access to dashboards and approved decisions", color: "#8C887F" },
];

const teams = [
  { name: "Revenue Operations", members: 3, agents: ["Revenue Analyst", "Forecast Agent"] },
  { name: "Customer Success", members: 2, agents: ["Customer Intelligence"] },
  { name: "Strategy", members: 2, agents: ["Market Analyst"] },
];

const roleColor: Record<string, { bg: string; color: string }> = {
  Owner: { bg: "#1A1F3C", color: "#F8F6F2" },
  Admin: { bg: "#F0EFF8", color: "#5B6FA8" },
  Manager: { bg: "#EEF6F6", color: "#4A8B8C" },
  Analyst: { bg: "#FDF4EE", color: "#C5974A" },
  Viewer: { bg: "#F4F3F0", color: "#8C887F" },
};

export default function Workspace() {
  const [tab, setTab] = useState<"members" | "teams" | "roles">("members");

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="sn-label mb-1">Workspace</div>
          <h1 className="text-xl font-medium" style={{ fontFamily: "'Instrument Serif', serif", color: "#1A1F3C" }}>Workspace Management</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
          style={{ background: "#1A1F3C", color: "#F8F6F2" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          Invite Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Members", value: String(members.length) },
          { label: "Active Now", value: String(members.filter((m) => m.active).length) },
          { label: "Teams", value: String(teams.length) },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border p-5 text-center" style={{ background: "#FAFAF8", borderColor: "#E8E6E2" }}>
            <div className="text-2xl font-medium mb-1" style={{ color: "#1A1F3C" }}>{s.value}</div>
            <div className="sn-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-xl p-1" style={{ background: "#E8E6E2" }}>
        {(["members", "teams", "roles"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors"
            style={{ background: tab === t ? "#FAFAF8" : "transparent", color: tab === t ? "#1A1F3C" : "#8C887F", boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E8E6E2" }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: "#F4F3F0", borderBottom: "1px solid #E8E6E2" }}>
                {["Member", "Role", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left sn-label" style={{ fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: "#FAFAF8" }}>
              {members.map((m, i) => (
                <tr key={m.email} className="transition-colors" style={{ borderTop: i > 0 ? "1px solid #F4F3F0" : undefined }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "#F4F3F0"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: "#E8E6E2", color: "#6B6660" }}>{m.avatar}</div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#1A1F3C" }}>{m.name}</p>
                        <p className="text-xs" style={{ color: "#B8B4AC" }}>{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: roleColor[m.role].bg, color: roleColor[m.role].color }}>{m.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: "#6B6660" }}>{m.joined}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: m.active ? "#4A8B8C" : "#B8B4AC" }} />
                      <span className="text-xs" style={{ color: "#8C887F" }}>{m.active ? "Active" : "Offline"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="text-xs px-3 py-1 rounded-lg border transition-colors"
                      style={{ borderColor: "#E8E6E2", color: "#6B6660" }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "teams" && (
        <div className="grid gap-3 md:grid-cols-3">
          {teams.map((t) => (
            <div key={t.name} className="rounded-2xl border p-5" style={{ background: "#FAFAF8", borderColor: "#E8E6E2" }}>
              <h3 className="text-sm font-medium mb-1" style={{ color: "#1A1F3C" }}>{t.name}</h3>
              <p className="text-xs mb-3" style={{ color: "#B8B4AC" }}>{t.members} members</p>
              <div className="space-y-1">
                <div className="sn-label mb-1.5">Assigned Agents</div>
                {t.agents.map((a) => (
                  <span key={a} className="inline-block mr-1.5 mb-1 px-2 py-0.5 rounded-full text-xs"
                    style={{ background: "#EEF6F6", color: "#4A8B8C" }}>{a}</span>
                ))}
              </div>
            </div>
          ))}
          <button className="rounded-2xl border-2 border-dashed p-5 flex items-center justify-center text-sm transition-colors"
            style={{ borderColor: "#E8E6E2", color: "#B8B4AC" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6B7FBF"; e.currentTarget.style.color = "#6B7FBF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8E6E2"; e.currentTarget.style.color = "#B8B4AC"; }}>
            + New Team
          </button>
        </div>
      )}

      {tab === "roles" && (
        <div className="space-y-3">
          {roles.map((r) => (
            <div key={r.name} className="flex items-center gap-4 rounded-2xl border p-5" style={{ background: "#FAFAF8", borderColor: "#E8E6E2" }}>
              <span className="flex-shrink-0 w-24 inline-block px-2 py-0.5 rounded-full text-xs font-medium text-center"
                style={{ background: roleColor[r.name].bg, color: roleColor[r.name].color }}>{r.name}</span>
              <p className="text-sm flex-1" style={{ color: "#6B6660" }}>{r.desc}</p>
              <span className="text-xs flex-shrink-0" style={{ color: "#B8B4AC" }}>
                {members.filter((m) => m.role === r.name).length} member{members.filter((m) => m.role === r.name).length !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
