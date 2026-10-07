import React, { useState } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { Product } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : products.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#F8F4EC] rounded-3xl shadow-2xl border border-[#E3D6C5] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E3D6C5] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8D9B91]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search our cakes, roasts, or cold brews..."
            className="flex-1 bg-transparent text-sm md:text-base text-[#163325] placeholder:text-[#9BAAA0] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#EAE0D3] text-[#163325] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[400px] overflow-y-auto divide-y divide-[#EAE0D3]">
          <p className="text-[11px] font-semibold text-[#8B9B91] uppercase tracking-wider mb-2 px-2">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Recommendations'}
          </p>

          {results.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6F7F75]">
              No café creations matching "{query}". Try searching "Pistachio" or "Arabica".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
                className="py-3 px-2 flex items-center gap-4 hover:bg-[#F2E8DC] rounded-2xl cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E8DDD0] overflow-hidden shrink-0 flex items-center justify-center border border-[#DCDEC0]/40">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-serif text-sm font-semibold text-[#163325] truncate">
                    {item.name}
                  </h5>
                  <p className="text-xs text-[#8A6740] font-script truncate">
                    {item.subtitle}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-[#163325] shrink-0">
                  ${item.price.toFixed(2)}
                </span>
                <ArrowRight className="w-4 h-4 text-[#8C9C92] shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
