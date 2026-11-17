#!/usr/bin/env python3
"""Resize portfolio media and write lib/works.ts."""

import json
import re
import shutil
import subprocess
from pathlib import Path

SRC = Path("/Volumes/LaCie/portfolio_images")
ROOT = Path("/Users/pannadrenko/portfolioversion2")
PROJECTS = ROOT / "public" / "projects"
FLASH = ROOT / "public" / "flash"

PROJECTS_META = [
    ("Best Dutch Book Design Cataloge", "best-dutch-book-design", "Best Dutch Book Design Catalogue", "2024"),
    ("Folklore Riso", "folklore-riso", "Folklore Riso", "2025"),
    ("Heresies Visual Research", "heresies-visual-research", "Heresies Visual Research", "2025"),
    ("Inner Labyrinth", "inner-labyrinth", "Inner Labyrinth", "2025"),
    ("Office Siren ", "office-siren", "Office Siren", "2025"),
    ("PAZAR Books", "pazar-books", "PAZAR Books", "2025"),
    ("Sneaking", "sneaking", "Sneaking", "2025"),
    ("The Instinctive Being", "the-instinctive-being", "The Instinctive Being", "2025"),
    ("To Be Looked At With Care", "to-be-looked-at-with-care", "To Be Looked At With Care", "2025"),
    ("flower language", "flower-language", "Flower Language", "2025"),
    ("organic forms researh", "organic-forms-research", "Organic Forms Research", "2025"),
    ("premome 2025", "premome-2025", "Premome 2025", "2025"),
    ("premome2026", "premome-2026", "Premome 2026", "2026"),
    ("stamp system", "stamp-system", "Stamp System", "2025"),
    ("transcription", "transcription", "Transcription", "2025"),
]

IMAGE_EXT = {".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG", ".webp", ".tif", ".tiff"}
VIDEO_EXT = {".mp4", ".mov", ".MP4", ".MOV"}
PDF_EXT = {".pdf"}

GROUPS = {
    "best-dutch-book-design": ["editorial"],
    "heresies-visual-research": ["editorial"],
    "pazar-books": ["editorial"],
    "stamp-system": ["editorial"],
    "transcription": ["editorial"],
    "office-siren": ["identity", "artworks"],
    "sneaking": ["identity", "artworks"],
    "flower-language": ["identity"],
    "premome-2025": ["identity"],
    "premome-2026": ["identity"],
    "inner-labyrinth": ["artworks"],
    "to-be-looked-at-with-care": ["artworks"],
    "organic-forms-research": ["artworks"],
}


def last_number(path: Path):
    stem = re.sub(r"\s*\(\d+\)$", "", path.stem)
    stem = re.sub(r"@\d+x$", "", stem, flags=re.IGNORECASE)
    nums = re.findall(r"\d+", stem)
    return int(nums[-1]) if nums else None


def sort_files(files):
    has_one = any(last_number(path) == 1 for path in files)

    def key(path: Path):
        number = last_number(path)
        if number is None:
            return (0 if not has_one else 2, path.name.lower())
        return (1, number, path.name.lower())

    return sorted(files, key=key)


def media_files(folder: Path):
    files = []
    for path in folder.iterdir():
        if not path.is_file():
            continue
        if path.name.startswith("._") or path.name == ".DS_Store":
            continue
        if path.suffix in IMAGE_EXT | VIDEO_EXT | PDF_EXT:
            files.append(path)
    return sort_files(files)


def to_jpeg(source: Path, dest: Path, longest: int):
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "sips",
            "-s",
            "format",
            "jpeg",
            "-s",
            "formatOptions",
            "80",
            "-Z",
            str(longest),
            str(source),
            "--out",
            str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )


def to_mp4(source: Path, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(source),
            "-vf",
            "scale='min(1600,iw)':-2",
            "-c:v",
            "libx264",
            "-crf",
            "26",
            "-preset",
            "fast",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            "-an",
            str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def main():
    if PROJECTS.exists():
        shutil.rmtree(PROJECTS)
    if FLASH.exists():
        shutil.rmtree(FLASH)
    old_images = ROOT / "public" / "images"
    if old_images.exists():
        shutil.rmtree(old_images)
    PROJECTS.mkdir(parents=True)
    FLASH.mkdir(parents=True)

    works = []
    for folder_name, slug, title, year in PROJECTS_META:
        folder = SRC / folder_name
        files = media_files(folder)
        images = []
        for index, source in enumerate(files, start=1):
            if source.suffix in VIDEO_EXT:
                dest_name = f"{index:02d}.mp4"
                print(f"video {title} {source.name}", flush=True)
                to_mp4(source, PROJECTS / slug / dest_name)
                media_type = "video"
            else:
                dest_name = f"{index:02d}.jpg"
                print(f"image {title} {source.name}", flush=True)
                to_jpeg(source, PROJECTS / slug / dest_name, 1800)
                media_type = "image"
            images.append(
                {
                    "src": f"/projects/{slug}/{dest_name}",
                    "alt": title,
                    "type": media_type,
                }
            )
        works.append(
            {
                "slug": slug,
                "title": title,
                "script": "",
                "section": "project",
                "groups": GROUPS.get(slug, []),
                "year": year,
                "description": "",
                "featured": True,
                "images": images,
            }
        )

    flash = []
    for index, source in enumerate(media_files(SRC / "square"), start=1):
        dest_name = f"{index:02d}.jpg"
        print(f"square {source.name}", flush=True)
        to_jpeg(source, FLASH / dest_name, 800)
        flash.append(f"/flash/{dest_name}")

    work_lines = ["import type { Work } from \"./content\";", "", "export const works: Work[] = ["]
    for work in works:
        image_lines = []
        for image in work["images"]:
            image_lines.append(
                "      { "
                + f"src: {js_string(image['src'])}, alt: {js_string(image['alt'])}, type: {js_string(image['type'])}"
                + " },"
            )
        work_lines.append("  {")
        work_lines.append(f"    slug: {js_string(work['slug'])},")
        work_lines.append(f"    title: {js_string(work['title'])},")
        work_lines.append('    script: "",')
        work_lines.append('    section: "project",')
        group_list = ", ".join(json.dumps(group) for group in work["groups"])
        work_lines.append(f"    groups: [{group_list}],")
        work_lines.append(f"    year: {js_string(work['year'])},")
        work_lines.append('    description: "",')
        work_lines.append("    featured: true,")
        work_lines.append("    images: [")
        work_lines.extend(image_lines)
        work_lines.append("    ],")
        work_lines.append("  },")
    work_lines.append("];")
    work_lines.append("")
    work_lines.append("export const flashImages = [")
    for src in flash:
        work_lines.append(f"  {js_string(src)},")
    work_lines.append("];")
    work_lines.append("")
    (ROOT / "lib" / "works.ts").write_text("\n".join(work_lines), encoding="utf-8")
    print(f"projects {len(works)} flash {len(flash)}", flush=True)


if __name__ == "__main__":
    main()
