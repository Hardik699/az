import { useEffect, useState } from "react";
import DatabaseError from "@/pages/DatabaseError";

interface DBStatus {
  connected: boolean;
  error?: string;
}

export function AppWithDBCheck({ children }: { children: React.ReactNode }) {
  const [dbStatus, setDBStatus] = useState<DBStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDBStatus = async () => {
      try {
        const response = await fetch("/api/db-status");
        const data = await response.json();
        setDBStatus(data);
      } catch (error) {
        console.error("Failed to check DB status:", error);
        setDBStatus({
          connected: false,
          error: "Failed to check database connection status",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check immediately
    checkDBStatus();

    // Recheck every 10 seconds
    const interval = setInterval(checkDBStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show error page if database is not connected
  if (!dbStatus?.connected) {
    return <DatabaseError />;
  }

  // Show app if database is connected
  return <>{children}</>;
}
