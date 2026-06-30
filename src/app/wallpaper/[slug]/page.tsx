import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Maximize, Eye, Download, Calendar, Tag, Smartphone, Monitor } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import { ShareButton } from "@/components/ShareButton";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import {
  getWallpaperBySlug,
  incrementViewCount,
} from "@/lib/wallpapers";
import { formatResolution, formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);
  if (!wallpaper) return { title: "Wallpaper Not Found" };

  return {
    title: wallpaper.title,
    description: `${wallpaper.title} — One Piece wallpaper by ${wallpaper.artistName}. ${formatResolution(wallpaper.width, wallpaper.height)}.`,
    openGraph: {
      images: [`/${wallpaper.imagePath}`],
    },
  };
}

export default async function WallpaperPage({ params }: PageProps) {
  const { slug } = await params;
  const wallpaper = await getWallpaperBySlug(slug);

  if (!wallpaper || !wallpaper.published) {
    notFound();
  }

  await incrementViewCount(wallpaper.id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const shareUrl = `${siteUrl}/wallpaper/${wallpaper.slug}`;
  const deviceCategory = wallpaper.categories.find((c) => c.category.type === "device");
  const isMobile = deviceCategory?.category.slug === "mobile";
  const previewAspect = isMobile ? "aspect-[9/16] max-h-[80vh] mx-auto" : "aspect-video w-full";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="wanted-poster overflow-hidden rounded-xl">
            <div className={`relative ${previewAspect}`}>
              <Image
                src={`/${wallpaper.imagePath}`}
                alt={wallpaper.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-contain"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <DownloadButton slug={wallpaper.slug} title={wallpaper.title} />
            <ShareButton title={wallpaper.title} url={shareUrl} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gold/20 bg-navy/60 p-6">
            <h1 className="font-display text-3xl font-bold text-parchment">
              {wallpaper.title}
            </h1>
            {wallpaper.description && (
              <p className="mt-3 text-sm leading-relaxed text-parchment/70">
                {wallpaper.description}
              </p>
            )}

            <dl className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                    Artist
                  </dt>
                  <dd className="text-parchment">
                    {wallpaper.artistUrl ? (
                      <a
                        href={wallpaper.artistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gold hover:underline"
                      >
                        {wallpaper.artistName}
                      </a>
                    ) : (
                      wallpaper.artistName
                    )}
                  </dd>
                </div>
              </div>

              {deviceCategory && (
                <div className="flex items-start gap-3">
                  {isMobile ? (
                    <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  )}
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                      Screen Type
                    </dt>
                    <dd className="text-parchment">
                      <Link
                        href={`/category/${deviceCategory.category.slug}`}
                        className="hover:text-gold hover:underline"
                      >
                        {deviceCategory.category.name}
                      </Link>
                    </dd>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Maximize className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                    Resolution
                  </dt>
                  <dd className="text-parchment">
                    {formatResolution(wallpaper.width, wallpaper.height)}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Eye className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                    Views
                  </dt>
                  <dd className="text-parchment">{wallpaper.viewCount + 1}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Download className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                    Downloads
                  </dt>
                  <dd className="text-parchment">{wallpaper.downloadCount}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                    Added
                  </dt>
                  <dd className="text-parchment">{formatDate(wallpaper.createdAt)}</dd>
                </div>
              </div>

              {wallpaper.categories.length > 0 && (
                <div className="flex items-start gap-3">
                  <Tag className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-gold/70">
                      Categories
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-2">
                      {wallpaper.categories.map(({ category }) => (
                        <Link
                          key={category.slug}
                          href={`/category/${category.slug}`}
                          className="rounded-full border border-gold/30 bg-ocean/40 px-3 py-1 text-xs text-parchment transition hover:border-gold"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          <AdPlaceholder variant="sidebar" />
        </aside>
      </div>
    </div>
  );
}