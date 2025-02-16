import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { app, auth, getRedirectResult } from "./firebase";
import type { User } from "@shared/schema";
import { useLocation } from "wouter";
import { getAuth } from "firebase/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const newAUth = getAuth(app)

  // Set up Firebase auth state listener
  useEffect(() => {
    console.log("Setting up Firebase auth state listener and checking redirect result");
    
    const checkUserAuth = async () => {
      if (newAUth.currentUser) {
        console.log("User already signed in:", newAUth.currentUser);
        return;
      }
  
      console.log("Checking redirect result...");
      const result = await getRedirectResult(newAUth);
      if (result?.user) {
        console.log("Redirect sign-in successful:", result.user);
      } else {
        console.log("No redirect result user.");
      }
    };
  

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "user logged in" : "no user");
      // if (firebaseUser) {
      //   try {
      //     // Get the ID token and set it in the request
      //     const token = await firebaseUser.getIdToken();
      //     const headers = { Authorization: `Bearer ${token}` };

      //     // Update the user data in React Query cache
      //     await queryClient.fetchQuery({
      //       queryKey: ["/api/auth/me"],
      //       queryFn: async () => {
      //         console.log("Fetching user data from API");
      //         const res = await fetch("/api/auth/me", { headers });
      //         if (!res.ok) {
      //           console.error("Failed to fetch user:", await res.text());
      //           throw new Error("Failed to fetch user");
      //         }
      //         const data = await res.json();
      //         console.log("User data received:", data);
      //         return data;
      //       },
      //     });

      //     // Redirect to dashboard if we're on the login page
      //     if (window.location.pathname === "/login") {
      //       console.log("Redirecting to dashboard after successful auth");
      //       setLocation("/dashboard");
      //     }
      //   } catch (error) {
      //     console.error("Error in auth state change handler:", error);
      //     // Clear the cache on error
      //     queryClient.clear();
      //   }
      // } else {
      //   // Clear the cache when user signs out
      //   console.log("Clearing query cache - no user");
      //   queryClient.clear();
      // }
    });

    checkUserAuth()

    return () => unsubscribe();
  }, [queryClient, setLocation]);

  const { data: currentUser, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    enabled: !!auth.currentUser,
  });

  return {
    currentUser,
    isLoading,
    isAdmin: currentUser?.role === "admin",
    isAccountant: currentUser?.role === "accountant",
  };
}