"use client";

import { Download } from "lucide-react";

type DownloadButtonProps = {
  slug: string;
  title: string;
};

export function DownloadButton({ slug, title }: DownloadButtonProps) {
  return (
    <a
      href={`/api/wallpapers/${slug}/download`}
      download={`${title}.jpg`}
      className="action-btn action-btn-primary"
    >
      <Download className="h-4 w-4" />
      Download Wallpaper
    </a>
  );
}