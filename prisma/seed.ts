import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Status string constants — mirrors the values used in the app
const STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
} as const;

async function main() {
  console.log("🌱 Seeding database…");

  const DEMO_USER_ID = "demo-user-001"; // matches DEMO_USER.id in lib/auth.ts

  // Create a couple of sample generation records for the demo user
  await prisma.generation.createMany({
    data: [
      {
        userId: DEMO_USER_ID,
        originalRoomUrl:
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        tileUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        generatedImageUrl:
          "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800",
        status: STATUS.DONE,
      },
      {
        userId: DEMO_USER_ID,
        originalRoomUrl:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
        tileUrl:
          "https://images.unsplash.com/photo-1615529179035-e760f6a2dcee?w=400",
        generatedImageUrl: null,
        status: STATUS.FAILED,
        errorMessage: "Gemini API key not configured during demo seed.",
      },
    ],
  });

  console.log("✅ Created sample generations for demo-user-001");
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
