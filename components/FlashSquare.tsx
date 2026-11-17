"use client";

import { useEffect, useState } from "react";

const HOLD = 300;

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function FlashSquare({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(images[0] ?? "");
  const sequence = images.join("|");

  useEffect(() => {
    const list = sequence ? sequence.split("|") : [];
    list.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    if (list.length < 2) return;

    let cancelled = false;
    let index = 0;

    const run = async () => {
      while (!cancelled) {
        await wait(HOLD);
        if (cancelled) return;

        const next = list[(index + 1) % list.length];
        await preload(next);
        if (cancelled) return;

        setCurrent(next);
        index = (index + 1) % list.length;
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [sequence]);

  if (!images.length) return null;

  return (
    <div className="flash-square" aria-hidden="true">
      <img src={current} alt="" />
    </div>
  );
}
