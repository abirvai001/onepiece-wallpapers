import fs from "fs";
import path from "path";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatResolution(width: number, height: number): string {
  return `${width} × ${height}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Returns the absolute path to the uploads directory.
 * In production standalone builds, Next's minimal server serves from .next/standalone/public
 * so we write runtime uploads there to ensure they are served at /uploads/* and survive deploys via volume.
 */
export function getUploadsDir(): string {
  const cwd = process.cwd();
  // Standalone production layout (after our build copy)
  if (
    process.env.NODE_ENV === "production" &&
    fs.existsSync(path.join(cwd, ".next", "standalone", "server.js"))
  ) {
    return path.join(cwd, ".next", "standalone", "public", "uploads");
  }
  // Dev, normal next start, Dockerfile layouts etc.
  return path.join(cwd, "public", "uploads");
}