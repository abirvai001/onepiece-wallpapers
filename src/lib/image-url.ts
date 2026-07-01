/** Public URL for a wallpaper image (uses API route for reliable Railway serving). */
export function getWallpaperImageUrl(imagePath: string): string {
  if (imagePath.startsWith("uploads/")) {
    const filename = imagePath.slice("uploads/".length);
    return `/api/media/${encodeURIComponent(filename)}`;
  }
  return imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
}