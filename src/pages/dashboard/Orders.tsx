import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import orders from "@/data/orders.json";

const Orders = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      placed: "secondary",
      packed: "outline",
      out_for_delivery: "default",
      delivered: "default",
    };
    return variants[status] || "secondary";
  };

  const formatStatus = (status: string) => {
    return status.split("_").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Orders Management</h2>
        <p className="text-muted-foreground">Track and manage all orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>₹{order.total}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.payment_status === "paid" ? "default" : "outline"}>
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
