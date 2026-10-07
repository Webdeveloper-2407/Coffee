import React, { useState } from 'react';
import { Plus, Check, Star, Filter } from 'lucide-react';
import { Product } from '../types/index.ts';

interface MenuCatalogProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const MenuCatalog: React.FC<MenuCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  selectedCategory,
  onCategoryChange,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'vegan' | 'gluten-free'>('all');

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'cosset', label: 'Cosset (Cakes & Mousse)' },
    { id: 'confect', label: 'Confect (Pastries & Tarts)' },
    { id: 'special', label: 'Signature Roasts' },
    { id: 'coffee', label: 'Espresso Bar' },
    { id: 'cold-brew', label: 'Cold Drip' },
  ];

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;
    if (filterType === 'gluten-free') {
      return !p.allergens?.some((a) => a.toLowerCase().includes('gluten'));
    }
    if (filterType === 'vegan') {
      return !p.allergens?.some((a) => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('egg'));
    }
    return true;
  });

  return (
    <section id="menu-catalog" className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <span className="font-script text-2xl md:text-3xl text-[#BA8657]">
          Curated For Connoisseurs
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#163325]">
          The Artisanal Collection
        </h2>
        <p className="text-sm md:text-base text-[#5D6B62]">
          Every morning, our master pastry chefs and roasters craft small batches of seasonal indulgences using fair-trade ingredients.
        </p>
      </div>

      {/* Category Pills / Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#163325] text-[#F8F4EC] shadow-sm'
                  : 'bg-[#EFE7DC] text-[#4E5B53] hover:bg-[#E4DACD] hover:text-[#163325]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-[#FAF5ED] rounded-3xl p-5 border border-[#E9DFD2] hover:border-[#D5C5B2] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image & Quick View Trigger */}
            <div
              onClick={() => onSelectProduct(item)}
              className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F0E8DC] relative mb-4 cursor-pointer flex items-center justify-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-[#163325]/85 backdrop-blur-xs text-[#F8F4EC] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </div>
              {item.calories && (
                <div className="absolute bottom-3 right-3 bg-[#FAF5ED]/90 backdrop-blur-xs text-[#526056] text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {item.calories}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h4
                  onClick={() => onSelectProduct(item)}
                  className="font-serif text-xl font-medium text-[#163325] group-hover:text-[#BA8657] transition-colors cursor-pointer"
                >
                  {item.name}
                </h4>
                <span className="font-mono text-sm font-semibold text-[#163325]">
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p className="font-script text-base text-[#BA8657]">
                {item.subtitle}
              </p>
              <p className="text-xs text-[#637268] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-[#EAE0D4] flex items-center justify-between">
              <button
                onClick={() => onSelectProduct(item)}
                className="text-xs font-semibold text-[#163325] hover:text-[#BA8657] transition-colors cursor-pointer"
              >
                View Recipe Notes
              </button>
              <button
                onClick={() => onAddToCart(item)}
                className="w-8 h-8 rounded-full bg-[#163325] hover:bg-[#2A4F3A] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Add to order"
              >
                <Plus className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-[#F4EDE2] rounded-3xl border border-[#E4D7C7] p-8">
          <p className="font-serif text-xl text-[#163325]">No culinary items found in this section.</p>
          <button
            onClick={() => {
              onCategoryChange('all');
              setFilterType('all');
            }}
            className="mt-4 px-6 py-2 bg-[#163325] text-white rounded-full text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
