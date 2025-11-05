import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const Analytics = () => {
  const orderData = [
    { name: "Mon", orders: 45, revenue: 12000 },
    { name: "Tue", orders: 52, revenue: 15000 },
    { name: "Wed", orders: 48, revenue: 13500 },
    { name: "Thu", orders: 61, revenue: 17800 },
    { name: "Fri", orders: 55, revenue: 16200 },
    { name: "Sat", orders: 67, revenue: 19500 },
    { name: "Sun", orders: 58, revenue: 16800 },
  ];

  const categoryData = [
    { name: "Groceries", sales: 45000 },
    { name: "Vegetables", sales: 32000 },
    { name: "Fruits", sales: 28000 },
    { name: "Dairy", sales: 22000 },
    { name: "Snacks", sales: 18000 },
    { name: "Beverages", sales: 15000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">View detailed analytics and insights</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">386</p>
            <p className="text-xs text-success">+12.5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹1,10,800</p>
            <p className="text-xs text-success">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹287</p>
            <p className="text-xs text-muted-foreground">-2.1% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">234</p>
            <p className="text-xs text-success">+18.3% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
