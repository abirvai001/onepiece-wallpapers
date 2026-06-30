import { WallpaperCard } from "@/components/WallpaperCard";

type WallpaperCategory = {
  category: { slug: string; type: string };
};

type Wallpaper = {
  slug: string;
  title: string;
  imagePath: string;
  width: number;
  height: number;
  artistName: string;
  isTrending: boolean;
  viewCount: number;
  downloadCount: number;
  categories?: WallpaperCategory[];
};

type WallpaperGridProps = {
  wallpapers: Wallpaper[];
  emptyMessage?: string;
};

function getDeviceSlug(categories?: WallpaperCategory[]): "mobile" | "desktop" | null {
  const device = categories?.find((c) => c.category.type === "device");
  if (device?.category.slug === "mobile" || device?.category.slug === "desktop") {
    return device.category.slug;
  }
  return null;
}

export function WallpaperGrid({
  wallpapers,
  emptyMessage = "No wallpapers found yet. Check back soon!",
}: WallpaperGridProps) {
  if (wallpapers.length === 0) {
    return (
      <div className="wanted-poster rounded-xl p-12 text-center">
        <p className="font-display text-xl text-parchment/70">{emptyMessage}</p>
        <p className="mt-2 text-sm text-parchment/50">
          The Grand Line is vast — new treasures arrive regularly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.slug}
          {...wallpaper}
          deviceSlug={getDeviceSlug(wallpaper.categories)}
        />
      ))}
    </div>
  );
}