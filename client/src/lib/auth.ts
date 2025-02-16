import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auth, getRedirectResult } from "./firebase";
import type { User } from "@shared/schema";
import { useLocation } from "wouter";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Set up Firebase auth state listener
  useEffect(() => {
    console.log("🔵 Setting up Firebase auth state listener and checking redirect result...");


    const handleRedirect = async () => {
      console.log("🔵 Checking for redirect result...");
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          console.log("🟢 Redirect sign-in successful! User:", result.user);
        } else {
          console.log("🟡 No redirect result user.");
        }
      } catch (error) {
        console.error("🔴 Error handling redirect result:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🟢 Auth state changed:", firebaseUser ? "user logged in" : "no user");
      if (firebaseUser) {
        try {
          // Get the ID token and set it in the request
          const token = await firebaseUser.getIdToken();
          const headers = { Authorization: `Bearer ${token}` };

          // Update the user data in React Query cache
          await queryClient.fetchQuery({
            queryKey: ["/api/auth/me"],
            queryFn: async () => {
              console.log("🟢 Fetching user data from API...");
              const res = await fetch("/api/auth/me", { headers });
              if (!res.ok) {
                console.error("Failed to fetch user:", await res.text());
                throw new Error("Failed to fetch user");
              }
              return res.json();
            },
          });

          // Redirect to dashboard if we're on the login page
          if (window.location.pathname === "/login") {
            setLocation("/dashboard");
          }
        } catch (error) {
          console.error("🔴 Error in auth state change handler:", error);
          queryClient.clear();
        }
      } else {
        console.log("🟡 Clearing query cache - no user.");
        queryClient.clear();
      }
    });

    handleRedirect()

    return () => unsubscribe();
  }, [queryClient, setLocation]);
  

  const { data: currentUser, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    enabled: !!auth.currentUser,
  });

  return {
    currentUser: auth.currentUser,
    isLoading: !auth.currentUser,
    isAdmin: currentUser?.role === "admin",
    isAccountant: currentUser?.role === "accountant",
  };
}
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
