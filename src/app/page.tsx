import Link from "next/link";
import { ChevronRight, Flame, Clock, Smartphone, Monitor } from "lucide-react";
import { WallpaperGrid } from "@/components/WallpaperGrid";
import { CategoryCard } from "@/components/CategoryCard";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import {
  getTrendingWallpapers,
  getRecentWallpapers,
  getAllCategories,
} from "@/lib/wallpapers";
import { SITE_CONFIG } from "@/lib/categories";

export default async function HomePage() {
  const [trending, recent, categories] = await Promise.all([
    getTrendingWallpapers(6),
    getRecentWallpapers(6),
    getAllCategories(),
  ]);

  const deviceCategories = categories.filter((c) => c.type === "device");
  const arcCategories = categories.filter((c) => c.type === "arc");
  const characterCategories = categories.filter((c) => c.type === "character");

  return (
    <div>
      <section className="hero-gradient relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-straw-hat blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-luffy-red blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-gold">
            Set Sail for Epic Wallpapers
          </p>
          <h1 className="font-display text-5xl font-bold text-parchment sm:text-7xl">
            {SITE_CONFIG.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-parchment/80">
            {SITE_CONFIG.tagline}. Browse by arc, character, trending picks, and the
            latest additions from across the Grand Line.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/category/mobile" className="action-btn action-btn-primary">
              <Smartphone className="h-4 w-4" />
              Mobile
            </Link>
            <Link href="/category/desktop" className="action-btn action-btn-primary">
              <Monitor className="h-4 w-4" />
              Desktop
            </Link>
            <Link href="/category/trending" className="action-btn action-btn-secondary">
              <Flame className="h-4 w-4" />
              Trending
            </Link>
            <Link href="/category/recent" className="action-btn action-btn-secondary">
              <Clock className="h-4 w-4" />
              Recent
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AdPlaceholder variant="banner" />
      </div>

      <section id="devices" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="section-title mb-8 flex items-center gap-2">
          <Smartphone className="h-7 w-7 text-gold" />
          Browse by Screen
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {deviceCategories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Flame className="h-7 w-7 text-straw-hat" />
              Trending Wallpapers
            </h2>
          </div>
          <Link
            href="/category/trending"
            className="flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <WallpaperGrid
          wallpapers={trending}
          emptyMessage="No trending wallpapers yet. Admin can mark wallpapers as trending!"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Clock className="h-7 w-7 text-gold" />
              Recently Added
            </h2>
          </div>
          <Link
            href="/category/recent"
            className="flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <WallpaperGrid wallpapers={recent} />
      </section>

      <section id="arcs" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="section-title mb-8">Browse by Arc</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {arcCategories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <AdPlaceholder variant="inline" />
      </div>

      <section id="characters" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="section-title mb-8">Browse by Character</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {characterCategories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </section>
    </div>
  );
}