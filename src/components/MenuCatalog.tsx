import React, { useState, useMemo } from 'react';
import { Plus, Check, Star, Filter, Search, ArrowUpDown } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-asc' | 'price-desc'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'cosset', label: 'Cosset (Cakes & Mousse)' },
    { id: 'confect', label: 'Confect (Pastries & Tarts)' },
    { id: 'special', label: 'Signature Roasts' },
    { id: 'coffee', label: 'Espresso Bar' },
    { id: 'cold-brew', label: 'Cold Drip' },
  ];

  const tags = ['all', 'Bestseller', 'Gluten-Free', 'Single Origin', 'Vegan'];

  // Filter and sort items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      if (!matchesCategory) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      if (selectedTag !== 'all') {
        if (selectedTag === 'Gluten-Free') {
          const hasGluten = p.allergens?.some((a) => a.toLowerCase().includes('gluten'));
          const isMarkedGf = p.tags?.some((t) => t.toLowerCase().includes('gluten'));
          if (hasGluten && !isMarkedGf) return false;
        } else if (selectedTag === 'Vegan') {
          const hasAnimal = p.allergens?.some((a) => a.toLowerCase().includes('dairy') || a.toLowerCase().includes('egg'));
          if (hasAnimal) return false;
        } else {
          const hasTag = p.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
          if (!hasTag) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, selectedTag, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedId(p._id);
    setTimeout(() => {
      setAddedId(null);
    }, 800);
  };

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
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? products.length
              : products.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                onCategoryChange(cat.id);
                setVisibleCount(16);
              }}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#163325] text-[#F8F4EC] shadow-sm'
                  : 'bg-[#EFE7DC] text-[#4E5B53] hover:bg-[#E4DACD] hover:text-[#163325]'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-[#2A4B39] text-[#F8F4EC]' : 'bg-[#E0D4C5] text-[#55645A]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Search, Tag Badges, Sort */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#F5EDE1]/70 p-4 rounded-2xl border border-[#E7DACB]">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8C9B90] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavor, origin, or name..."
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#DACDBD] rounded-full focus:outline-none focus:ring-1 focus:ring-[#163325] placeholder:text-[#9EA8A1]"
          />
        </div>

        {/* Dietary / Feature Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`text-[11px] px-3 py-1.5 rounded-full capitalize transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#BA8657] text-white font-medium shadow-2xs'
                  : 'bg-white/80 border border-[#D5C5B5] text-[#59665E] hover:bg-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#88988D]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-white border border-[#D5C5B5] text-[#163325] font-medium px-3 py-2 rounded-xl focus:outline-none"
          >
            <option value="featured">Featured First</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid of Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelectProduct(item)}
            className="bg-[#FAF5ED] rounded-3xl p-5 border border-[#E9DFD2] hover:border-[#D5C5B2] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            {/* Image & Category Tag */}
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F0E8DC] relative mb-4 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hero-coffee.jpg';
                }}
              />
              <div className="absolute top-3 left-3 bg-[#163325]/85 backdrop-blur-xs text-[#F8F4EC] text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {item.category}
              </div>

              {/* Rating Pill */}
              <div className="absolute bottom-3 left-3 bg-[#FAF5ED]/95 backdrop-blur-xs text-[#163325] text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Star className="w-3 h-3 fill-[#BA8657] text-[#BA8657]" />
                <span className="font-mono font-bold">{item.rating?.toFixed(1) || '4.9'}</span>
                <span className="text-[10px] text-[#7A8B80]">({item.reviewCount || 24})</span>
              </div>

              {item.calories && (
                <div className="absolute bottom-3 right-3 bg-[#FAF5ED]/90 backdrop-blur-xs text-[#526056] text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {item.calories}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-1.5 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-serif text-lg font-medium text-[#163325] group-hover:text-[#BA8657] transition-colors line-clamp-1">
                  {item.name}
                </h4>
                <span className="font-mono text-sm font-bold text-[#163325] shrink-0">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <p className="font-script text-base text-[#BA8657] line-clamp-1">
                {item.subtitle}
              </p>

              <p className="text-xs text-[#637268] line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-[#EAE0D4] flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#7D8E83] group-hover:text-[#163325] transition-colors">
                View Notes →
              </span>

              <button
                onClick={(e) => handleQuickAdd(item, e)}
                disabled={!item.available}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
                  addedId === item._id
                    ? 'bg-emerald-800 text-white'
                    : item.available
                    ? 'bg-[#163325] hover:bg-[#2A4F3A] text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
                title={item.available ? 'Add to order' : 'Sold out'}
              >
                {addedId === item._id ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More */}
      {filteredProducts.length > visibleCount && (
        <div className="text-center pt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 16)}
            className="px-8 py-3 bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] rounded-full text-xs font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            LOAD MORE DELICACIES ({filteredProducts.length - visibleCount} REMAINING)
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-[#F4EDE2] rounded-3xl border border-[#E4D7C7] p-8 max-w-lg mx-auto">
          <p className="font-serif text-2xl text-[#163325]">No culinary items found</p>
          <p className="text-xs text-[#6F7F75] mt-2">
            Try searching a different keyword or resetting your dietary filters.
          </p>
          <button
            onClick={() => {
              onCategoryChange('all');
              setSearchQuery('');
              setSelectedTag('all');
            }}
            className="mt-5 px-6 py-2.5 bg-[#163325] text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
