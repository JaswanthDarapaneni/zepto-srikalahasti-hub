import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useData } from "@/hooks/useData";
import { useFilteredData } from "@/hooks/useFilteredData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { useRoleAccess } from "@/hooks/useRoleAccess";

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  createdAt: string;
  delivery_agent_id?: string;
}

const Orders = () => {
  const { canAccessOrders } = useRoleAccess();
  const { data: allOrders, loading } = useData<Order[]>("/src/data/orders.json");
  const filteredOrders = useFilteredData(allOrders, { 
    filterByUserId: true, 
    filterByDeliveryAgent: true 
  });
  const { addLog } = useActivityLog();
  const [localOrders, setLocalOrders] = useState<Order[]>(filteredOrders);

  const handleEdit = (order: Order) => {
    console.log('Edit order:', order);
  };

  const handleDelete = (order: Order) => {
    setLocalOrders(localOrders.filter(o => o.id !== order.id));
    addLog('delete', 'orders', `Deleted order #${order.id}`);
  };

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (value: string) => <span className="font-mono">#{value}</span>
    },
    {
      key: 'user_id',
      label: 'Customer ID'
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          pending: "outline",
          confirmed: "secondary",
          packed: "default",
          out_for_delivery: "default",
          delivered: "secondary",
          cancelled: "destructive"
        };
        return <Badge variant={variants[value] || "outline"}>{value.replace('_', ' ')}</Badge>;
      }
    },
    {
      key: 'payment_method',
      label: 'Payment'
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString()
    }
  ];

  const stats = {
    total: localOrders.length,
    pending: localOrders.filter(o => o.status === 'pending').length,
    delivered: localOrders.filter(o => o.status === 'delivered').length,
    revenue: localOrders.reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Orders</h2>
        <p className="text-muted-foreground">Manage customer orders and deliveries</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.delivered}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <CRUDTable
        data={localOrders}
        columns={columns}
        title="Order Management"
        onAdd={() => {}}
        rowsPerPage={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissions={canAccessOrders}
        loading={loading}
        searchPlaceholder="Search orders..."
      />
    </div>
  );
};

export default Orders;
