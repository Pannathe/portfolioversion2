"use client";

import { useState } from "react";

export function DownloadPortfolio() {
  const [state, setState] = useState<"idle" | "working" | "error">("idle");

  return (
    <button
      type="button"
      className="download-portfolio"
      disabled={state === "working"}
      onClick={() => {
        setState("working");
        import("@/lib/portfolio-pdf")
          .then(({ downloadPortfolio }) => downloadPortfolio())
          .then(() => setState("idle"))
          .catch(() => setState("error"));
      }}
    >
      {state === "working" ? "Preparing portfolio…" : state === "error" ? "Try again" : "Download portfolio"}
    </button>
  );
}
