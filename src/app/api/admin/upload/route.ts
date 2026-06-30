import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getUploadsDir } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const title = (formData.get("title") as string)?.trim();
    const artistName = (formData.get("artistName") as string)?.trim();
    const artistUrl = (formData.get("artistUrl") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim() || null;
    const isTrending = formData.get("isTrending") === "true";
    const deviceCategoryId = (formData.get("deviceCategoryId") as string)?.trim();
    const categoryIds = formData.getAll("categoryIds") as string[];

    if (!file || !title || !artistName) {
      return NextResponse.json(
        { error: "Title, artist name, and image are required" },
        { status: 400 }
      );
    }

    if (!deviceCategoryId) {
      return NextResponse.json(
        { error: "Select Mobile or Desktop screen type" },
        { status: 400 }
      );
    }

    const deviceCategory = await prisma.category.findUnique({
      where: { id: deviceCategoryId },
    });

    if (!deviceCategory || deviceCategory.type !== "device") {
      return NextResponse.json(
        { error: "Invalid screen type selected" },
        { status: 400 }
      );
    }

    const allCategoryIds = [...categoryIds, deviceCategoryId];

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP images are allowed" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Could not read image dimensions" },
        { status: 400 }
      );
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const baseSlug = slugify(title);
    const uniqueSuffix = Date.now().toString(36);
    const filename = `${baseSlug}-${uniqueSuffix}.${ext}`;
    const uploadDir = getUploadsDir();
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    let slug = baseSlug;
    const existing = await prisma.wallpaper.findUnique({ where: { slug } });
    if (existing) slug = `${baseSlug}-${uniqueSuffix}`;

    const wallpaper = await prisma.wallpaper.create({
      data: {
        title,
        slug,
        description,
        imagePath: `uploads/${filename}`,
        width: metadata.width,
        height: metadata.height,
        artistName,
        artistUrl,
        isTrending,
        published: true,
        categories: {
          create: allCategoryIds.map((categoryId) => ({ categoryId })),
        },
      },
      include: { categories: { include: { category: true } } },
    });

    return NextResponse.json(wallpaper, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}