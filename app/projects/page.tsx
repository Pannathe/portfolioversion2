import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { works } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main>
      <Gallery items={works} showFilters />
    </main>
  );
}
