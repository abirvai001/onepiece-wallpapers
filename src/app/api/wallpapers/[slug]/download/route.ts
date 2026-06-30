import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getWallpaperBySlug, incrementDownloadCount } from "@/lib/wallpapers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);

  if (!wallpaper || !wallpaper.published) {
    return NextResponse.json({ error: "Wallpaper not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public", wallpaper.imagePath);

  try {
    const file = await readFile(filePath);
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
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}