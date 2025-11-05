import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package } from "lucide-react";
import { useData } from "@/hooks/useData";
import { useFilteredData } from "@/hooks/useFilteredData";
import CRUDTable from "@/components/CRUDTable";

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  address: string;
  delivery_agent_id?: string;
}

const Delivery = () => {
  const { data: allOrders, loading } = useData<Order[]>("/src/data/orders.json");
  const filteredOrders = useFilteredData(allOrders, { filterByDeliveryAgent: true });
  const deliveryOrders = filteredOrders.filter(
    (order) => order.status === "out_for_delivery" || order.status === "packed"
  );

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value: string) => <span className="font-mono">#{value}</span>
    },
    {
      key: 'address',
      label: 'Address',
      render: (value: string) => <span className="max-w-xs truncate">{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === "out_for_delivery" ? "default" : "outline"}>
          {value.replace("_", " ")}
        </Badge>
      )
    },
    {
      key: 'delivery_agent_id',
      label: 'Agent',
      render: (value: string) => 
        value ? (
          <Badge variant="secondary">{value}</Badge>
        ) : (
          <span className="text-muted-foreground">Not assigned</span>
        )
    }
  ];

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
              {(allOrders || []).filter((o) => o.status === "out_for_delivery").length}
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
              {(allOrders || []).filter((o) => o.status === "packed" && !o.delivery_agent_id).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <CRUDTable
        data={deliveryOrders}
        columns={columns}
        title="Delivery Orders"
        onAdd={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={loading}
        searchPlaceholder="Search delivery orders..."
      />
    </div>
  );
};

export default Delivery;
