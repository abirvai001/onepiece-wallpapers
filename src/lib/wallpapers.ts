import { prisma } from "@/lib/prisma";

export type WallpaperWithCategories = Awaited<
  ReturnType<typeof getWallpaperBySlug>
>;

export async function getTrendingWallpapers(limit = 12) {
  return prisma.wallpaper.findMany({
    where: { published: true, isTrending: true },
    include: { categories: { include: { category: true } } },
    orderBy: [{ viewCount: "desc" }, { downloadCount: "desc" }],
    take: limit,
  });
}

export async function getRecentWallpapers(limit = 12) {
  return prisma.wallpaper.findMany({
    where: { published: true },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getWallpapersByCategorySlug(slug: string, limit = 24) {
  if (slug === "trending") {
    return getTrendingWallpapers(limit);
  }
  if (slug === "recent") {
    return getRecentWallpapers(limit);
  }

  return prisma.wallpaper.findMany({
    where: {
      published: true,
      categories: { some: { category: { slug } } },
    },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getWallpaperBySlug(slug: string) {
  return prisma.wallpaper.findUnique({
    where: { slug },
    include: { categories: { include: { category: true } } },
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: [{ type: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function incrementViewCount(id: string) {
  return prisma.wallpaper.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

export async function incrementDownloadCount(id: string) {
  return prisma.wallpaper.update({
    where: { id },
    data: { downloadCount: { increment: 1 } },
  });
}