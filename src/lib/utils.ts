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
  const isProd = process.env.NODE_ENV === "production";

  // Docker standalone layout (standard Dockerfile + many Railway setups)
  // After COPY --from=builder /app/.next/standalone ./   → server.js lives at cwd/server.js
  if (isProd && fs.existsSync(path.join(cwd, "server.js"))) {
    return path.join(cwd, "public", "uploads");
  }

  // Alternative subdir standalone layout (some nixpacks / custom setups)
  if (isProd && fs.existsSync(path.join(cwd, ".next", "standalone", "server.js"))) {
    return path.join(cwd, ".next", "standalone", "public", "uploads");
  }

  // Local dev + fallback
  return path.join(cwd, "public", "uploads");
}