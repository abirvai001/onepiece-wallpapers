import { notFound } from "next/navigation";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import {
  getWallpapersByCategorySlug,
  getCategoryBySlug,
} from "@/lib/wallpapers";
import { SPECIAL_CATEGORIES } from "@/lib/categories";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const special = SPECIAL_CATEGORIES.find((c) => c.slug === slug);
  const category = special ? null : await getCategoryBySlug(slug);
  const name = special?.name ?? category?.name ?? "Category";

  return {
    title: `${name} Wallpapers`,
    description: special?.description ?? category?.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const special = SPECIAL_CATEGORIES.find((c) => c.slug === slug);
  const category = special ? null : await getCategoryBySlug(slug);

  if (!special && !category) {
    notFound();
  }

  const wallpapers = await getWallpapersByCategorySlug(slug);
  const title = special?.name ?? category!.name;
  const description = special?.description ?? category!.description;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-gold">Category</p>
        <h1 className="font-display mt-2 text-4xl font-bold text-parchment sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-parchment/70">{description}</p>
        )}
        <p className="mt-2 text-sm text-parchment/50">
          {wallpapers.length} wallpaper{wallpapers.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <WallpaperGrid wallpapers={wallpapers} />
        <aside className="hidden lg:block">
          <AdPlaceholder variant="sidebar" />
        </aside>
      </div>
    </div>
  );
}