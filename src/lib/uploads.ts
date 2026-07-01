import "server-only";
import fs from "fs";
import path from "path";

/**
 * Production upload directory — mount Railway volume HERE (not under public/).
 * Mounting a volume on public/uploads breaks Next.js (lost+found EACCES).
 */
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

  return path.join(process.cwd(), "public", "uploads");
}

/**
 * Returns candidate directories to look for an uploaded wallpaper file.
 */
export function getCandidateUploadDirs(): string[] {
  const primary = getUploadsDir();
  const candidates = [primary];

  // Dev-only fallbacks — never scan public/uploads in production (volume lost+found breaks Next.js)
  if (process.env.NODE_ENV !== "production") {
    const cwd = process.cwd();
    const devFallbacks = [
      path.join(cwd, "public", "uploads"),
      path.join(cwd, ".next", "standalone", "public", "uploads"),
    ];
    for (const dir of devFallbacks) {
      if (!candidates.includes(dir)) candidates.push(dir);
    }
  }

  return candidates;
}

/** Ensure the uploads directory exists (called before writing). */
export async function ensureUploadsDir(): Promise<string> {
  const dir = getUploadsDir();
  await fs.promises.mkdir(dir, { recursive: true });
  return dir;
}