import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getCategoryImage } from "@/lib/category-images";

type CategoryCardProps = {
  name: string;
  slug: string;
  description?: string | null;
  type: string;
};

export function CategoryCard({ name, slug, description, type }: CategoryCardProps) {
  const bgImage = getCategoryImage(slug);

  return (
    <Link
      href={`/category/${slug}`}
      className="group relative min-h-[160px] overflow-hidden rounded-xl border border-gold/20 transition hover:border-gold hover:shadow-lg hover:shadow-gold/15"
    >
      <Image
        src={bgImage}
        alt=""
        fill
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover transition duration-500 group-hover:scale-105"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30 transition group-hover:via-navy/60" />
      <div
        className={`absolute inset-0 opacity-30 mix-blend-overlay ${
          type === "character"
            ? "bg-luffy-red"
            : type === "special"
              ? "bg-straw-hat"
              : type === "device"
                ? slug === "mobile"
                  ? "bg-ocean"
                  : "bg-luffy-red"
                : "bg-ocean"
        }`}
      />

      <div className="relative flex h-full min-h-[160px] flex-col justify-end p-5">
        <h3 className="font-display text-lg font-bold text-parchment drop-shadow-md">
          {name}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-parchment/80 line-clamp-2 drop-shadow">
            {description}
          </p>
        )}
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold">
          View wallpapers
          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}