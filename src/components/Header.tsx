import Link from "next/link";
import { Anchor, Search } from "lucide-react";
import { SITE_CONFIG } from "@/lib/categories";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/20 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold bg-straw-hat shadow-lg shadow-gold/20 transition group-hover:scale-105">
            <Anchor className="h-5 w-5 text-navy" />
          </div>
          <div>
            <p className="font-display text-xl font-bold tracking-wide text-parchment sm:text-2xl">
              {SITE_CONFIG.name}
            </p>
            <p className="hidden text-xs text-gold/80 sm:block">One Piece Wallpapers · opwalls</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/category/trending" className="nav-link">
            Trending
          </Link>
          <Link href="/category/recent" className="nav-link">
            Recent
          </Link>
          <Link href="/category/mobile" className="nav-link">
            Mobile
          </Link>
          <Link href="/category/desktop" className="nav-link">
            Desktop
          </Link>
          <Link href="/#arcs" className="nav-link">
            Arcs
          </Link>
          <Link href="/#characters" className="nav-link">
            Characters
          </Link>
        </nav>

        <Link
          href="/search"
          className="flex items-center gap-2 rounded-full border border-gold/30 bg-ocean/40 px-4 py-2 text-sm text-parchment transition hover:border-gold hover:bg-ocean/60"
        >
          <Search className="h-4 w-4 text-gold" />
          <span className="hidden sm:inline">Search</span>
        </Link>
      </div>
    </header>
  );
}