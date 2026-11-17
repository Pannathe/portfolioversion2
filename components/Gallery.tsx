"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { coverImage, newestFirst, pad, type Group, type Work } from "@/lib/content";

const filters: { id: "all" | Group; label: string }[] = [
  { id: "all", label: "All Projects" },
  { id: "identity", label: "Identity" },
  { id: "editorial", label: "Editorial" },
  { id: "artworks", label: "Artworks" },
];

function inGroup(item: Work, id: "all" | Group) {
  return id === "all" || item.groups.includes(id);
}

export function Gallery({ items, showFilters = false }: { items: Work[]; showFilters?: boolean }) {
  const railRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const active = filters.find((entry) => entry.id === filter) ?? filters[0];
  const visible = items.filter((item) => inGroup(item, active.id)).slice().sort(newestFirst);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const fit = () => {
      const width = rail.parentElement?.clientWidth ?? window.innerWidth;
      const image = 220;
      const cols = width >= 1500 ? 5 : width >= 1140 ? 4 : width >= 780 ? 3 : width >= 520 ? 2 : 1;
      const gap = (width - cols * image) / (cols + 1);
      rail.style.setProperty("--cols", String(cols));
      rail.style.setProperty("--gap", `${gap}px`);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(rail.parentElement ?? rail);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {showFilters ? (
        <div className="filters" role="group" aria-label="Filter projects">
          {filters.map((entry) => {
            const count = items.filter((item) => inGroup(item, entry.id)).length;
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={filter === entry.id}
                onClick={() => setFilter(entry.id)}
              >
                {entry.label} ({count})
              </button>
            );
          })}
        </div>
      ) : null}
      {visible.length === 0 ? (
        <p className="empty">Nothing in this group yet.</p>
      ) : (
        <div className="rail" ref={railRef}>
          {visible.map((item, index) => {
            const cover = coverImage(item);
            return (
              <article className="card" key={item.slug}>
                <Link href={`/projects/${item.slug}`}>
                  <span className="index">{pad(index + 1)}.</span>
                  <img src={cover?.src} alt={cover?.alt ?? item.title} loading="eager" decoding="async" />
                  <h2>{item.title}</h2>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
