import type { Metadata } from "next";
import { site } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Panna Drenkó is a graphic designer working across visual identities, editorial design, art direction, publications, moving image, and digital design.",
  path: "/about/",
});

const facts = [
  { title: "Education", items: site.education },
  { title: "Experience", items: site.experience },
  { title: "Selected collaborations", items: site.collaborations },
];

export default function AboutPage() {
  return (
    <main className="info about">
      <section className="about-copy">
        {site.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <aside className="aside about-facts">
        {facts.map((fact) => (
          <section key={fact.title}>
            <h2>{fact.title}</h2>
            <ul>
              {fact.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </aside>
    </main>
  );
}
