import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import shops from "@/data/shops.json";

const Shops = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Shops Management</h2>
          <p className="text-muted-foreground">Manage all shops and their details</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Shop
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Shops ({shops.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shops.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell className="font-medium">{shop.name}</TableCell>
                  <TableCell>{shop.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{shop.address}</TableCell>
                  <TableCell>{shop.rating} ⭐</TableCell>
                  <TableCell>
                    <Badge variant={shop.isOpen ? "default" : "secondary"}>
                      {shop.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
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

export default Shops;
