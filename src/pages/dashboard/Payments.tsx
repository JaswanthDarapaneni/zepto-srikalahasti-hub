import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import payments from "@/data/payments.json";

const Payments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Payments Management</h2>
        <p className="text-muted-foreground">Track all payments and transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₹{payments.reduce((sum, p) => sum + p.amount, 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {payments.filter((p) => p.status === "completed").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {payments.filter((p) => p.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-sm">
                    {payment.transaction_id || "N/A"}
                  </TableCell>
                  <TableCell>#{payment.order_id}</TableCell>
                  <TableCell className="font-semibold">₹{payment.amount}</TableCell>
                  <TableCell className="uppercase">{payment.method}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === "completed" ? "default" : "outline"}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
