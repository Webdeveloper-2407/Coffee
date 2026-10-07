import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Product } from '../types/index.ts';

interface SpecialCardsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SpecialCards: React.FC<SpecialCardsProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  // Extract or match the three iconic items from seed / product list
  const card1 = products.find((p) => p.name.toLowerCase().includes('aatis')) || products[0];
  const card2 = products.find((p) => p.name.toLowerCase().includes('lermi')) || products[1];
  const card3 = products.find((p) => p.name.toLowerCase().includes('flitre')) || products[2];

  const showcaseCards = [
    {
      product: card1,
      defaultTitle: 'Aatis',
      defaultSubtitle: 'Pistachio Bliss',
      defaultTagline: 'Rich. Nutty. Irresistible.',
      bgClass: 'bg-[#DEE8DC]',
      btnBg: 'bg-[#1F3C2C] hover:bg-[#2A4F3A]',
      subtitleColor: 'text-[#44604E]',
    },
    {
      product: card2,
      defaultTitle: 'Lermi',
      defaultSubtitle: 'Chocolate Dream',
      defaultTagline: 'Decadent. Smooth. Heavenly.',
      bgClass: 'bg-[#F5ECE3]',
      btnBg: 'bg-[#B67E48] hover:bg-[#CA8D54]',
      subtitleColor: 'text-[#96663A]',
    },
    {
      product: card3,
      defaultTitle: 'Flitre',
      defaultSubtitle: 'Berry Delight',
      defaultTagline: 'Fruity. Fresh. Delightful.',
      bgClass: 'bg-[#FCE9E7]',
      btnBg: 'bg-[#BD4957] hover:bg-[#D45564]',
      subtitleColor: 'text-[#A0424F]',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        {showcaseCards.map((card, idx) => {
          const prod = card.product;
          if (!prod) return null;

          return (
            <div
              key={prod._id || idx}
              className={`${card.bgClass} rounded-[32px] p-6 lg:p-8 flex flex-col justify-between relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-black/5`}
            >
              {/* Top Header Information */}
              <div className="text-center pt-2">
                <h3 className="font-serif text-3xl lg:text-4xl font-normal text-[#163325] tracking-tight">
                  {prod.name || card.defaultTitle}
                </h3>
                <p
                  className={`font-script text-xl lg:text-2xl mt-1 font-medium ${card.subtitleColor}`}
                >
                  {prod.subtitle || card.defaultSubtitle}
                </p>
              </div>

              {/* Central Product Image */}
              <div
                onClick={() => onSelectProduct(prod)}
                className="my-6 relative cursor-pointer flex items-center justify-center overflow-hidden rounded-2xl"
              >
                <div className="w-full aspect-square max-w-[240px] relative flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={`${prod.name} - ${prod.subtitle}`}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Bottom Row: Tagline + Circular Action Button */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5">
                <span className="text-xs md:text-sm font-medium text-[#4D5852] tracking-wide">
                  {prod.tagline || card.defaultTagline}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#163325] font-mono mr-1">
                    ${prod.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onAddToCart(prod)}
                    aria-label={`Add ${prod.name} to cart`}
                    className={`w-10 h-10 rounded-full ${card.btnBg} text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer`}
                    title="Quick Add to Bag"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
