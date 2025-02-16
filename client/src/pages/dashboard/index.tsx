import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import type { Payment } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { currentUser, isAdmin, isAccountant } = useAuth();
  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/payments", currentUser?.id],
  });

  const monthlyData = payments?.reduce((acc, payment) => {
    const key = `${payment.month} ${payment.year}`;
    acc[key] = (acc[key] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData || {}).map(([date, amount]) => ({
    date,
    amount,
  }));

  return (
    <DashboardLayout>
      <div className="grid gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payments?.reduce((sum, p) => sum + p.amount, 0) || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Last Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payments?.[0]?.amount || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
