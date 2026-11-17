import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectTitle } from "@/components/ProjectTitle";
import { getWork, works, type Picture } from "@/lib/content";

function Media({ item, className, loading }: { item: Picture; className?: string; loading?: "eager" | "lazy" }) {
  if (item.type === "video") {
    return <video className={className} src={item.src} autoPlay loop muted playsInline preload="metadata" />;
  }
  return <img className={className} src={item.src} alt={item.alt} loading={loading} decoding="async" />;
}

type Params = { slug: string };

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const work = getWork(slug);
  return { title: work ? work.title : "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  const back = "/projects";
  const [hero, ...flow] = work.images;
  const slots = ["slot-a", "slot-b", "slot-c", "slot-d"];
  const paragraphs = work.description.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <main className="piece">
      <Link className="piece-close" href={back}>
        Close
      </Link>
      <header className="piece-top">
        <div className="piece-stage">
          <div className="piece-title-slot">
            <ProjectTitle>{work.title}</ProjectTitle>
          </div>
          <div className="piece-lead">
            {hero ? <Media className="piece-hero" item={hero} /> : null}
          </div>
          {work.script ? <p className="piece-form">{work.script}</p> : <span />}
        </div>
        <div className="piece-copy">
          {paragraphs.map((paragraph) => (
            <p className="piece-desc" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </header>
      <div className="piece-flow">
        {flow.map((image, index) => (
          <figure
            className={`piece-photo ${slots[index % slots.length]}${image.src.endsWith("/08.jpg") && work.slug === "premome-2026" ? " piece-logo" : ""}`}
            key={`${image.src}-${index}`}
          >
            <Media item={image} loading="eager" />
          </figure>
        ))}
      </div>
    </main>
  );
}
