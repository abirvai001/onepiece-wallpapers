export const ARC_CATEGORIES = [
  { name: "East Blue Saga", slug: "east-blue", description: "Where Luffy's journey begins" },
  { name: "Alabasta", slug: "alabasta", description: "Desert kingdom and Baroque Works" },
  { name: "Skypiea", slug: "skypiea", description: "The sky island adventure" },
  { name: "Water 7", slug: "water-7", description: "Galley-La and CP9 intrigue" },
  { name: "Enies Lobby", slug: "enies-lobby", description: "Declare war on the World Government" },
  { name: "Thriller Bark", slug: "thriller-bark", description: "Ghost ship and shadows" },
  { name: "Sabaody Archipelago", slug: "sabaody", description: "The worst generation gathers" },
  { name: "Marineford", slug: "marineford", description: "The Paramount War" },
  { name: "Fish-Man Island", slug: "fish-man-island", description: "Underwater kingdom of Ryugu" },
  { name: "Dressrosa", slug: "dressrosa", description: "Gladiators and the birdcage" },
  { name: "Whole Cake Island", slug: "whole-cake", description: "Big Mom's sweet territory" },
  { name: "Wano Country", slug: "wano", description: "Land of samurai and liberation" },
  { name: "Egghead", slug: "egghead", description: "Dr. Vegapunk's futuristic island" },
] as const;

export const CHARACTER_CATEGORIES = [
  { name: "Monkey D. Luffy", slug: "luffy", description: "Future Pirate King" },
  { name: "Roronoa Zoro", slug: "zoro", description: "Swordsman of the Straw Hats" },
  { name: "Nami", slug: "nami", description: "Navigator of the crew" },
  { name: "Usopp", slug: "usopp", description: "Sniper and brave warrior" },
  { name: "Sanji", slug: "sanji", description: "Cook of the Straw Hats" },
  { name: "Tony Tony Chopper", slug: "chopper", description: "Doctor of the crew" },
  { name: "Nico Robin", slug: "robin", description: "Archaeologist and historian" },
  { name: "Franky", slug: "franky", description: "Shipwright and cyborg" },
  { name: "Brook", slug: "brook", description: "Musician and soul king" },
  { name: "Jinbe", slug: "jinbe", description: "Helmsman of the Thousand Sunny" },
  { name: "Shanks", slug: "shanks", description: "Emperor of the Sea" },
  { name: "Ace", slug: "ace", description: "Fire Fist of the Whitebeard Pirates" },
  { name: "Law", slug: "law", description: "Surgeon of Death" },
  { name: "Kid", slug: "kid", description: "Captain of the Kid Pirates" },
  { name: "Yamato", slug: "yamato", description: "Oden's will lives on" },
] as const;

export const SPECIAL_CATEGORIES = [
  { name: "Trending", slug: "trending", description: "Most popular wallpapers right now" },
  { name: "Recently Added", slug: "recent", description: "Fresh wallpapers from the Grand Line" },
] as const;

export const DEVICE_CATEGORIES = [
  {
    name: "Mobile Wallpapers",
    slug: "mobile",
    description: "Portrait wallpapers optimized for phones and tablets",
  },
  {
    name: "Desktop Wallpapers",
    slug: "desktop",
    description: "Wide-screen wallpapers for PC, laptop, and ultrawide monitors",
  },
] as const;

export const SITE_CONFIG = {
  name: "opwalls",
  tagline: "Premium One Piece wallpapers for every screen",
  xHandle: "@abirphotomail",
  xUrl: "https://x.com/abirphotomail",
  email: "abirodroid.admob@gmail.com",
  sponsorshipNote:
    "Interested in sponsorship or advertising? Reach out via X or email below.",
} as const;