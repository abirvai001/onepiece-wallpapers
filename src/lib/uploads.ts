import "server-only";
import fs from "fs";
import path from "path";

/**
 * Returns the absolute path to the uploads directory.
 * Handles different production layouts (Dockerfile standalone vs some nixpacks setups).
 */
export function getUploadsDir(): string {
  const cwd = process.cwd();
  const isProd = process.env.NODE_ENV === "production";

  // Docker standalone layout (recommended Dockerfile)
  // After COPY --from=builder /app/.next/standalone ./  → server.js lives at /app/server.js
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

/**
 * Returns candidate directories to look for an uploaded wallpaper file.
 * Used as fallback during transition between different deployment layouts.
 */
export function getCandidateUploadDirs(): string[] {
  const primary = getUploadsDir();
  const cwd = process.cwd();
  const legacy = path.join(cwd, "public", "uploads");
  const candidates = [primary];
  if (legacy !== primary) candidates.push(legacy);
  // Also try the standalone public directly as another fallback
  const standaloneLegacy = path.join(cwd, ".next", "standalone", "public", "uploads");
  if (!candidates.includes(standaloneLegacy)) candidates.push(standaloneLegacy);
  return candidates;
}
