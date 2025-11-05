import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import shops from "@/data/shops.json";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import { useState } from "react";

const ShopDetails = () => {
  const { slug } = useParams();
  const shop = shops.find((s) => s.slug === slug);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!shop) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Shop not found</p>
      </div>
    );
  }

  const shopProducts = products.filter((p) => p.shop_id === shop.id);
  const shopCategories = categories.filter((c) =>
    shopProducts.some((p) => p.category_id === c.id)
  );

  const filteredProducts =
    selectedCategory === "all"
      ? shopProducts
      : shopProducts.filter((p) => p.category_id === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      

      <div className="container mx-auto px-4 py-6">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Shop Header */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-card">
          <div className="relative h-48 md:h-64">
            <img
              src={shop.image}
              alt={shop.name}
              className="h-full w-full object-cover"
            />
            {!shop.isOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="secondary" className="text-lg">
                  Currently Closed
                </Badge>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">{shop.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{shop.address}</span>
                </div>
              </div>
              <Badge>{shop.category}</Badge>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-warning text-warning" />
                <span className="font-semibold">{shop.rating}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">{shop.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All Products
          </Button>
          {shopCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="gap-1"
            >
              <span>{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              unit={product.unit}
              image={product.image}
              stock={product.stock}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;
