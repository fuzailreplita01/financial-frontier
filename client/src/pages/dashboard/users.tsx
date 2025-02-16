import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { RequireAuth } from "@/components/auth/RequireAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function Users() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const deactivateUser = useMutation({
    mutationFn: async (userId: number) => {
      await apiRequest("PATCH", `/api/users/${userId}/deactivate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  return (
    <RequireAuth allowedRoles={["admin", "accountant"]}>
      <DashboardLayout>
        <div className="grid gap-4">
          <h1 className="text-3xl font-bold">Users</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deactivateUser.mutate(user.id)}
                      disabled={!user.active}
                    >
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
