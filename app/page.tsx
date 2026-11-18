import { FlashSquare } from "@/components/FlashSquare";
import Link from "next/link";
import { coverImage, featured, flashImages, newestFirst } from "@/lib/content";

const notes = [
  {
    kind: "note" as const,
    id: "direction",
    script: "Direction",
    place: "note-left",
    body: "I’m Panna Drenkó, a graphic designer and art director shaping visual identities, publications, and digital campaigns for fashion labels, cultural spaces, and independent publishers.",
  },
  {
    kind: "note" as const,
    id: "process",
    script: "Process",
    place: "note-right",
    body: "My practice translates ideas into brands, printed matter, and graphic languages through a research-based approach, creating work that draws attention and tells a personal story across physical and digital screens.",
  },
  {
    kind: "note" as const,
    id: "identity",
    script: "Identity",
    place: "note-center",
    body: "Informed by an ongoing practice in video art, image-making, and installations, where visual research is translated into cohesive, intentional design solutions.",
  },
];

const places = ["drift-left", "drift-right", "drift-mid", "drift-far", "drift-low", "drift-edge"];

export default function HomePage() {
  const pictures = [...featured].sort(newestFirst).map((work, index) => ({
    kind: "picture" as const,
    slug: work.slug,
    title: work.title,
    place: places[index % places.length],
    image: coverImage(work),
  }));

  const sequence: Array<(typeof pictures)[number] | (typeof notes)[number]> = pictures.flatMap((picture, index) => {
    const next: Array<(typeof pictures)[number] | (typeof notes)[number]> = [picture];
    if (index === 0) next.push(notes[0]);
    if (index === 2) next.push(notes[1]);
    if (index === 4) next.push(notes[2]);
    return next;
  });

  return (
    <main>
      <section className="flash-screen">
        <FlashSquare images={flashImages} />
      </section>
      <div className="field">
        {sequence.map((item) =>
          item.kind === "picture" ? (
            <Link
              className={`drift ${item.place}`}
              href={`/projects/${item.slug}`}
              aria-label={item.title}
              key={item.slug}
            >
              <img src={item.image?.src} alt={item.image?.alt ?? item.title} loading="eager" decoding="async" />
            </Link>
          ) : (
            <section className={`note ${item.place}`} key={item.id}>
              <p className="script">{item.script}</p>
              <p>{item.body}</p>
            </section>
          ),
        )}
      </div>
    </main>
  );
}
