import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import PublicNav from "../components/PublicNav";
import AnimatedSection from "../components/AnimatedSection";
import Logo from "../components/Logo";
import { ArrowUpRight, Bot, BrainCircuit, Check, Database, GitBranch, Headphones, Pause, Play, Volume2, VolumeX, Workflow } from "lucide-react";
import { LandingSections } from "@/components/LandingSections";

const capabilities = [
  { label: "AI Intelligence", desc: "Ask complex questions across governed enterprise context and keep the evidence in view.", href: "/intelligence", icon: BrainCircuit, tag: "Understand" },
  { label: "Analytics", desc: "Surface patterns, themes, and operational signals that help teams decide with confidence.", href: "/app/analytics", icon: GitBranch, tag: "See patterns" },
  { label: "AI Agents", desc: "Configure agents with purpose, procedures, guardrails, and a clear operating boundary.", href: "/agents", icon: Bot, tag: "Configure" },
  { label: "Enterprise Data", desc: "Connect sources, documents, and memory so every answer starts with trusted context.", href: "/platform", icon: Database, tag: "Connect" },
  { label: "Operations", desc: "Coordinate channels, actions, procedures, and human tickets from one workspace.", href: "/app/operations", icon: Headphones, tag: "Operate" },
  { label: "Automations", desc: "Turn reviewed decisions into repeatable workflows with visible execution status.", href: "/app/automations", icon: Workflow, tag: "Act" },
];

const faqItems = [
  { question: "What is SOPRANOVA?", answer: "SOPRANOVA is an enterprise intelligence platform that connects governed data, AI reasoning, agents, decisions, and operational actions in one workspace." },
  { question: "Can I keep evidence close to every answer?", answer: "Yes. Intelligence conversations can include persisted workspace context and attached sources, with Trace and Sources inspection available in the protected experience." },
  { question: "How do agents reach real channels?", answer: "Agents can be configured with procedures, actions, channels, and human handoff records. Provider-specific connections remain explicitly scoped until their contracts are configured." },
  { question: "Does SOPRANOVA replace our existing systems?", answer: "No. The platform is designed as an operating layer around connected sources, documents, memory, analytics, and workflows rather than as a claim to replace every system of record." },
];

const lifecycle = [
  { step: "01", label: "Connect", title: "Bring context together", desc: "Sources, documents, and memory give the platform a governed view of the business.", href: "/platform" },
  { step: "02", label: "Configure", title: "Shape how intelligence behaves", desc: "Agents, procedures, guardrails, and actions turn context into a reliable operating model.", href: "/agents" },
  { step: "03", label: "Validate", title: "Test before you trust", desc: "Review scenarios, evidence, and failures before an agent reaches a live channel.", href: "/intelligence" },
  { step: "04", label: "Operate", title: "Move from insight to action", desc: "Channels, helpdesk, analytics, decisions, and activity keep the loop visible.", href: "/app/operations" },
];

function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from({ length: 18 }, () => ({ x: 0.08 + Math.random() * 0.84, y: 0.1 + Math.random() * 0.8, r: 1.5 + Math.random() * 2.5, vx: (Math.random() - 0.5) * 0.00035, vy: (Math.random() - 0.5) * 0.00035 }));
    let t = 0;
    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      t += 0.01;
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0.04 || node.x > 0.96) node.vx *= -1;
        if (node.y < 0.04 || node.y > 0.96) node.vy *= -1;
      });
      nodes.forEach((a, index) => nodes.slice(index + 1).forEach((b) => {
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < width * 0.26) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(169,184,255,${(1 - distance / (width * 0.26)) * 0.35})`;
          ctx.lineWidth = 0.7;
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }));
      nodes.forEach((node, index) => {
        const pulse = reducedMotion ? 1 : 0.72 + Math.sin(t * (0.7 + index * 0.03)) * 0.16;
        ctx.beginPath();
        ctx.arc(node.x * width, node.y * height, node.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = index % 3 === 0 ? "rgba(169,184,255,.86)" : index % 3 === 1 ? "rgba(117,183,176,.82)" : "rgba(142,156,222,.8)";
        ctx.fill();
      });
      if (!reducedMotion) animRef.current = requestAnimationFrame(draw);
    };
    const resize = () => { canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); draw(); };
    resize();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

function SystemPreview({ activeIndex }: { activeIndex: number }) {
  const capability = capabilities[activeIndex];
  const Icon = capability.icon;
  return <div className="relative min-h-[27rem] overflow-hidden rounded-[2rem] bg-[#1A1F3C] p-6 text-[#FAFAF8] shadow-[0_28px_70px_rgba(26,31,60,0.12)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_28%,rgba(169,184,255,0.22),transparent_38%),radial-gradient(circle_at_20%_90%,rgba(117,183,176,0.13),transparent_36%)]" />
    <div className="relative flex items-center justify-between border-b border-white/10 pb-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-[#A9B8FF]"><Icon size={17} /></span><div><p className="text-sm font-semibold">SOPRANOVA / {capability.label}</p><p className="mt-1 text-[11px] text-white/45">Workspace intelligence layer</p></div></div><span className="flex items-center gap-1.5 text-[11px] text-[#9ED2C9]"><span className="h-1.5 w-1.5 rounded-full bg-[#75B7B0]" />Ready</span></div>
    <div className="relative mt-8 grid gap-3 sm:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[11px] uppercase tracking-[.16em] text-white/40">Current signal</p><p className="mt-5 max-w-[16rem] font-[Inter] text-lg leading-snug text-white/90">{capability.desc}</p><div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[68%] rounded-full bg-[#A9B8FF]" /></div><div className="mt-2 flex justify-between text-[10px] text-white/40"><span>Context coverage</span><span>Active</span></div></div>
      <div className="space-y-3"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[11px] uppercase tracking-[.16em] text-white/40">Product moment</p><div className="mt-5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#75B7B0]" /><span className="h-2 w-20 rounded-full bg-white/20" /><span className="h-2 w-10 rounded-full bg-[#A9B8FF]/60" /></div><p className="mt-3 text-xs leading-relaxed text-white/65">Evidence stays close to the decision.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[11px] uppercase tracking-[.16em] text-white/40">Next step</p><p className="mt-3 text-sm text-white/80">Review and move forward <ArrowUpRight size={14} className="mr-1 inline text-[#A9B8FF]" /></p></div></div>
    </div>
    <div className="relative mt-8 flex items-center gap-2 text-[11px] text-white/45"><span className="h-px flex-1 bg-white/10" /><span>01 / 06</span></div>
  </div>;
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync(); media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const togglePlayback = () => { const video = videoRef.current; if (!video) return; if (video.paused) void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); else { video.pause(); setPlaying(false); } };
  const toggleMute = () => { const video = videoRef.current; if (!video) return; video.muted = !video.muted; setMuted(video.muted); };
  const seek = (value: number) => { const video = videoRef.current; if (!video?.duration) return; video.currentTime = value * video.duration; setProgress(value); };
  return <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#1A1F3C] shadow-[0_28px_70px_rgba(26,31,60,0.12)]">
    {!failed && <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-30" autoPlay={!reducedMotion} muted={muted} loop playsInline preload="metadata" aria-hidden="true" onError={() => setFailed(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(event) => { const video = event.currentTarget; setProgress(video.duration ? video.currentTime / video.duration : 0); }} src="/manus-storage/sopranova-intelligence-loop_4515574a.mp4" />}
    {failed && <HeroVisual />}
    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(26,31,60,.72),rgba(26,31,60,.16)_55%,rgba(26,31,60,.86))]" />
    <div className="relative flex min-h-[30rem] flex-col justify-between p-7 text-[#FAFAF8]"><div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-[.18em] text-white/50">Platform film / 00:42</span><span className="flex items-center gap-2 text-xs text-[#9ED2C9]"><span className="h-1.5 w-1.5 rounded-full bg-[#75B7B0]" />Live context</span></div><div className="max-w-sm"><p className="text-[11px] uppercase tracking-[.18em] text-[#A9B8FF]">One operating layer</p><h2 className="mt-4 font-[Inter] text-3xl font-medium leading-tight">See the system behind the signal.</h2><p className="mt-3 text-sm leading-relaxed text-white/60">A visual introduction to data, intelligence, agents, and action working together.</p></div><div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur"><button type="button" onClick={togglePlayback} className="grid h-8 w-8 place-items-center rounded-full bg-[#FAFAF8] text-[#1A1F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]" aria-label={playing ? "Pause platform film" : "Play platform film"}>{playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}</button><input className="h-1 min-w-0 flex-1 accent-[#A9B8FF]" type="range" min="0" max="1" step="0.001" value={progress} onChange={(event) => seek(Number(event.target.value))} aria-label="Platform film progress" /><button type="button" onClick={toggleMute} className="grid h-8 w-8 place-items-center rounded-full text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]" aria-label={muted ? "Unmute platform film" : "Mute platform film"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div></div>
  </div>;
}

export default function Home() {
  const [activeCapability, setActiveCapability] = useState(0);
  return <div className="min-h-screen bg-white text-[#111111]">
    <PublicNav />
    <main>
      <section className="relative overflow-hidden border-b border-[#E8E6E2]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_68%_30%,rgba(107,127,191,.09),transparent_70%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col items-center gap-14 px-6 pb-20 pt-32 text-center lg:px-10">
          <AnimatedSection animation="slide-up"><div className="max-w-3xl"><p className="sn-label mb-6 text-[#6B7FBF]">Enterprise intelligence platform</p><h1 className="sn-display max-w-[36rem] text-[clamp(3.2rem,7vw,6.5rem)] leading-[.94]">Intelligence,<br /><span className="text-[#6B7FBF]">without the</span><br />complexity.</h1><p className="mt-8 max-w-lg text-lg leading-relaxed text-[#6B6660]">SOPRANOVA connects enterprise data, AI, analytics, and automation into one intelligent operating layer.</p><div className="mt-10 flex flex-wrap justify-center gap-3"><Link to="/platform" className="inline-flex items-center gap-2 rounded-xl bg-[#1A1F3C] px-5 py-3 text-sm font-medium text-[#FAFAF8] transition hover:-translate-y-0.5 hover:bg-[#252B4A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7FBF]">Explore the platform <ArrowUpRight size={16} /></Link><Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[#D4D1CB] px-5 py-3 text-sm font-medium text-[#1A1F3C] transition hover:-translate-y-0.5 hover:border-[#1A1F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7FBF]">Talk to an expert</Link></div><div className="mt-12 flex items-center justify-center gap-3 text-xs text-[#8C887F]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#EEF6F6] text-[#4A8B8C]"><Check size={14} /></span>Built for governed, traceable decisions</div></div></AnimatedSection>
          <AnimatedSection animation="scale" delay={150}><div className="w-full max-w-6xl"><HeroVideo /></div></AnimatedSection>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><AnimatedSection animation="slide-up"><div><p className="sn-label mb-5 text-[#6B7FBF]">The operating model</p><h2 className="sn-display max-w-md text-4xl leading-tight md:text-5xl">Every layer of intelligence, in one system.</h2><p className="mt-6 max-w-md text-base leading-relaxed text-[#6B6660]">Explore how the platform moves from context to insight, and from insight to action.</p></div></AnimatedSection><div className="grid gap-2 md:grid-cols-[.8fr_1.2fr]"><div className="flex flex-col border-t border-[#E8E6E2]">{capabilities.map((capability, index) => { const Icon = capability.icon; const active = index === activeCapability; return <button key={capability.label} type="button" onClick={() => setActiveCapability(index)} className={`flex items-center justify-between border-b border-dashed border-[#D9D5CE] px-3 py-4 text-right transition ${active ? "bg-[#F0EFF8] text-[#1A1F3C]" : "text-[#8C887F] hover:bg-[#F7F6F3]"}`}><span className="flex items-center gap-3"><span className={`grid h-8 w-8 place-items-center rounded-lg ${active ? "bg-[#1A1F3C] text-[#A9B8FF]" : "bg-[#F4F3F0] text-[#8C887F]"}`}><Icon size={15} /></span><span><span className="block text-sm font-medium">{capability.label}</span><span className="mt-1 block text-[11px] text-[#8C887F]">{capability.tag}</span></span></span><ArrowUpRight size={15} className={active ? "text-[#6B7FBF]" : "text-[#B8B4AC]"} /></button>; })}</div><SystemPreview activeIndex={activeCapability} /></div></div></section>

      <section className="border-y border-[#E8E6E2] bg-[#F4F3F0]"><div className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><AnimatedSection animation="fade"><div className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><p className="sn-label mb-4 text-[#6B7FBF]">A clear path to value</p><h2 className="sn-display text-4xl md:text-5xl">From context to decision.</h2></div><p className="max-w-sm text-sm leading-relaxed text-[#6B6660]">Each stage is designed to make the next step obvious, measurable, and safe to operate.</p></div></AnimatedSection><div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[#E1DED8] bg-[#E1DED8] md:grid-cols-4">{lifecycle.map((item, index) => <Link key={item.step} to={item.href} className="group min-h-[16rem] bg-[#FAFAF8] p-6 transition hover:bg-white"><div className="flex items-center justify-between"><span className="sn-label text-[#6B7FBF]">{item.step}</span><ArrowUpRight size={16} className="text-[#B8B4AC] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#6B7FBF]" /></div><p className="mt-10 text-xs font-semibold uppercase tracking-[.14em] text-[#8C887F]">{item.label}</p><h3 className="mt-3 text-xl font-medium">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-[#8C887F]">{item.desc}</p></Link>)}</div></div></section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="grid items-center gap-10 lg:grid-cols-[1fr_.9fr]"><AnimatedSection animation="slide-up"><div><p className="sn-label mb-5 text-[#6B7FBF]">Designed for the full loop</p><h2 className="sn-display max-w-xl text-4xl leading-tight md:text-5xl">The interface should explain the system as you use it.</h2><p className="mt-6 max-w-lg text-base leading-relaxed text-[#6B6660]">Kimi’s strongest product patterns make complex tools feel discoverable. SOPRANOVA applies that principle to enterprise intelligence: one clear action, one useful state, one visible next step.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/intelligence" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7FBF] hover:text-[#1A1F3C]">Explore Intelligence <ArrowUpRight size={15} /></Link><Link to="/app/operations" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7FBF] hover:text-[#1A1F3C]">Open Operations <ArrowUpRight size={15} /></Link></div></div></AnimatedSection><AnimatedSection animation="fade" delay={120}><div className="rounded-[2rem] border border-[#E8E6E2] bg-white p-6"><div className="flex items-center justify-between border-b border-[#E8E6E2] pb-4"><span className="sn-label">Decision loop</span><span className="text-xs text-[#4A8B8C]">Traceable</span></div><div className="space-y-3 pt-5">{["Question enters the system", "Context is assembled", "Evidence stays visible", "Recommendation becomes action"].map((label, index) => <div key={label} className="flex items-center gap-3 rounded-xl bg-[#F4F3F0] px-4 py-3"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1A1F3C] text-xs font-semibold text-[#A9B8FF]">0{index + 1}</span><span className="text-sm font-medium">{label}</span><span className="mr-auto h-2 w-2 rounded-full bg-[#75B7B0]" /></div>)}</div></div></AnimatedSection></div></section>

      <LandingSections />

      <section className="px-6 pb-24 lg:px-10"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#1A1F3C] px-7 py-16 text-center text-[#FAFAF8] md:px-16"><p className="sn-label text-[#A9B8FF]">Ready to begin</p><h2 className="sn-display mx-auto mt-5 max-w-3xl text-4xl leading-tight md:text-5xl">Make your next decision easier to see.</h2><p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/55">Start with a connected workspace, then grow into the operating layer your team needs.</p><div className="mt-9 flex flex-wrap justify-center gap-3"><Link to="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#FAFAF8] px-5 py-3 text-sm font-medium text-[#1A1F3C] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]">Create an account <ArrowUpRight size={16} /></Link><Link to="/contact" className="inline-flex items-center rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-[#FAFAF8] transition hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]">Talk to an expert</Link></div></div></section>
    </main>
    <footer className="border-t border-[#E8E6E2] px-6 py-10 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row"><Logo size={22} showWordmark /><div className="flex flex-wrap justify-center gap-5 text-xs text-[#8C887F]"><Link to="/platform" className="hover:text-[#1A1F3C]">Platform</Link><Link to="/intelligence" className="hover:text-[#1A1F3C]">Intelligence</Link><Link to="/agents" className="hover:text-[#1A1F3C]">AI Agents</Link><Link to="/enterprise" className="hover:text-[#1A1F3C]">Enterprise</Link><Link to="/contact" className="hover:text-[#1A1F3C]">Contact</Link></div><span className="text-xs text-[#B8B4AC]">© 2026 SOPRANOVA</span></div></footer>
  </div>;
}
