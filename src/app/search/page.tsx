import { prisma } from "@/lib/prisma";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { Search } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const wallpapers = query
    ? await prisma.wallpaper.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query } },
            { artistName: { contains: query } },
            { description: { contains: query } },
            { categories: { some: { category: { name: { contains: query } } } } },
          ],
        },
        include: { categories: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
        take: 48,
      })
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="section-title mb-6 flex items-center gap-2">
        <Search className="h-7 w-7 text-gold" />
        Search Wallpapers
      </h1>

      <form className="mb-10">
        <div className="flex gap-3">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search by title, artist, arc, or character..."
            className="admin-input flex-1 text-base"
          />
          <button type="submit" className="action-btn action-btn-primary shrink-0">
            Search
          </button>
        </div>
      </form>

      {query ? (
        <>
          <p className="mb-6 text-sm text-parchment/60">
            {wallpapers.length} result{wallpapers.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
          <WallpaperGrid
            wallpapers={wallpapers}
            emptyMessage={`No wallpapers found for "${query}"`}
          />
        </>
      ) : (
        <p className="text-center text-parchment/50">Enter a search term to find wallpapers.</p>
      )}
    </div>
  );
}