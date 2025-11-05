import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Store, Users } from "lucide-react";

const DashboardHome = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      icon: ShoppingCart,
      change: "+12.5%",
      color: "text-primary",
    },
    {
      title: "Active Shops",
      value: "45",
      icon: Store,
      change: "+3.2%",
      color: "text-info",
    },
    {
      title: "Total Products",
      value: "892",
      icon: Package,
      change: "+8.1%",
      color: "text-warning",
    },
    {
      title: "Total Users",
      value: "3,421",
      icon: Users,
      change: "+15.3%",
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to ZeptoClone Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No recent orders to display
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate to different sections
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
