"use client";

import { useEffect, useRef, useState } from "react";

export function ProjectTitle({ children }: { children: string }) {
  const marker = useRef<HTMLHeadingElement>(null);
  const [stuck, setStuck] = useState(false);
  const [dock, setDock] = useState({ top: 56, left: 10 });

  useEffect(() => {
    const el = marker.current;
    if (!el) return;

    let current = false;
    let top = 0;
    let left = 0;

    const measure = () => {
      const header = document.querySelector(".site-header");
      const name = header?.querySelector("a");
      const nextTop = (header?.getBoundingClientRect().bottom ?? 48) + 8;
      const nextLeft = name?.getBoundingClientRect().left ?? 10;
      const origin = el.getBoundingClientRect().top + window.scrollY;
      const nextStuck = window.scrollY + nextTop >= origin;

      if (nextStuck !== current || nextTop !== top || nextLeft !== left) {
        current = nextStuck;
        top = nextTop;
        left = nextLeft;
        setStuck(nextStuck);
        setDock({ top: nextTop, left: nextLeft });
      }
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <h1
        ref={marker}
        className={stuck ? "piece-title is-held" : "piece-title"}
        aria-hidden={stuck || undefined}
        onClick={toTop}
      >
        {children}
      </h1>
      {stuck ? (
        <h1 className="piece-title is-stuck" style={{ top: dock.top, left: dock.left }} onClick={toTop}>
          {children}
        </h1>
      ) : null}
    </>
  );
}
