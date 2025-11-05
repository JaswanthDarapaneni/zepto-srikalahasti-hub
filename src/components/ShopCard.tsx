import { Clock, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface ShopCardProps {
  slug: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  category: string;
  isOpen: boolean;
}

const ShopCard = ({ slug, name, image, rating, deliveryTime, category, isOpen }: ShopCardProps) => {
  return (
    <Link to={`/customer/shop/${slug}`}>
      <div className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {!isOpen && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="secondary" className="text-sm">Currently Closed</Badge>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="mb-2 font-semibold text-foreground">{name}</h3>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">{rating}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deliveryTime}</span>
            </div>
          </div>
          
          <Badge variant="outline" className="mt-2">
            {category}
          </Badge>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
