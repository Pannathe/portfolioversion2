import { FlashSquare } from "@/components/FlashSquare";
import Link from "next/link";
import { coverImage, featured, flashImages, newestFirst } from "@/lib/content";

const notes = [
  {
    kind: "note" as const,
    id: "attention",
    script: "attention",
    place: "note-left",
    body: "Design is a decision about how something should exist. It is attention made visible: the edge of a page, the weight of an object, the pause between two pictures.",
  },
  {
    kind: "note" as const,
    id: "matter",
    script: "why it matters",
    place: "note-right",
    body: "People live inside design. A room, a poster, a tool — each one teaches how to move, what to notice, and what can be left alone. Care in those choices is a form of respect.",
  },
  {
    kind: "note" as const,
    id: "hold",
    script: "a quiet hold",
    place: "note-center",
    body: "Good design does not need to shout. It holds a feeling long enough for someone else to recognize it, and then it gets out of the way.",
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
