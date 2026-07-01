import "server-only";
import fs from "fs";
import path from "path";

/** Production upload directory (Railway volume mount path). */
export const PRODUCTION_UPLOADS_DIR = "/var/lib/postgresql/data";

/**
 * Returns the absolute path to the uploads directory.
 */
export function getUploadsDir(): string {
  if (process.env.UPLOADS_DIR) {
    return process.env.UPLOADS_DIR;
  }

  if (process.env.NODE_ENV === "production") {
    return PRODUCTION_UPLOADS_DIR;
  }

  // Local dev
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * Returns candidate directories to look for an uploaded wallpaper file.
 */
export function getCandidateUploadDirs(): string[] {
  const primary = getUploadsDir();
  const cwd = process.cwd();
  const candidates = [primary];

  const fallbacks = [
    path.join(cwd, "public", "uploads"),
    path.join(cwd, ".next", "standalone", "public", "uploads"),
    PRODUCTION_UPLOADS_DIR,
  ];

  for (const dir of fallbacks) {
    if (!candidates.includes(dir)) candidates.push(dir);
  }

  return candidates;
}

/** Ensure the uploads directory exists (called before writing). */
export async function ensureUploadsDir(): Promise<string> {
  const dir = getUploadsDir();
  await fs.promises.mkdir(dir, { recursive: true });
  return dir;
}