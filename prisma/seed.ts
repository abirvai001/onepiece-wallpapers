import "dotenv/config";
import bcrypt from "bcryptjs";
import { createPrismaClient } from "../src/lib/create-prisma-client";
import {
  ARC_CATEGORIES,
  CHARACTER_CATEGORIES,
  SPECIAL_CATEGORIES,
  DEVICE_CATEGORIES,
} from "../src/lib/categories";

const prisma = createPrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@grandlinewallpapers.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Captain Admin",
    },
  });

  const categories = [
    ...SPECIAL_CATEGORIES.map((c, i) => ({
      ...c,
      type: "special",
      sortOrder: i,
    })),
    ...DEVICE_CATEGORIES.map((c, i) => ({
      ...c,
      type: "device",
      sortOrder: i,
    })),
    ...ARC_CATEGORIES.map((c, i) => ({
      ...c,
      type: "arc",
      sortOrder: i,
    })),
    ...CHARACTER_CATEGORIES.map((c, i) => ({
      ...c,
      type: "character",
      sortOrder: i,
    })),
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        type: category.type,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
  console.log("Change ADMIN_PASSWORD in production!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });