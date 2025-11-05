import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CategoryCard from "@/components/CategoryCard";
import ShopCard from "@/components/ShopCard";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import categories from "@/data/categories.json";
import shops from "@/data/shops.json";
import products from "@/data/products.json";
import banners from "@/data/banners.json";
import heroBanner from "@/assets/hero-banner.jpg";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0].id);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const bestSellingProducts = products.slice(0, 6);
  const activeBanner = banners.find((b) => b.active);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-[400px] overflow-hidden">
        <motion.img
          src={activeBanner?.image || heroBanner}
          alt="Hero"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <motion.div 
            className="container mx-auto px-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {activeBanner?.title || "Fresh Groceries Delivered in Minutes"}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Shop from local stores near you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Categories */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link to="/customer/categories">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="flex justify-between overflow-x-auto no-scrollbar gap-4 px-4 py-2">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              >
                <Button
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category.id)}
                  size="icon"
                  className={`w-14 h-14 rounded-full flex items-center justify-center border ${
                    selectedCategory === category.id
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                </Button>
                <span
                  className={`text-xs text-center ${
                    selectedCategory === category.id
                      ? "text-green-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Best Selling Products */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Best Selling Products</h2>
            <Link to="/customer/products">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestSellingProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Filtered Products */}
        {(searchQuery || selectedCategory) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        )}

        {/* Nearby Shops */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shops Near You</h2>
            <Link to="/customer/shops">
              <Button variant="link">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.slice(0, 6).map((shop) => (
              <ShopCard key={shop.id} {...shop} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
