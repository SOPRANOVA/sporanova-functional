import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router";

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitioning, setTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setTransitioning(true);
    const t = setTimeout(() => {
      setDisplayChildren(children);
      setKey((k) => k + 1);
      setTransitioning(false);
    }, 180);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div
      key={key}
      style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(6px)" : "translateY(0)",
        transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        minHeight: "100vh",
      }}
    >
      {displayChildren}
    </div>
  );
}
