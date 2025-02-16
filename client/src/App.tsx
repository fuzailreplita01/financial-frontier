import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/dashboard/users";
import Payments from "@/pages/dashboard/payments";
import NotFound from "@/pages/not-found";
import { RequireAuth } from "@/components/auth/RequireAuth";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/users">
        <RequireAuth allowedRoles={["admin", "accountant"]}>
          <Users />
        </RequireAuth>
      </Route>
      <Route path="/dashboard/payments">
        <RequireAuth allowedRoles={["admin", "accountant"]}>
          <Payments />
        </RequireAuth>
      </Route>
      <Route path="/">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
