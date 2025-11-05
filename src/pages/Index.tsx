import { ArrowRight, Clock, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import CategoryCard from "@/components/CategoryCard";
import ShopCard from "@/components/ShopCard";
import categories from "@/data/categories.json";
import shops from "@/data/shops.json";
import heroBanner from "@/assets/hero-banner.jpg";

const Index = () => {
  const featuredShops = shops.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Groceries delivered in{" "}
                  <span className="text-primary">10 minutes</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Get fresh groceries, vegetables, and daily essentials delivered to your doorstep in Srikalahasti
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="gap-2 text-base font-semibold">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2 text-base">
                  <MapPin className="h-5 w-5" />
                  Check Delivery
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">10 Min Delivery</p>
                    <p className="text-xs text-muted-foreground">Lightning fast</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">1000+ Products</p>
                    <p className="text-xs text-muted-foreground">Always fresh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={heroBanner} 
                  alt="Fresh groceries delivery"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Shop by Category</h2>
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
                image={category.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Featured Shops</h2>
              <p className="mt-1 text-muted-foreground">Popular stores near you</p>
            </div>
            <Button variant="ghost" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredShops.map((shop) => (
              <ShopCard
                key={shop.id}
                name={shop.name}
                image={shop.image}
                rating={shop.rating}
                deliveryTime={shop.deliveryTime}
                category={shop.category}
                isOpen={shop.isOpen}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ZeptoClone Srikalahasti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
