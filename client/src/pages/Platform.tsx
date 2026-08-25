import PublicNav from "../components/PublicNav";
import AnimatedSection from "../components/AnimatedSection";
import { Link } from "react-router";

const pillars = [
  { title: "AI Intelligence", desc: "Conversational AI trained on your enterprise data. Ask anything, get answers grounded in your actual business context.", icon: "◈" },
  { title: "Enterprise Memory", desc: "A persistent, semantic understanding of your organization — documents, people, processes, decisions.", icon: "◉" },
  { title: "AI Agents", desc: "Autonomous agents that run tasks, monitor signals, generate reports, and take action on your behalf.", icon: "◎" },
  { title: "Analytics", desc: "Real-time dashboards and KPI tracking that translate raw data into actionable business intelligence.", icon: "◐" },
  { title: "Automation", desc: "Intelligent workflows that trigger on signals, apply AI reasoning, and execute multi-step business processes.", icon: "◑" },
  { title: "Decision Intelligence", desc: "From insight to action — recommendations with explainable rationale and confidence scoring.", icon: "◒" },
];

export default function Platform() {
  return (
    <div className="min-h-screen bg-sn-white">
      <PublicNav />
      <section className="pt-36 pb-24 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="sn-label mb-4">The Platform</div>
          <h1 className="sn-display mb-6" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", color: "#1A1F3C" }}>
            One intelligent system.<br />Every enterprise layer.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed mb-10" style={{ color: "#6B6660" }}>
            SOPRANOVA is not a collection of tools. It is a unified intelligence architecture designed for the complexity of modern enterprise.
          </p>
          <div className="flex gap-4">
            <Link to="/signup" className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300"
              style={{ background: "#1A1F3C", color: "#FAFAF8" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#252B4A"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1A1F3C"; e.currentTarget.style.transform = ""; }}>
              Get Started
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-16 border-y border-sn-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((p, i) => (
              <AnimatedSection key={p.title} delay={i * 60}>
                <div className="p-6 rounded-2xl h-full transition-all duration-300 group"
                  style={{ background: "#FAFAF8", border: "1px solid #E8E6E2" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(26,31,60,0.06)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                  <div className="text-2xl mb-4" style={{ color: "#6B7FBF" }}>{p.icon}</div>
                  <h3 className="font-medium mb-2" style={{ color: "#1A1F3C" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8C887F" }}>{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="sn-display mb-6" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", color: "#1A1F3C" }}>
            Built for enterprise scale
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
            {[["SOC 2 Type II", "Security"], ["99.99%", "Uptime SLA"], ["GDPR + HIPAA", "Compliance"], ["24/7", "Enterprise support"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="sn-display text-2xl mb-1" style={{ color: "#1A1F3C" }}>{val}</div>
                <div className="sn-label">{lbl}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
