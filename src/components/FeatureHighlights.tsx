import React from 'react';
import { Leaf, Coffee, Heart } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      id: 'finest-ingredients',
      icon: Leaf,
      iconBg: 'bg-[#163325]',
      iconColor: 'text-[#F8F4EC]',
      title: 'Finest Ingredients',
      description: 'Sourced from the best coffee farms.',
    },
    {
      id: 'perfectly-brewed',
      icon: Coffee,
      iconBg: 'bg-[#BA8657]',
      iconColor: 'text-[#F8F4EC]',
      title: 'Perfectly Brewed',
      description: 'Expertly roasted for rich flavor.',
    },
    {
      id: 'made-with-love',
      icon: Heart,
      iconBg: 'bg-[#163325]',
      iconColor: 'text-[#F8F4EC]',
      title: 'Made with Love',
      description: 'Crafted with passion for you.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 lg:py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#E6DACB]/70 bg-[#F5EFE5]/50 rounded-3xl p-6 lg:p-8 border border-[#EDE2D4]">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              className={`flex items-center space-x-4 ${
                idx > 0 ? 'pt-4 md:pt-0 md:pl-6 lg:pl-10' : ''
              } group`}
            >
              {/* Circular Icon */}
              <div
                className={`w-12 h-12 rounded-full ${feature.iconBg} ${feature.iconColor} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </div>

              {/* Text content */}
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#163325] tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-[#5C6A61] mt-0.5 leading-snug">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
