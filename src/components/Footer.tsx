import Link from "next/link";
import { Anchor, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/categories";
import { XContactLink } from "@/components/XContactLink";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/20 bg-wood-pattern">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Anchor className="h-5 w-5 text-gold" />
              <span className="font-display text-lg font-bold text-parchment">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-parchment/70">
              {SITE_CONFIG.tagline}. Set sail with high-resolution wallpapers from every
              arc and every crew member across the Grand Line.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-gold">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-parchment/70">
              <li>
                <Link href="/category/trending" className="hover:text-gold">
                  Trending Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/category/recent" className="hover:text-gold">
                  Recently Added
                </Link>
              </li>
              <li>
                <Link href="/category/mobile" className="hover:text-gold">
                  Mobile Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/category/desktop" className="hover:text-gold">
                  Desktop Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/category/wano" className="hover:text-gold">
                  Wano Arc
                </Link>
              </li>
              <li>
                <Link href="/category/luffy" className="hover:text-gold">
                  Luffy Collection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-gold">
              Contact & Sponsorship
            </h3>
            <p className="mb-4 text-sm text-parchment/70">{SITE_CONFIG.sponsorshipNote}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-parchment">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-xs font-bold text-gold">
                  𝕏
                </span>
                <XContactLink className="text-parchment" />
              </div>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 text-sm text-parchment transition hover:text-gold"
              >
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span>{SITE_CONFIG.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="ad-placeholder mt-10">
          <p className="text-xs uppercase tracking-widest text-parchment/40">
            Sponsorship & Ad Space Available
          </p>
          <p className="mt-1 text-sm text-parchment/60">
            Contact <XContactLink className="text-gold" /> for advertising opportunities
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-8 text-center text-xs text-parchment/50 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. One Piece © Eiichiro Oda /
            Shueisha / Toei Animation.
          </p>
          <p>Fan-made wallpaper gallery. Not affiliated with official One Piece.</p>
        </div>
      </div>
    </footer>
  );
}