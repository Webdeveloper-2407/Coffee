import React from 'react';
import { Truck, ShieldCheck, Award, Headphones } from 'lucide-react';

export const ServiceFeaturesBar: React.FC = () => {
  const perks = [
    {
      id: 'free-delivery',
      icon: Truck,
      title: 'Free Delivery',
      subtitle: 'On orders over $29',
    },
    {
      id: 'secure-payment',
      icon: ShieldCheck,
      title: 'Secure Payment',
      subtitle: '100% secure checkout',
    },
    {
      id: 'premium-quality',
      icon: Award,
      title: 'Premium Quality',
      subtitle: 'Best coffee, always',
    },
    {
      id: 'support-always',
      icon: Headphones,
      title: '24/7 Support',
      subtitle: "We're here for you",
    },
  ];

  return (
    <section className="w-full bg-[#163325] text-[#F8F4EC] py-8 lg:py-10 border-t border-b border-[#0F241A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.id}
                className="flex items-center space-x-3.5 group transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-full border border-[#305341] bg-[#1E4332] flex items-center justify-center shrink-0 group-hover:border-[#BA8657] transition-colors">
                  <Icon className="w-5 h-5 text-[#E7DECD] stroke-[1.8]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F8F4EC] tracking-tight">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-[#A8BAAE] mt-0.5">
                    {perk.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
