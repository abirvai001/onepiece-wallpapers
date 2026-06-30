"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, TrendingUp, Eye, EyeOff } from "lucide-react";
import { formatResolution } from "@/lib/utils";

type Wallpaper = {
  id: string;
  slug: string;
  title: string;
  imagePath: string;
  width: number;
  height: number;
  artistName: string;
  isTrending: boolean;
  published: boolean;
  viewCount: number;
  downloadCount: number;
};

type AdminWallpaperListProps = {
  wallpapers: Wallpaper[];
};

export function AdminWallpaperList({ wallpapers }: AdminWallpaperListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function updateWallpaper(id: string, data: Record<string, unknown>) {
    setLoadingId(id);
    await fetch(`/api/admin/wallpapers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoadingId(null);
    router.refresh();
  }

  async function deleteWallpaper(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setLoadingId(id);
    await fetch(`/api/admin/wallpapers/${id}`, { method: "DELETE" });
    setLoadingId(null);
    router.refresh();
  }

  if (wallpapers.length === 0) {
    return (
      <p className="text-center text-parchment/60 py-8">
        No wallpapers published yet. Upload your first one above!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {wallpapers.map((wp) => (
        <div
          key={wp.id}
          className={`flex gap-4 rounded-xl border border-gold/20 bg-navy/40 p-4 ${loadingId === wp.id ? "opacity-50" : ""}`}
        >
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={`/${wp.imagePath}`}
              alt={wp.title}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/wallpaper/${wp.slug}`}
              className="font-display text-lg font-bold text-parchment hover:text-gold"
            >
              {wp.title}
            </Link>
            <p className="text-xs text-parchment/60">
              by {wp.artistName} · {formatResolution(wp.width, wp.height)} · {wp.viewCount} views · {wp.downloadCount} downloads
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => updateWallpaper(wp.id, { isTrending: !wp.isTrending })}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${wp.isTrending ? "bg-straw-hat text-navy" : "border border-gold/30 text-parchment"}`}
              >
                <TrendingUp className="h-3 w-3" />
                {wp.isTrending ? "Trending" : "Set Trending"}
              </button>
              <button
                onClick={() => updateWallpaper(wp.id, { published: !wp.published })}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${wp.published ? "border border-green-500/50 text-green-400" : "border border-red-500/50 text-red-400"}`}
              >
                {wp.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {wp.published ? "Published" : "Hidden"}
              </button>
              <button
                onClick={() => deleteWallpaper(wp.id, wp.title)}
                className="flex items-center gap-1 rounded-full border border-luffy-red/50 px-3 py-1 text-xs font-semibold text-luffy-red hover:bg-luffy-red/10"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}