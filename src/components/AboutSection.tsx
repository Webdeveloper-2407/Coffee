import React from 'react';
import { Award, Compass, HeartHandshake, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="abouts" className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-[#E8DFD3]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Story Prose */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="font-script text-2xl md:text-3xl text-[#BA8657]">
            The Coffeë Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#163325] leading-tight">
            Slow Roasted. <br />
            Mindfully Savored.
          </h2>
          <p className="text-[#56635A] text-base leading-relaxed">
            Founded with a reverent dedication to the ritual of morning light, Coffeë bridges ancient botanical extraction traditions with modern Parisian patisserie discipline.
          </p>
          <p className="text-[#56635A] text-sm leading-relaxed">
            Every green bean is ethically sourced through direct relationships with multigenerational farms across the misty slopes of Sidama, Ethiopia and Antioquia, Colombia. Roasted in micro-batches under 5kg to preserve the delicate jasmine florals and rich dark chocolate undertones.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#E6DACB]">
              <span className="font-serif text-2xl font-bold text-[#163325]">100%</span>
              <p className="text-xs font-semibold text-[#163325] mt-1">Direct-Trade Single Origins</p>
              <p className="text-[11px] text-[#738379] mt-0.5">Direct compensation above fair trade standards.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4EDE2] border border-[#E6DACB]">
              <span className="font-serif text-2xl font-bold text-[#163325]">03:00 AM</span>
              <p className="text-xs font-semibold text-[#163325] mt-1">Daily Dawn Lamination</p>
              <p className="text-[11px] text-[#738379] mt-0.5">French butter rolled fresh every single morning.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Atelier Collage */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden aspect-4/5 shadow-md border-2 border-white/60">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
                alt="Café interior atmosphere"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-5 rounded-2xl bg-[#DEE8DC] border border-[#CAD8C8] text-center">
              <p className="font-serif text-base text-[#163325] italic">"Good coffee is an act of quiet generosity."</p>
              <p className="text-[11px] font-semibold text-[#486353] mt-2 uppercase tracking-wider">— Master Roaster</p>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <div className="p-5 rounded-2xl bg-[#FCE9E7] border border-[#EBD0CD] text-center">
              <Sparkles className="w-5 h-5 text-[#B84E5D] mx-auto mb-1.5" />
              <p className="font-serif text-lg text-[#163325]">No artificial syrups or dyes</p>
              <p className="text-[11px] text-[#705256] mt-1">Pure organic fruit purées & wildflower nectar</p>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-4/5 shadow-md border-2 border-white/60">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                alt="Coffee bar counter"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
