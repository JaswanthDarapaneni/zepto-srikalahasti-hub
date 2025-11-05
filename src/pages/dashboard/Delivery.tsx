import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package } from "lucide-react";
import orders from "@/data/orders.json";

const Delivery = () => {
  const deliveryOrders = orders.filter(
    (order) => order.status === "out_for_delivery" || order.status === "packed"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Delivery Management</h2>
        <p className="text-muted-foreground">Track and assign delivery orders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out for Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "out_for_delivery").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ready to Assign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {orders.filter((o) => o.status === "packed" && !o.delivery_agent_id).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.address}</TableCell>
                  <TableCell>
                    <Badge variant={order.status === "out_for_delivery" ? "default" : "outline"}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.delivery_agent_id ? (
                      <Badge variant="secondary">{order.delivery_agent_id}</Badge>
                    ) : (
                      <span className="text-muted-foreground">Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Package className="h-4 w-4" />
                      </Button>
                    </div>
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

export default Delivery;
