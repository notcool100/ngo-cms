"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  backupFrequency: string;
  cacheLifetime: number;
  debugMode: boolean;
  emailNotifications: boolean;
  donationAlerts: boolean;
  volunteerAlerts: boolean;
  contactFormAlerts: boolean;
}

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
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
};

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  isLoading: false,
  error: null,
  refreshSettings: async () => {},
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings/public");
      
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      
      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error("Error fetching site settings:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      // Use default settings if we can't fetch from the server
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SiteSettingsContext.Provider
      value={{
        settings,
        isLoading,
        error,
        refreshSettings,
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}