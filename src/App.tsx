import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureHighlights } from './components/FeatureHighlights.tsx';
import { SpecialCards } from './components/SpecialCards.tsx';
import { SpecialCoffee } from './components/SpecialCoffee.tsx';
import { MenuCatalog } from './components/MenuCatalog.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ServiceFeaturesBar } from './components/ServiceFeaturesBar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { Product, CartItem, Order } from './types/index.ts';
import { INITIAL_PRODUCTS } from '../server/seedData.ts';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS as Product[]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discount, setDiscount] = useState(0);

  // Load products from backend REST API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (e) {
      console.warn('API fetch products fallback to initial data', e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, notes?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product._id === product._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (notes) updated[existingIndex].notes = notes;
        return updated;
      } else {
        return [...prev, { product, quantity, notes }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const handleApplyPromo = (code: string) => {
    if (code.toUpperCase() === 'SWEET10' || code.toUpperCase() === 'COFFEE10') {
      const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      setDiscount(subtotal * 0.1);
      return true;
    }
    return false;
  };

  // Navigation click routing
  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'cosset') {
      setSelectedCategory('cosset');
      const elem = document.getElementById('menu-catalog');
      elem?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'confect') {
      setSelectedCategory('confect');
      const elem = document.getElementById('menu-catalog');
      elem?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'abouts') {
      const elem = document.getElementById('abouts');
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreMore = () => {
    setSelectedCategory('all');
    const elem = document.getElementById('menu-catalog');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  // Find featured items
  const muilSpecial = products.find((p) => p.name.toLowerCase().includes('müil') || p.name.toLowerCase().includes('muil'));
  const latteSpecial = products.find((p) => p.name.toLowerCase().includes('latte') || p.category === 'coffee');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal === 0 || cartSubtotal >= 29 ? 0 : 4.5;
  const cartTotal = Math.max(0, cartSubtotal - discount + deliveryFee);

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2823] flex flex-col selection:bg-[#163325] selection:text-[#F8F4EC]">
      {/* 1. Top Navbar */}
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onExploreMore={handleExploreMore}
          onQuickAddHeroLatte={() => {
            if (latteSpecial) handleAddToCart(latteSpecial);
            else if (products[0]) handleAddToCart(products[0]);
          }}
        />

        {/* 3. Feature Highlight Row (Finest Ingredients, Perfectly Brewed, Made with Love) */}
        <FeatureHighlights />

        {/* 4. Product / Special Card Section (Aatis, Lermi, Flitre) */}
        <SpecialCards
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
        />

        {/* 5. Special Coffee Section (Müil Coffee, 100% Arabica, Brewed for You badge) */}
        <SpecialCoffee
          onDiscoverMore={handleExploreMore}
          onAddToCart={(p) => handleAddToCart(p)}
          specialProduct={muilSpecial}
        />

        {/* 6. Curated Menu Catalog (Cosset & Confect browser with category tabs) */}
        <MenuCatalog
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* 7. Abouts / Philosophy Section */}
        <AboutSection />

        {/* 8. Dark Green Service Feature Bar (Free Delivery, Secure Payment, Premium Quality, 24/7 Support) */}
        <ServiceFeaturesBar />
      </main>

      {/* 9. Main Footer (Copyright, We Accept payment cards, Follow Us socials) */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onSelectSection={handleSelectSection}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, notes) => handleAddToCart(p, qty, notes)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        discount={discount}
        onApplyPromo={handleApplyPromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        discount={discount}
        total={cartTotal}
        onOrderSuccess={(_order: Order) => {
          setCart([]);
          setDiscount(0);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshProducts={fetchProducts}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
