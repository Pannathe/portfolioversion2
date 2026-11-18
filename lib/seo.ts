import type { Metadata } from "next";
import { site } from "./content";

const shareImage = {
  url: "/share.png",
  width: 1200,
  height: 630,
  alt: `${site.name} portfolio`,
};
const shareSiteName = `${site.name} Design Portfolio`;

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${shareSiteName}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: shareSiteName,
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
  };
}

export function createDescriptionExcerpt(text: string, maxLength = 160) {
  const firstParagraph = text.split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
  if (firstParagraph.length <= maxLength) return firstParagraph;

  const excerpt = firstParagraph.slice(0, maxLength - 1);
  const lastSpace = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, lastSpace > 0 ? lastSpace : excerpt.length)}…`;
}
