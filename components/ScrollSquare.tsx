"use client";

import { useEffect, useRef } from "react";

const SIZE = 8;
const INSET = 20;

function track() {
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  const normalTravel = Math.max(window.innerHeight - SIZE - INSET * 2, 0);
  const disclaimer = document.querySelector<HTMLElement>(".site-disclaimer");
  const disclaimerTop = disclaimer?.getBoundingClientRect().top ?? window.innerHeight;
  const footerTravel = Math.max(disclaimerTop - INSET - SIZE - INSET, 0);
  const travel = disclaimer ? Math.min(normalTravel, footerTravel) : normalTravel;
  return { max, travel };
}

export function ScrollSquare() {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const place = () => {
      if (dragging.current) return;
      const { max, travel } = track();
      const ratio = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `translateY(${ratio * travel}px)`;
    };

    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
    };
  }, []);

  const moveTo = (clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const { max, travel } = track();
    const y = clientY - INSET - SIZE / 2;
    const ratio = travel > 0 ? Math.min(1, Math.max(0, y / travel)) : 0;
    el.style.transform = `translateY(${ratio * travel}px)`;
    window.scrollTo(0, ratio * max);
  };

  return (
    <div
      ref={ref}
      className="scroll-square"
      role="scrollbar"
      aria-orientation="vertical"
      aria-label="Scroll page"
      onPointerDown={(event) => {
        dragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.classList.add("is-dragging");
        moveTo(event.clientY);
      }}
      onPointerMove={(event) => {
        if (!dragging.current) return;
        moveTo(event.clientY);
      }}
      onPointerUp={(event) => {
        dragging.current = false;
        event.currentTarget.classList.remove("is-dragging");
      }}
      onPointerCancel={(event) => {
        dragging.current = false;
        event.currentTarget.classList.remove("is-dragging");
      }}
    />
  );
}
