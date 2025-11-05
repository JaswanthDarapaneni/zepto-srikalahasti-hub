import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import payments from "@/data/payments.json";
import CRUDTable from "@/components/CRUDTable"; // 👈 your generic CRUDTable component
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function Payments() {
  // Compute summary values
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const completed = payments.filter((p) => p.status === "completed").length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const { canAccessPayments } = useRoleAccess();
  // Columns for CRUDTable
  const columns = [
    {
      key: "transaction_id",
      label: "Transaction ID",
      render: (value: string) => value || "N/A",
    },
    {
      key: "order_id",
      label: "Order ID",
      render: (value: number) => `#${value}`,
    },
    { key: "amount", label: "Amount", render: (value: number) => `₹${value}` },
    {
      key: "method",
      label: "Method",
      render: (value: string) => value?.toUpperCase(),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${
            value === "completed"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  // Actions
  const handleAdd = () => {
    alert("Add payment not allowed manually — system controlled.");
  };

  const handleEdit = (item: any) => {
    console.log("Editing payment:", item);
    alert("Editing payment info...");
  };

  const handleDelete = (item: any) => {
    console.log("Deleting payment:", item);
    alert("Delete not allowed for payment records.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Payments Management</h2>
        <p className="text-muted-foreground">
          Track all payments and transactions
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* CRUD Table */}
      <CRUDTable
        title={`All Payments (${payments.length})`}
        data={payments}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowsPerPage={10}
        permissions={canAccessPayments}
        searchable={true}
        searchPlaceholder="Search payments..."
      />
    </div>
  );
}
