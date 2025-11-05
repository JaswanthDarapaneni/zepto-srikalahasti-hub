import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useActivityLog } from "@/hooks/useActivityLog";
import { ShopDialog } from "@/components/dialogs/ShopDialog";
import { useState } from "react";
import { toast } from "sonner";
import shopsData from "@/data/shops.json";

interface Shop {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string;
  rating: number;
  deliveryTime: string;
  image: string;
  isOpen: boolean;
  lat?: number;
  lng?: number;
}

const Shops = () => {
  const [shops, setShops] = useLocalStorage<Shop[]>('shops', shopsData);
  const { addLog } = useActivityLog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | undefined>();
  const [shopToDelete, setShopToDelete] = useState<string | null>(null);

  const handleSave = (shop: Shop) => {
    const existingIndex = shops.findIndex((s) => s.id === shop.id);
    if (existingIndex >= 0) {
      const updated = [...shops];
      updated[existingIndex] = shop;
      setShops(updated);
      addLog('update', 'shops', `Updated shop: ${shop.name}`);
      toast.success('Shop updated successfully');
    } else {
      setShops([...shops, shop]);
      addLog('create', 'shops', `Created new shop: ${shop.name}`);
      toast.success('Shop created successfully');
    }
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setShopToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (shopToDelete) {
      const shop = shops.find((s) => s.id === shopToDelete);
      setShops(shops.filter((s) => s.id !== shopToDelete));
      addLog('delete', 'shops', `Deleted shop: ${shop?.name}`);
      toast.success('Shop deleted successfully');
      setShopToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Shops Management</h2>
          <p className="text-muted-foreground">Manage all shops and their details</p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            setSelectedShop(undefined);
            setDialogOpen(true);
          }}
        >
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
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(shop)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(shop.id)}>
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

      <ShopDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shop={selectedShop}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the shop.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Shops;
