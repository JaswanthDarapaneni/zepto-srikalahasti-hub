import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ShopDialog } from "@/components/dialogs/ShopDialog";
import { useData } from "@/hooks/useData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { toast } from "sonner";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useAuth } from "@/contexts/AuthContext";
import { useFilteredData } from "@/hooks/useFilteredData";


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
  const { data: shops, loading } = useData<Shop[]>("/src/data/shops.json"); // ✅ Make sure file is in /public/data
  const { addLog } = useActivityLog();
  const {canAccessShops} = useRoleAccess();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | undefined>();
  const [localShops, setLocalShops] = useState<Shop[]>([]);

  // 🔄 Sync local data with fetched data
  useEffect(() => {
    if (shops) setLocalShops(shops);
  }, [shops]);

  // 🧩 CRUD Handlers
  const handleAdd = () => {
    setSelectedShop(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setSelectedShop(shop);
    setDialogOpen(true);
  };

  const handleSave = (shop: Shop) => {
    if (selectedShop) {
      // ✏️ Update
      setLocalShops((prev) => prev.map((s) => (s.id === shop.id ? shop : s)));
      addLog("update", "shops", `Updated shop: ${shop.name}`);
      toast.success("Shop updated successfully");
    } else {
      // ➕ Add
      setLocalShops((prev) => [...prev, shop]);
      addLog("create", "shops", `Created new shop: ${shop.name}`);
      toast.success("Shop created successfully");
    }
    setDialogOpen(false);
    setSelectedShop(undefined);
  };

  const handleDelete = (shop: Shop) => {
    setLocalShops((prev) => prev.filter((s) => s.id !== shop.id));
    addLog("delete", "shops", `Deleted shop: ${shop.name}`);
    toast.success("Shop deleted successfully");
  };

  // 💡 Table Columns
  const columns = [
    {
      key: "name",
      label: "Shop",
      render: (_: any, shop: Shop) => (
        <div className="flex items-center gap-3">
          <img
            src={shop.image}
            alt={shop.name}
            className="h-10 w-10 rounded object-cover"
          />
          <span className="font-medium">{shop.name}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "address",
      label: "Address",
      render: (value: string) => (
        <span className="max-w-xs truncate block">{value}</span>
      ),
    },
    {
      key: "rating",
      label: "Rating",
      render: (value: number) => `${value} ⭐`,
    },
    {
      key: "isOpen",
      label: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Open" : "Closed"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Shops</h2>
        <p className="text-muted-foreground">
          Manage all registered shops and their details
        </p>
      </div>

      <CRUDTable
        data={localShops}
        columns={columns}
        title="Shops Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        permissions={canAccessShops}
        loading={loading}
        rowsPerPage={10}
        searchPlaceholder="Search shops..."
      />

      <ShopDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shop={selectedShop}
        onSave={handleSave}
      />
    </div>
  );
};

export default Shops;
