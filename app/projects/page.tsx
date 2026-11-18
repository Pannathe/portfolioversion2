import type { Metadata } from "next";
import { Gallery } from "@/components/Gallery";
import { works } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Explore Panna Drenkó’s selected projects in visual identity, editorial design, publications, art direction, video, and spatial installation.",
  path: "/projects/",
});

export default function ProjectsPage() {
  return (
    <main>
      <Gallery items={works} showFilters />
    </main>
  );
}
