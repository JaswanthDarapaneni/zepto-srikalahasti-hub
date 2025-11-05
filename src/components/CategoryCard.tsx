interface CategoryCardProps {
  name: string;
  icon: string;
  image: string;
}

const CategoryCard = ({ name, icon, image }: CategoryCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-muted transition-all hover:shadow-lg">
        <div className="aspect-square">
          <img 
            src={image} 
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <p className="font-semibold text-white">{name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
