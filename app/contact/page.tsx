import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="contact-stage">
      <img className="contact-flower" src="/contact/flower.png" alt="" />
      <section className="contact-copy">
        {site.contactIntro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {site.contacts.map((contact) => (
          <div className="contact-row" key={contact.label}>
            <h2>{contact.label}</h2>
            {contact.href ? <a href={contact.href}>{contact.value}</a> : <p>{contact.value}</p>}
          </div>
        ))}
      </section>
      <img className="contact-flower contact-flower-mirror" src="/contact/flower.png" alt="" />
    </main>
  );
}
