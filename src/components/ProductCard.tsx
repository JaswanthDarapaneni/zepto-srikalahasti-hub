import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  stock: number;
}

const ProductCard = ({ id, name, price, unit, image, stock }: ProductCardProps) => {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find((item) => item.product_id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {stock < 10 && (
          <Badge variant="destructive" className="absolute right-2 top-2">
            Low Stock
          </Badge>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-1 font-semibold text-foreground">{name}</h3>
        <p className="mb-3 text-lg font-bold text-primary">
          ₹{price}
          <span className="text-sm font-normal text-muted-foreground">/{unit}</span>
        </p>

        {quantity === 0 ? (
          <Button
            onClick={() => addItem(id)}
            className="w-full gap-2"
            disabled={stock === 0}
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-primary bg-primary/5 p-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => updateQuantity(id, quantity - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold">{quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => updateQuantity(id, quantity + 1)}
              disabled={quantity >= stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
