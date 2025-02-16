import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import type { UserRole } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RequireAuth({ children, allowedRoles }: RequireAuthProps) {
  const [, setLocation] = useLocation();
  const { currentUser, isLoading } = useAuth();
  useEffect(() => {
    const path = window.location.pathname;
    console.log("RequireAuth effect:", { 
      isLoading, 
      hasUser: !!currentUser,
      userRole: currentUser?.role,
      allowedRoles,
      path
    });

    if (!isLoading) {
      if (!currentUser && path !== "/login") {
        console.log("No authenticated user, redirecting to login");
        setLocation("/login");
      } else if (currentUser && allowedRoles && !allowedRoles.includes(currentUser.role)) {
        console.log("User role not allowed, redirecting to dashboard");
        setLocation("/dashboard");
      }
    }
  }, [currentUser, isLoading, allowedRoles, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Don't render protected content if user is not authenticated
  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}