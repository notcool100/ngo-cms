import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface SiteSettings {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

interface UseSettingsReturn {
  settings: SiteSettings | null;
  isLoading: boolean;
  error: string | null;
  updateGeneralSettings: (data: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
  }) => Promise<void>;
  updateNotificationSettings: (data: {
    emailNotifications: boolean;
    donationAlerts: boolean;
    volunteerAlerts: boolean;
    contactFormAlerts: boolean;
  }) => Promise<void>;
  updateAdvancedSettings: (data: {
    backupFrequency: string;
    cacheLifetime: number;
    debugMode: boolean;
  }) => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/settings");
        
        if (!response.ok) {
          throw new Error("Failed to fetch settings");
        }
        
        const data = await response.json();
        setSettings(data.settings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSettings();
  }, []);

  const updateGeneralSettings = async (data: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings?type=general", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update general settings");
      }
      
      const result = await response.json();
      setSettings(result.settings);
      
      toast({
        title: "Success",
        description: "General settings updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to update general settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationSettings = async (data: {
    emailNotifications: boolean;
    donationAlerts: boolean;
    volunteerAlerts: boolean;
    contactFormAlerts: boolean;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings?type=notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update notification settings");
      }
      
      const result = await response.json();
      setSettings(result.settings);
      
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdvancedSettings = async (data: {
    backupFrequency: string;
    cacheLifetime: number;
    debugMode: boolean;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings?type=advanced", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update advanced settings");
      }
      
      const result = await response.json();
      setSettings(result.settings);
      
      toast({
        title: "Success",
        description: "Advanced settings updated successfully",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to update advanced settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateGeneralSettings,
    updateNotificationSettings,
    updateAdvancedSettings,
  };
}