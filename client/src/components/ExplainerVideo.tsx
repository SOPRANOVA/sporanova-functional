import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

type ExplainerVideoProps = {
  title: string;
  description: string;
  eyebrow: string;
  src?: string;
  poster?: string;
};

export default function ExplainerVideo({ title, description, eyebrow, src, poster }: ExplainerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target || !src) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video?.duration) return;
    video.currentTime = value * video.duration;
    setProgress(value);
  };

  const showVideo = Boolean(src && nearViewport && !failed);
  return <div ref={containerRef} className="relative min-h-[22rem] overflow-hidden rounded-[2rem] bg-[#1A1F3C] shadow-[0_24px_60px_rgba(26,31,60,.11)]">
    {showVideo && <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-35" src={src} poster={poster} autoPlay={!reducedMotion} muted={muted} loop playsInline preload="metadata" onError={() => setFailed(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(event) => { const video = event.currentTarget; setProgress(video.duration ? video.currentTime / video.duration : 0); }} aria-label={title} />}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(169,184,255,.24),transparent_32%),radial-gradient(circle_at_16%_90%,rgba(117,183,176,.16),transparent_32%)]" />
    <div className="absolute inset-0 opacity-70" aria-hidden="true"><div className="absolute left-[18%] top-[28%] h-2 w-2 rounded-full bg-[#A9B8FF]" /><div className="absolute left-[48%] top-[45%] h-1.5 w-1.5 rounded-full bg-[#75B7B0]" /><div className="absolute right-[18%] top-[30%] h-2 w-2 rounded-full bg-[#A9B8FF]" /><div className="absolute left-[30%] top-[52%] h-px w-[40%] rotate-[18deg] bg-white/20" /><div className="absolute left-[25%] top-[38%] h-44 w-44 rounded-full border border-white/10" /></div>
    <div className="relative flex min-h-[22rem] flex-col justify-between p-7 text-[#FAFAF8]"><div className="flex items-center justify-between"><span className="text-[11px] uppercase tracking-[.18em] text-[#A9B8FF]">{eyebrow}</span><span className="text-[11px] text-white/45">{src && !failed ? "Optional film" : "Visual explainer"}</span></div><div className="max-w-md"><h2 className="font-[Inter] text-2xl font-medium leading-tight md:text-3xl">{title}</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">{description}</p></div>{showVideo ? <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur"><button type="button" onClick={togglePlayback} className="grid h-8 w-8 place-items-center rounded-full bg-[#FAFAF8] text-[#1A1F3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]" aria-label={playing ? `Pause ${title}` : `Play ${title}`}>{playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}</button><input className="h-1 min-w-0 flex-1 accent-[#A9B8FF]" type="range" min="0" max="1" step="0.001" value={progress} onChange={(event) => seek(Number(event.target.value))} aria-label={`${title} progress`} /><button type="button" onClick={toggleMute} className="grid h-8 w-8 place-items-center rounded-full text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A9B8FF]" aria-label={muted ? `Unmute ${title}` : `Mute ${title}`}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button></div> : <div className="flex items-center gap-2 text-xs text-white/45"><span className="h-1.5 w-1.5 rounded-full bg-[#75B7B0]" />Branded fallback until the film asset is available</div>}</div>
  </div>;
}
