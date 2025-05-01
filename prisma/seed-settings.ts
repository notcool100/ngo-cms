import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if settings already exist
  const existingSettings = await prisma.siteSettings.findFirst();
  
  if (!existingSettings) {
    // Create default settings
    await prisma.siteSettings.create({
      data: {
        siteName: "Empower Together",
        siteDescription: "Empowering women through education and support",
        contactEmail: "contact@empowertogether.org",
        maintenanceMode: false,
        backupFrequency: "weekly",
        cacheLifetime: 3600,
        debugMode: false,
        emailNotifications: true,
        donationAlerts: true,
        volunteerAlerts: true,
        contactFormAlerts: true,
      },
    });
    
    console.log('Default site settings created');
  } else {
    console.log('Site settings already exist, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });