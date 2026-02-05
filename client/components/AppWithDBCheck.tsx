import { useEffect, useState } from "react";
import DatabaseError from "@/pages/DatabaseError";

interface DBStatus {
  connected: boolean;
  error?: string;
}

export function AppWithDBCheck({ children }: { children: React.ReactNode }) {
  const [dbStatus, setDBStatus] = useState<DBStatus | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkDBStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("/api/db-status", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await response.json();
        setDBStatus(data);
      } catch (error) {
        console.error("Failed to check DB status:", error);
        setDBStatus({
          connected: false,
          error: "Failed to connect to the database. Please check your connection.",
        });
      } finally {
        setHasChecked(true);
      }
    };

    // Check immediately with a short delay
    const timer = setTimeout(checkDBStatus, 100);

    // Recheck every 15 seconds in the background
    const interval = setInterval(checkDBStatus, 15000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Show error page ONLY if we've checked and database is not connected
  if (hasChecked && !dbStatus?.connected) {
    return <DatabaseError />;
  }

  // Show app - either still loading or database is connected
  return <>{children}</>;
}
