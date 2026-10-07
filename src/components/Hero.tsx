import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { IMAGES } from '../assets/images/index.ts';

interface HeroProps {
  onExploreMore: () => void;
  onQuickAddHeroLatte: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMore, onQuickAddHeroLatte }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-12 lg:pt-8 lg:pb-16 max-w-7xl mx-auto px-6 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Content Column */}
        <div className="lg:col-span-6 space-y-6 z-10 text-left">
          {/* Decorative Phrase */}
          <div className="inline-block">
            <span className="font-script text-2xl md:text-3xl text-[#BA8657] font-medium tracking-wide">
              Life Happens, Coffee Helps
            </span>
          </div>

          {/* Large Editorial Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.08] text-[#163325] tracking-tight text-balance">
            Sweet Moments <br />
            Start <span className="text-[#BA8657] italic font-serif">Here.</span>
          </h1>

          {/* Body Paragraph */}
          <p className="text-[#56635A] text-base md:text-lg leading-relaxed max-w-lg font-normal">
            Indulge in handcrafted coffee and delicious treats made to brighten your day and warm your heart.
          </p>

          {/* Primary CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreMore}
              className="group inline-flex items-center gap-3 bg-[#163325] hover:bg-[#234836] text-[#F8F4EC] px-7 py-3.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <span>EXPLORE MORE</span>
              <span className="w-5 h-5 rounded-full bg-[#234836] group-hover:bg-[#2F5D46] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-[#F8F4EC]" />
              </span>
            </button>

            <button
              onClick={onQuickAddHeroLatte}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#BA8657] hover:text-[#9A6B41] px-4 py-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#BA8657]" />
              <span>Taste today's featured brew</span>
            </button>
          </div>
        </div>

        {/* Right Hero Image Composition */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          {/* Ambient soft glow / background disc */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#DEE8DC]/40 via-[#F5ECE3]/60 to-transparent rounded-full filter blur-2xl -z-10" />

          {/* Masked / Curved Hero Frame */}
          <div className="relative w-full max-w-[500px] aspect-square rounded-[42px] overflow-hidden shadow-2xl border-4 border-[#FAF6EE] group">
            <img
              src={IMAGES.heroCoffee}
              alt="Artisanal Latte Art in Ribbed Forest Green Cup with Fresh Whole Roasted Coffee Beans"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />

            {/* Subtle soft gradient overlay at bottom edge */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#163325]/30 via-transparent to-transparent pointer-events-none" />

            {/* Floating pill badge on image */}
            <div className="absolute bottom-5 left-5 bg-[#F8F4EC]/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md border border-[#EADBCE] flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BA8657] animate-pulse" />
              <div>
                <p className="text-[11px] font-semibold text-[#163325] leading-tight">Freshly Roasted Today</p>
                <p className="text-[10px] text-[#718076]">Double Shot · Silk Microfoam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
