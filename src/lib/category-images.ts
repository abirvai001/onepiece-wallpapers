/** Themed background image per category slug — files live in /public/categories/ */
export const CATEGORY_IMAGES: Record<string, string> = {
  // Special
  trending: "/categories/trending.webp",
  recent: "/categories/recent.webp",
  // Device
  mobile: "/categories/mobile.webp",
  desktop: "/categories/desktop.webp",
  // Arcs
  "east-blue": "/categories/east-blue.webp",
  alabasta: "/categories/alabasta.webp",
  skypiea: "/categories/skypiea.webp",
  "water-7": "/categories/water-7.webp",
  "enies-lobby": "/categories/enies-lobby.webp",
  "thriller-bark": "/categories/thriller-bark.webp",
  sabaody: "/categories/sabaody.webp",
  marineford: "/categories/marineford.webp",
  "fish-man-island": "/categories/fish-man-island.webp",
  dressrosa: "/categories/dressrosa.webp",
  "whole-cake": "/categories/whole-cake.webp",
  wano: "/categories/wano.webp",
  egghead: "/categories/egghead.webp",
  // Characters
  luffy: "/categories/luffy.webp",
  zoro: "/categories/zoro.webp",
  nami: "/categories/nami.webp",
  usopp: "/categories/usopp.webp",
  sanji: "/categories/sanji.webp",
  chopper: "/categories/chopper.webp",
  robin: "/categories/robin.webp",
  franky: "/categories/franky.webp",
  brook: "/categories/brook.webp",
  jinbe: "/categories/jinbe.webp",
  shanks: "/categories/shanks.webp",
  ace: "/categories/ace.webp",
  law: "/categories/law.webp",
  kid: "/categories/kid.webp",
  yamato: "/categories/yamato.webp",
};

export function getCategoryImage(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? "/categories/default.webp";
}