import { jsPDF } from "jspdf";
import { flashImages, newestFirst, site, works, type Work } from "./content";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 16;
const CONTENT_W = PAGE_W - MARGIN * 2;
const MAX_PROJECT_PAGES = 3;

const pt = (points: number) => (points * 25.4) / 72;

function bufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

async function registerFonts(pdf: jsPDF) {
  const files: [string, string, string][] = [
    ["SpaceGrotesk-Regular.ttf", "Grotesk", "normal"],
    ["SpaceGrotesk-Medium.ttf", "Grotesk", "medium"],
    ["IBMPlexMono-Regular.ttf", "Mono", "normal"],
    ["IBMPlexMono-Medium.ttf", "Mono", "medium"],
  ];
  for (const [file, family, style] of files) {
    const response = await fetch(`/fonts/${file}`);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    pdf.addFileToVFS(file, bufferToBase64(await response.arrayBuffer()));
    pdf.addFont(file, family, style, "Identity-H");
  }
}

type Jpeg = { data: string; w: number; h: number };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

async function toJpeg(src: string, square: boolean): Promise<Jpeg | null> {
  try {
    const image = await loadImage(src);
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const cropW = square ? side : image.naturalWidth;
    const cropH = square ? side : image.naturalHeight;
    const sx = square ? (image.naturalWidth - side) / 2 : 0;
    const sy = square ? (image.naturalHeight - side) / 2 : 0;
    const longest = Math.max(cropW, cropH);
    const scale = Math.min(1, (square ? 700 : 1400) / longest);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(cropW * scale));
    canvas.height = Math.max(1, Math.round(cropH * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
    return { data: canvas.toDataURL("image/jpeg", 0.72), w: canvas.width, h: canvas.height };
  } catch {
    return null;
  }
}

class Portfolio {
  pdf: jsPDF;
  y = MARGIN;
  projectPages = 0;
  inProject = false;

  constructor(pdf: jsPDF) {
    this.pdf = pdf;
  }

  font(family: "Grotesk" | "Mono", style: "normal" | "medium", points: number) {
    this.pdf.setFont(family, style);
    this.pdf.setFontSize(pt(points));
  }

  breakPage() {
    if (this.inProject && this.projectPages >= MAX_PROJECT_PAGES) return false;
    this.pdf.addPage();
    this.y = MARGIN;
    if (this.inProject) this.projectPages += 1;
    return true;
  }

  room(height: number) {
    if (this.y + height <= PAGE_H - MARGIN) return true;
    return this.breakPage();
  }

  gap(height: number) {
    if (this.y + height <= PAGE_H - MARGIN) this.y += height;
  }

  paragraph(
    text: string,
    family: "Grotesk" | "Mono",
    style: "normal" | "medium",
    points: number,
    leading: number,
    width = CONTENT_W,
  ) {
    this.font(family, style, points);
    const lines = this.pdf.splitTextToSize(text, width) as string[];
    const lineHeight = pt(leading);
    const ascent = pt(points) * 0.82;
    for (const line of lines) {
      if (!this.room(lineHeight)) return false;
      this.pdf.text(line, MARGIN, this.y + ascent);
      this.y += lineHeight;
    }
    return true;
  }

  image(jpeg: Jpeg) {
    const fit = (limit: number) => {
      const ratio = jpeg.w / jpeg.h;
      let width = CONTENT_W;
      let height = width / ratio;
      if (height > limit) {
        height = limit;
        width = height * ratio;
      }
      return { width, height };
    };
    const size = fit(118);
    if (this.y + size.height > PAGE_H - MARGIN && !this.breakPage()) return false;
    const x = MARGIN + (CONTENT_W - size.width) / 2;
    this.pdf.addImage(jpeg.data, "JPEG", x, this.y, size.width, size.height);
    this.y += size.height;
    return true;
  }
}

async function drawCover(doc: Portfolio) {
  doc.y = 28;
  doc.paragraph(site.name, "Grotesk", "medium", 28, 32);
  doc.gap(2);
  doc.paragraph("Portfolio", "Mono", "normal", 11, 14);
  doc.y = 62;

  const columns = 5;
  const gap = 3.2;
  const cell = (CONTENT_W - gap * (columns - 1)) / columns;
  const squares = await Promise.all(flashImages.map((src) => toJpeg(src, true)));

  squares.forEach((square, index) => {
    if (!square) return;
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = MARGIN + column * (cell + gap);
    const y = doc.y + row * (cell + gap);
    doc.pdf.addImage(square.data, "JPEG", x, y, cell, cell);
  });
}

function drawAbout(doc: Portfolio) {
  doc.pdf.addPage();
  doc.y = MARGIN;
  doc.inProject = false;

  doc.paragraph("About", "Mono", "medium", 11, 14);
  doc.gap(8);
  for (const paragraph of site.about) {
    doc.paragraph(paragraph, "Grotesk", "normal", 11, 15.5);
    doc.gap(4);
  }

  const sections: [string, string[]][] = [
    ["Education", site.education],
    ["Experience", site.experience],
    ["Selected collaborations", site.collaborations],
  ];
  for (const [title, items] of sections) {
    doc.gap(6);
    doc.paragraph(title, "Mono", "medium", 11, 14);
    doc.gap(3);
    for (const item of items) {
      doc.paragraph(item, "Grotesk", "normal", 11, 15.5);
    }
  }
}

async function drawProject(doc: Portfolio, work: Work) {
  doc.pdf.addPage();
  doc.y = MARGIN;
  doc.inProject = true;
  doc.projectPages = 1;

  doc.paragraph(work.title, "Grotesk", "medium", 18, 22);
  if (work.script) {
    doc.gap(2);
    doc.paragraph(work.script, "Mono", "normal", 10, 13);
  }
  doc.gap(6);
  for (const paragraph of work.description.split(/\n\n+/)) {
    const text = paragraph.trim();
    if (!text) continue;
    if (!doc.paragraph(text, "Grotesk", "normal", 10.5, 14.6)) break;
    doc.gap(3.2);
  }

  const pictures = work.images.filter((image) => image.type !== "video");
  for (const picture of pictures) {
    const jpeg = await toJpeg(picture.src, false);
    if (!jpeg) continue;
    doc.gap(5);
    if (!doc.image(jpeg)) break;
  }
  doc.inProject = false;
}

export async function downloadPortfolio() {
  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  await registerFonts(pdf);
  pdf.setTextColor(0, 0, 0);
  const doc = new Portfolio(pdf);
  await drawCover(doc);
  drawAbout(doc);
  const ordered = works.slice().sort(newestFirst);
  for (const work of ordered) {
    await drawProject(doc, work);
  }
  pdf.save("Panna Drenko Portfolio.pdf");
}
