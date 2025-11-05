import CategoryCard from '@/components/CategoryCard';
import { Button } from '@/components/ui/button';
import categories from '@/data/categories.json';
import { useState } from 'react';

const Categories = () => {
    const [selectedCategory, setSelectedCategory] =useState(categories[0].id);
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">All Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
          <CategoryCard key={category.id} {...category} />
          
        ))}
      </div>
    </div>
  );
};

export default Categories;
