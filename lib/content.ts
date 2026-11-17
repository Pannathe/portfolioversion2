import { flashImages, works } from "./works";

export type Group = "identity" | "editorial" | "artworks";
export type Section = "project" | "object";

export type Picture = {
  src: string;
  alt: string;
  type?: "image" | "video";
};

export type Work = {
  slug: string;
  title: string;
  script: string;
  section: Section;
  groups: Group[];
  year: string;
  description: string;
  featured: boolean;
  images: Picture[];
};

export const site = {
  name: "Panna Drenko",
  year: 2026,
  roles: ["Designer", "Art director", "Photographer"],
  welcome: "Welcome.",
  about: [
    "I’m Panna Drenkó, a graphic designer working across visual identities, editorial design and art direction, with a particular interest in cultural and fashion-related projects. My work ranges from publications and book covers to moving image and digital design.",
    "Alongside graphic design, I maintain an ongoing artistic practice involving video, symbols and spatial installations. I’m interested in experimenting with organic forms as well as exploring feminist literature. These interests often find their way into my design work.",
    "Based between Budapest and The Hague.",
  ],
  education: [
    "BA Graphic Design, Royal Academy of Art, The Hague (KABK), 2026",
    "Classical Painting Studio, 2019",
  ],
  experience: ["PreMOME Internship, 2025"],
  collaborations: ["F46", "PreMOME", "Flora Filmhuis", "KABK Green Office"],
  contactIntro: [
    "Available for selected graphic design commissions, creative direction, and collaborative projects across culture, fashion, and publishing.",
    "Full PDF portfolio and CV available upon request. Feel free to reach out for project inquiries.",
  ],
  contacts: [
    { label: "Email", value: "drenkopanna@gmail.com", href: "mailto:drenkopanna@gmail.com" },
    { label: "Instagram", value: "@pannadrenko", href: "https://instagram.com/pannadrenko" },
    { label: "Location", value: "Budapest / The Hague" },
  ],
  clients: [
    "Sample Studio",
    "Field Journal",
    "Atelier North",
    "Paper Room",
    "Daylight",
    "Soft Goods",
  ],
  instagram: "https://instagram.com/pannadrenko",
};

export { flashImages, works };

export const featured = works.filter((work) => work.featured);

export function worksIn(section: Section) {
  return works.filter((work) => work.section === section);
}

export function getWork(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function coverImage(work: Work) {
  return work.images.find((image) => image.type !== "video") ?? work.images[0];
}

export function newestFirst(a: Work, b: Work) {
  const year = (value: string) => {
    const found = value.match(/\d{4}/g);
    if (!found) return 0;
    return Math.max(...found.map(Number));
  };
  return year(b.year) - year(a.year);
}
