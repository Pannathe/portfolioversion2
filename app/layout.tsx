import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScrollSquare } from "@/components/ScrollSquare";
import { site } from "@/lib/content";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
});

const grotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-grotesk",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const title = `${site.name} Design Portfolio`;
const description =
  "Graphic designer and art director Panna Drenkó creates visual identities, publications, and digital campaigns for fashion labels, cultural spaces, and independent publishers.";

export const metadata: Metadata = {
  metadataBase: new URL("https://pannadrenko.com"),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description,
  alternates: { canonical: "/" },
  authors: [{ name: "Panna Drenkó", url: "https://pannadrenko.com/about/" }],
  creator: "Panna Drenkó",
  publisher: site.name,
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: title,
    type: "website",
    images: [{ url: "/share.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} ${grotesk.variable} ${serif.variable}`}>
      <body suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <ScrollSquare />
      </body>
    </html>
  );
}
