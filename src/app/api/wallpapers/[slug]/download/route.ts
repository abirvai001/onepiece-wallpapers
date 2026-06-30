import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getWallpaperBySlug, incrementDownloadCount } from "@/lib/wallpapers";
import { getUploadsDir } from "@/lib/utils";

function getCandidateUploadDirs(): string[] {
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);

  if (!wallpaper || !wallpaper.published) {
    return NextResponse.json({ error: "Wallpaper not found" }, { status: 404 });
  }

  const basename = path.basename(wallpaper.imagePath);
  const candidates = getCandidateUploadDirs();
  let file: Buffer | null = null;
  for (const dir of candidates) {
    try {
      file = await readFile(path.join(dir, basename));
      break;
    } catch {
      // try next candidate
    }
  }

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  await incrementDownloadCount(wallpaper.id);

  const ext = path.extname(wallpaper.imagePath).slice(1) || "jpg";
  const filename = `${wallpaper.slug}.${ext}`;

  return new NextResponse(file, {
    headers: {
      "Content-Type": `image/${ext === "jpg" ? "jpeg" : ext}`,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}