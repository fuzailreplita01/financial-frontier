import { useState } from "react";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  console.log(currentUser)

  // Redirect to dashboard if user is already logged in
  if (currentUser) {
    setLocation("/dashboard");
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting Google sign-in process...");
      await signInWithRedirect(auth, googleProvider);
      // User will be redirected to Google sign-in

      // After the page redirects back
      const userCred = await getRedirectResult(auth);
      console.log(userCred)
    } catch (error: any) {
      console.error("Error signing in:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        customData: error.customData,
        name: error.name,
      });

      let errorMessage = "Could not sign in with Google. Please try again.";
      if (error.code === "auth/configuration-not-found") {
        errorMessage = "Please ensure you've added your domain to Firebase authorized domains.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "Google Sign-In is not enabled. Please enable it in Firebase Console under Authentication > Sign-in method.";
      } else if (error.code === "auth/invalid-api-key") {
        errorMessage = "Invalid Firebase configuration. Please check the API key.";
      } else if (error.code === "auth/internal-error") {
        errorMessage = `Internal Firebase error: ${error.message}. Please try again or contact support.`;
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Financial Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}