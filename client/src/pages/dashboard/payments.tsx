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
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertPaymentSchema } from "@shared/schema";
import type { Payment, User } from "@shared/schema";
import type { z } from "zod";

type FormValues = z.infer<typeof insertPaymentSchema>;

export default function Payments() {
  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues: {
      amount: 0,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      userId: null,
      collectedBy: null,
    },
  });

  const createPayment = useMutation({
    mutationFn: async (data: FormValues) => {
      await apiRequest("POST", "/api/payments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      form.reset();
    },
  });

  return (
    <RequireAuth allowedRoles={["admin", "accountant"]}>
      <DashboardLayout>
        <div className="grid gap-4">
          <h1 className="text-3xl font-bold">Payments</h1>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => createPayment.mutate(data))}
              className="grid gap-4 md:grid-cols-4"
            >
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select User" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={value}
                        onChange={(e) => onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="md:col-span-4"
                disabled={createPayment.isPending}
              >
                {createPayment.isPending ? "Adding..." : "Add Payment"}
              </Button>
            </form>
          </Form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {users?.find((u) => u.id === payment.userId)?.name}
                  </TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{payment.month}</TableCell>
                  <TableCell>{payment.year}</TableCell>
                  <TableCell>
                    {users?.find((u) => u.id === payment.collectedBy)?.name}
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