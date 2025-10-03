// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding providers...");

  // Create the essential providers that Better-Auth expects
  const providers = [
    {
      providerId: "credential",
      name: "Credential",
      type: "credential",
      enabled: true,
    },
    {
      providerId: "google",
      name: "Google",
      type: "oauth",
      enabled: true,
    },
    {
      providerId: "facebook",
      name: "Facebook",
      type: "oauth",
      enabled: true,
    },
  ];

  for (const providerData of providers) {
    await prisma.provider.upsert({
      where: { providerId: providerData.providerId },
      update: providerData,
      create: providerData,
    });
    console.log(`✅ Created provider: ${providerData.providerId}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
