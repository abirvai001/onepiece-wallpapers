import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <MapPinOff className="mb-6 h-16 w-16 text-gold" />
      <h1 className="font-display text-4xl font-bold text-parchment">Lost at Sea</h1>
      <p className="mt-3 max-w-md text-parchment/70">
        This page doesn&apos;t exist on the Grand Line. The wallpaper you&apos;re looking for may have sailed away.
      </p>
      <Link href="/" className="action-btn action-btn-primary mt-8">
        Return to Home
      </Link>
    </div>
  );
}