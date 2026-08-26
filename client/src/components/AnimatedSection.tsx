import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: "slide-up" | "fade" | "scale" | "slide-right";
}

export default function AnimatedSection({ children, className = "", delay = 0, animation = "slide-up" }: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const keyframes: Record<string, string> = {
    "slide-up": "sn-slide-up",
    "fade": "sn-fade",
    "scale": "sn-scale-in",
    "slide-right": "sn-slide-right",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `${keyframes[animation]} 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms both`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
