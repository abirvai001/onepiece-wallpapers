import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "categories");

/** [slug, [color1, color2, accent]] — thematic One Piece arc/character palettes */
const THEMES = {
  trending: ["#c41e3a", "#f5c518", "#ff6b35"],
  recent: ["#1b3a5c", "#0e4d92", "#4fc3f7"],
  mobile: ["#1565c0", "#0d47a1", "#82b1ff"],
  desktop: ["#283593", "#1a237e", "#8c9eff"],
  "east-blue": ["#1565c0", "#0d47a1", "#64b5f6"],
  alabasta: ["#e65100", "#bf360c", "#ffcc80"],
  skypiea: ["#5c6bc0", "#3949ab", "#fff59d"],
  "water-7": ["#0277bd", "#01579b", "#80deea"],
  "enies-lobby": ["#b71c1c", "#1a237e", "#ffffff"],
  "thriller-bark": ["#4a148c", "#1b5e20", "#ce93d8"],
  sabaody: ["#ec407a", "#880e4f", "#f8bbd0"],
  marineford: ["#c62828", "#37474f", "#ffab91"],
  "fish-man-island": ["#00695c", "#004d40", "#80cbc4"],
  dressrosa: ["#d32f2f", "#ff6f00", "#ffab91"],
  "whole-cake": ["#f06292", "#ad1457", "#fce4ec"],
  wano: ["#b71c1c", "#4a148c", "#f48fb1"],
  egghead: ["#00acc1", "#4527a0", "#84ffff"],
  luffy: ["#d32f2f", "#f9a825", "#ffeb3b"],
  zoro: ["#2e7d32", "#1b5e20", "#a5d6a7"],
  nami: ["#ef6c00", "#e65100", "#ffcc80"],
  usopp: ["#795548", "#4e342e", "#a1887f"],
  sanji: ["#1565c0", "#0d47a1", "#ffeb3b"],
  chopper: ["#ec407a", "#f48fb1", "#ffffff"],
  robin: ["#6a1b9a", "#4a148c", "#e1bee7"],
  franky: ["#0277bd", "#ff6f00", "#4fc3f7"],
  brook: ["#212121", "#424242", "#e0e0e0"],
  jinbe: ["#00695c", "#004d40", "#b2dfdb"],
  shanks: ["#b71c1c", "#1a237e", "#ef9a9a"],
  ace: ["#e65100", "#bf360c", "#ffab40"],
  law: ["#ffd600", "#f9a825", "#212121"],
  kid: ["#d32f2f", "#212121", "#ff5252"],
  yamato: ["#ffffff", "#b71c1c", "#e3f2fd"],
  default: ["#0d1b2a", "#1b3a5c", "#d4a017"],
};

async function createImage(slug, [c1, c2, accent]) {
  const width = 640;
  const height = 360;
  const label = slug.replace(/-/g, " ").toUpperCase();

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${c1}"/>
          <stop offset="100%" style="stop-color:${c2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="70%" cy="30%" r="50%">
          <stop offset="0%" style="stop-color:${accent};stop-opacity:0.45"/>
          <stop offset="100%" style="stop-color:${accent};stop-opacity:0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#glow)"/>
      <circle cx="520" cy="80" r="120" fill="${accent}" opacity="0.12"/>
      <circle cx="80" cy="280" r="90" fill="${accent}" opacity="0.08"/>
      <path d="M0,${height} L${width},${height - 40} L${width},${height} Z" fill="#0d1b2a" opacity="0.35"/>
      <text x="32" y="${height - 24}" font-family="Georgia, serif" font-size="13" fill="${accent}" opacity="0.7" letter-spacing="3">${label}</text>
    </svg>
  `;

  const outPath = path.join(outDir, `${slug}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(outPath);
}

await mkdir(outDir, { recursive: true });

for (const [slug, colors] of Object.entries(THEMES)) {
  await createImage(slug, colors);
  console.log(`Created ${slug}.webp`);
}

console.log("Done — category images generated.");