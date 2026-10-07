import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onOpenContact: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenAdmin,
  onOpenContact,
  activeSection,
  onSelectSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'cosset', label: 'Cosset' },
    { id: 'confect', label: 'Confect' },
    { id: 'abouts', label: 'Abouts' },
  ];

  const handleNavClick = (id: string) => {
    onSelectSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F4EC]/90 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Wordmark (Left) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#163325] flex items-center gap-0.5">
            Coffeë
            <span className="w-1.5 h-1.5 rounded-full bg-[#BA8657] inline-block ml-0.5 mb-1 group-hover:scale-125 transition-transform" />
          </span>
        </button>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-wide transition-all duration-200 relative py-1 cursor-pointer font-medium ${
                  isActive ? 'text-[#163325] font-semibold' : 'text-[#59655E] hover:text-[#163325]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#163325] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-5 md:space-x-6">
          {/* Search */}
          <button
            onClick={onOpenSearch}
            aria-label="Search café menu"
            className="text-[#324338] hover:text-[#163325] transition-colors p-1.5 rounded-full hover:bg-[#EBE2D4] cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
          </button>

          {/* User Profile / Admin trigger */}
          <button
            onClick={onOpenAdmin}
            aria-label="Account and administration"
            className="relative group p-0.5 rounded-full focus:outline-none cursor-pointer"
            title="Barista Portal & Admin Dashboard"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D5C6B1] bg-[#E8DDD0] flex items-center justify-center group-hover:ring-2 group-hover:ring-[#163325] transition-all">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                alt="Barista Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to icon if avatar fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <User className="w-4 h-4 text-[#163325]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#BA8657] border-2 border-[#F8F4EC] rounded-full" />
          </button>

          {/* Cart Icon with Counter */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="relative text-[#324338] hover:text-[#163325] transition-colors p-1.5 rounded-full hover:bg-[#EBE2D4] cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#163325] text-[#F8F4EC] text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#163325] p-1.5 rounded-md hover:bg-[#EBE2D4] cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFCFC] bg-[#F8F4EC] px-6 py-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left py-2 text-base font-medium ${
                activeSection === item.id ? 'text-[#163325] font-semibold pl-2 border-l-2 border-[#163325]' : 'text-[#59655E]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-[#E8DFCFC] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs font-semibold uppercase tracking-wider text-[#163325] flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Store Dashboard
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="text-xs font-semibold text-[#BA8657] hover:underline"
            >
              Contact Us
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
