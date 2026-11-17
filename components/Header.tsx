"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/content";

const links = [
  { href: "/projects", label: "Projects," },
  { href: "/about", label: "About," },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/">{site.name}</Link>
      <nav className="site-nav" aria-label="Primary">
        {links.map((link) => {
          const current = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href} aria-current={current ? "page" : undefined}>
              {link.label}
            </Link>
          );
        })}
      </nav>
      <span />
    </header>
  );
}
