import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useActivityLog } from "@/hooks/useActivityLog";
import { CouponDialog } from "@/components/dialogs/CouponDialog";
import { useState } from "react";
import { toast } from "sonner";
import couponsData from "@/data/coupons.json";

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxDiscount: number;
  active: boolean;
  description?: string;
}

const Coupons = () => {
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>('coupons', couponsData);
  const { addLog } = useActivityLog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>();
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const handleSave = (coupon: Coupon) => {
    const existingIndex = coupons.findIndex((c) => c.id === coupon.id);
    if (existingIndex >= 0) {
      const updated = [...coupons];
      updated[existingIndex] = coupon;
      setCoupons(updated);
      addLog('update', 'coupons', `Updated coupon: ${coupon.code}`);
      toast.success('Coupon updated successfully');
    } else {
      setCoupons([...coupons, coupon]);
      addLog('create', 'coupons', `Created new coupon: ${coupon.code}`);
      toast.success('Coupon created successfully');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCouponToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (couponToDelete) {
      const coupon = coupons.find((c) => c.id === couponToDelete);
      setCoupons(coupons.filter((c) => c.id !== couponToDelete));
      addLog('delete', 'coupons', `Deleted coupon: ${coupon?.code}`);
      toast.success('Coupon deleted successfully');
      setCouponToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Coupons & Promotions</h2>
          <p className="text-muted-foreground">Manage discount coupons and promotional codes</p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            setSelectedCoupon(undefined);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Max Discount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                  <TableCell className="capitalize">{coupon.type}</TableCell>
                  <TableCell>
                    {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </TableCell>
                  <TableCell>₹{coupon.minOrder}</TableCell>
                  <TableCell>₹{coupon.maxDiscount}</TableCell>
                  <TableCell>{coupon.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={coupon.active ? "default" : "secondary"}>
                      {coupon.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(coupon)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(coupon.id)}>
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

      <CouponDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        coupon={selectedCoupon}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
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

export default Coupons;
