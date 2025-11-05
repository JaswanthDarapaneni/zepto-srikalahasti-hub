import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import products from '@/data/products.json';
import reviews from '@/data/reviews.json';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem, removeItem, items } = useCart();
  
  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.product_id === id);
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : 0;

  if (!product) return <div className="container mx-auto px-6 py-8">Product not found</div>;

  const cartItem = items.find(item => item.product_id === product.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{avgRating}</span>
            </div>
            <span className="text-muted-foreground">({productReviews.length} reviews)</span>
          </div>
          
          <div className="text-3xl font-bold text-primary mb-4">
            ₹{product.price} <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
          
          <Badge variant={product.stock > 20 ? 'default' : 'destructive'} className="mb-4">
            {product.stock > 20 ? 'In Stock' : `Only ${product.stock} left`}
          </Badge>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          {quantity === 0 ? (
            <Button onClick={() => addItem(product.id)} className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <Button onClick={() => removeItem(product.id)} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold">{quantity}</span>
              <Button onClick={() => addItem(product.id)} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {productReviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="font-medium">{review.rating}/5</span>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
