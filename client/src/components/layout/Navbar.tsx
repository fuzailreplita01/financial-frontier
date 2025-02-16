import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { auth } from "@/lib/firebase";

export function Navbar() {
  const { currentUser, isAdmin, isAccountant } = useAuth();

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Financial Management
            </span>
          </Link>
          <div className="flex gap-6 md:gap-10">
            <Link href="/dashboard">Dashboard</Link>
            {(isAdmin || isAccountant) && (
              <>
                <Link href="/dashboard/payments">Payments</Link>
                <Link href="/dashboard/users">Users</Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <span className="mr-2">{currentUser?.email}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
