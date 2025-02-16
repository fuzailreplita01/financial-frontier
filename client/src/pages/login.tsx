import { useState } from "react";
import { setPersistence, browserSessionPersistence, signInWithRedirect } from "firebase/auth";
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

      console.log("🟢 Setting Firebase auth persistence...");
      await setPersistence(auth, browserSessionPersistence);

      console.log("🟢 Starting Google sign-in redirect...");
      await signInWithRedirect(auth, googleProvider);
      
      console.log("🔄 Redirecting to Google sign-in page...");
    } catch (error: any) {
      console.error("🔴 Error during sign-in redirect:", error);
      toast({
        title: "Login Failed",
        description: "Could not sign in with Google. Please try again.",
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