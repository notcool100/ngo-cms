"use client";

import { useEffect, useState } from "react";
import { useSiteSettings } from "@/lib/contexts/site-settings-context";
import { Loader2 } from "lucide-react";

interface SiteSettingsLoaderProps {
  children: React.ReactNode;
}

export function SiteSettingsLoader({ children }: SiteSettingsLoaderProps) {
  const { isLoading, error } = useSiteSettings();
  const [showLoader, setShowLoader] = useState(true);

  // Only show the loader for a short time to prevent flashing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading && showLoader) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading site settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading site settings:", error);
  }

  return <>{children}</>;
}