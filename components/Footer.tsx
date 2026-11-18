"use client";

import { useEffect } from "react";
import { site } from "@/lib/content";

export function Footer() {
  useEffect(() => {
    const link = document.querySelector<HTMLElement>(".instagram-link");
    if (!link) return;

    const place = () => {
      const disclaimer = document.querySelector<HTMLElement>(".site-disclaimer");
      if (!disclaimer) {
        link.style.removeProperty("bottom");
        return;
      }
      const footerTop = disclaimer.getBoundingClientRect().top;
      const bottom = Math.max(24, window.innerHeight - footerTop + 24);
      link.style.bottom = `${bottom}px`;
    };

    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      link.style.removeProperty("bottom");
    };
  }, []);

  return (
    <a className="instagram-link" href={site.instagram}>
      Instagram
    </a>
  );
}
