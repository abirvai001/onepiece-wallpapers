import Link from "next/link";
import Image from "next/image";
import { Download, Eye, TrendingUp, Smartphone, Monitor } from "lucide-react";
import { formatResolution } from "@/lib/utils";

type WallpaperCardProps = {
  slug: string;
  title: string;
  imagePath: string;
  width: number;
  height: number;
  artistName: string;
  isTrending?: boolean;
  viewCount?: number;
  downloadCount?: number;
  deviceSlug?: "mobile" | "desktop" | null;
};

export function WallpaperCard({
  slug,
  title,
  imagePath,
  width,
  height,
  artistName,
  isTrending,
  viewCount = 0,
  downloadCount = 0,
  deviceSlug,
}: WallpaperCardProps) {
  const isPortrait = height > width;
  const aspectClass = deviceSlug === "mobile" || (deviceSlug === undefined && isPortrait)
    ? "aspect-[9/16] max-h-[420px]"
    : "aspect-[16/10]";

  return (
    <Link href={`/wallpaper/${slug}`} className="wallpaper-card group">
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <Image
          src={`/${imagePath}`}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {deviceSlug && (
            <span className="flex items-center gap-1 rounded-full bg-navy/80 px-2.5 py-1 text-xs font-bold text-parchment backdrop-blur-sm">
              {deviceSlug === "mobile" ? (
                <Smartphone className="h-3 w-3 text-gold" />
              ) : (
                <Monitor className="h-3 w-3 text-gold" />
              )}
              {deviceSlug === "mobile" ? "Mobile" : "Desktop"}
            </span>
          )}
          {isTrending && (
            <span className="flex items-center gap-1 rounded-full bg-straw-hat px-2.5 py-1 text-xs font-bold text-navy">
              <TrendingUp className="h-3 w-3" />
              Trending
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-lg font-bold text-parchment line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-gold/90">by {artistName}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-gold/10 bg-navy/60 px-4 py-2.5 text-xs text-parchment/60">
        <span>{formatResolution(width, height)}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {downloadCount}
          </span>
        </div>
      </div>
    </Link>
  );
}