import React from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { IMAGES } from '../assets/images/index.ts';
import { Product } from '../types/index.ts';

interface SpecialCoffeeProps {
  onDiscoverMore: () => void;
  onAddToCart: (product: Product) => void;
  specialProduct?: Product;
}

export const SpecialCoffee: React.FC<SpecialCoffeeProps> = ({
  onDiscoverMore,
  onAddToCart,
  specialProduct,
}) => {
  const checklist = [
    '100% Arabica Beans',
    'Medium Dark Roast',
    'Rich Aroma & Smooth Finish',
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-20 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Image Composition */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
          {/* Ambient soft glow */}
          <div className="absolute -inset-4 bg-[#EADCC9]/50 rounded-full filter blur-3xl -z-10" />

          {/* Large Featured Image */}
          <div className="relative w-full max-w-[480px] aspect-square rounded-[36px] overflow-hidden shadow-2xl border-4 border-[#FAF6EE] group">
            <img
              src={IMAGES.specialCoffee}
              alt="Müil Coffee - Artisanal dark brown ceramic mug on wooden coaster with golden spoon and beans"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Subtle vintage vignette */}
            <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Floating Price Tag */}
            <div className="absolute top-5 left-5 bg-[#F8F4EC]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-[#E4D5C2]">
              <span className="text-xs font-semibold text-[#163325]">
                Signature Blend · ${specialProduct?.price ? specialProduct.price.toFixed(2) : '6.50'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Content Column */}
        <div className="lg:col-span-6 space-y-6 relative text-left">
          {/* Small Decorative Label */}
          <div>
            <span className="font-script text-2xl md:text-3xl text-[#BA8657] font-medium">
              Our Special
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#163325] tracking-tight">
            Müil Coffee
          </h2>

          {/* Description */}
          <p className="text-[#56635A] text-base md:text-lg leading-relaxed max-w-lg">
            A perfect blend of bold flavors and smooth taste, crafted to give you a moment of pure bliss.
          </p>

          {/* Checklist */}
          <div className="space-y-3 pt-1">
            {checklist.map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#163325] text-[#F8F4EC] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
                <span className="text-sm md:text-base font-medium text-[#29362F]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* CTA & Decorative Seal Row */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-6">
            <button
              onClick={() => {
                if (specialProduct) {
                  onAddToCart(specialProduct);
                } else {
                  onDiscoverMore();
                }
              }}
              className="group inline-flex items-center gap-3 bg-[#163325] hover:bg-[#234836] text-[#F8F4EC] px-7 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <span>DISCOVER MORE</span>
              <span className="w-5 h-5 rounded-full bg-[#234836] group-hover:bg-[#2F5D46] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-[#F8F4EC]" />
              </span>
            </button>

            {/* Circular Stamp / Seal "Brewed for You" */}
            <div className="relative w-24 h-24 rounded-full border border-dashed border-[#8E7E6B] flex flex-col items-center justify-center text-center p-2 select-none rotate-3 hover:rotate-12 transition-transform duration-500">
              {/* Botanical leaves sketch */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8E7E6B"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 -mt-1 mb-0.5"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <span className="font-serif text-[11px] font-semibold text-[#3F4F45] leading-tight">
                Brewed
              </span>
              <span className="font-serif text-[10px] text-[#69786E] italic">
                for You
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
