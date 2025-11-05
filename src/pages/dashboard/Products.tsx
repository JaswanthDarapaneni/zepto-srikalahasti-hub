import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ProductDialog } from "@/components/dialogs/ProductDialog";
import { useData } from "@/hooks/useData";
import { useActivityLog } from "@/hooks/useActivityLog";
import CRUDTable from "@/components/CRUDTable";
import { toast } from "sonner";
import { useRoleAccess } from "@/hooks/useRoleAccess";


interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category_id?: string;
  shop_id: string;
  image: string;
  stock: number;
  description?: string;
}

const Products = () => {
  const { data: products, loading } = useData<Product[]>("/src/data/products.json"); // ✅ Move file to /public/data
  const { addLog } = useActivityLog();
  const {canAccessProducts} = useRoleAccess();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  // 🔄 Keep local data in sync when fetched
  useEffect(() => {
    if (products) setLocalProducts(products);
  }, [products]);

  // 🧩 CRUD handlers
  const handleAdd = () => {
    setSelectedProduct(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSave = (product: Product) => {
    if (selectedProduct) {
      // Update
      setLocalProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      addLog("update", "products", `Updated product: ${product.name}`);
      toast.success("Product updated successfully");
    } else {
      // Add new
      setLocalProducts((prev) => [...prev, product]);
      addLog("create", "products", `Created new product: ${product.name}`);
      toast.success("Product created successfully");
    }
    setDialogOpen(false);
    setSelectedProduct(undefined);
  };

  const handleDelete = (product: Product) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== product.id));
    addLog("delete", "products", `Deleted product: ${product.name}`);
    toast.success("Product deleted successfully");
  };

  // 💡 Table Columns
  const columns = [
    {
      key: "name",
      label: "Product",
      render: (_: any, product: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="h-10 w-10 rounded object-cover"
          />
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value: number, product: Product) => `₹${value}/${product.unit}`,
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number, product: Product) => `${value} ${product.unit}s`,
    },
    {
      key: "shop",
      label: "Category/Shop",
      render: (value: number, product: Product) => `${product?.category_id}/${product?.shop_id}`,
    },
    {
      key: "status",
      label: "Status",
      render: (_: any, product: Product) => (
        <Badge variant={product.stock > 10 ? "default" : "destructive"}>
          {product.stock > 10 ? "In Stock" : "Low Stock"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Products</h2>
        <p className="text-muted-foreground">
          Manage inventory and available products
        </p>
      </div>

      <CRUDTable
        data={localProducts}
        columns={columns}
        title="Product Management"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        rowsPerPage={10}
        permissions={canAccessProducts}
        loading={loading}
        searchPlaceholder="Search products..."
      />

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default Products;
