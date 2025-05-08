-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'IWLAG',
    "siteDescription" TEXT NOT NULL DEFAULT 'Empowering women through education and support',
    "contactEmail" TEXT NOT NULL DEFAULT 'contact@empowertogether.org',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "backupFrequency" TEXT NOT NULL DEFAULT 'weekly',
    "cacheLifetime" INTEGER NOT NULL DEFAULT 3600,
    "debugMode" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "donationAlerts" BOOLEAN NOT NULL DEFAULT true,
    "volunteerAlerts" BOOLEAN NOT NULL DEFAULT true,
    "contactFormAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
