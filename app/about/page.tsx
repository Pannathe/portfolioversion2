import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

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
