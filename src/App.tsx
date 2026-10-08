import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { FeatureHighlights } from './components/FeatureHighlights.tsx';
import { SpecialCards } from './components/SpecialCards.tsx';
import { SpecialCoffee } from './components/SpecialCoffee.tsx';
import { MenuCatalog } from './components/MenuCatalog.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { ServiceFeaturesBar } from './components/ServiceFeaturesBar.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { AdminModal } from './components/AdminModal.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { Product, CartItem, Order, Review } from './types/index.ts';
import { INITIAL_PRODUCTS } from './data/products.ts';
import { apiClient } from './lib/api.ts';

const CART_STORAGE_KEY = 'coffee_patron_cart_v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discount, setDiscount] = useState(0);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart state', e);
    }
  }, [cart]);

  // Load products and reviews
  const loadInitialData = async () => {
    try {
      const [prods, revs] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getReviews(),
      ]);
      if (prods && prods.length > 0) setProducts(prods);
      if (revs && revs.length > 0) setReviews(revs);
    } catch (e) {
      console.warn('Initial data load warning', e);
    }
  };

  useEffect(() => {
    loadInitialData();
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

  const handleClearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const handleApplyPromo = (code: string) => {
    const formatted = code.toUpperCase().trim();
    if (formatted === 'SWEET10' || formatted === 'COFFEE10') {
      const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      setDiscount(subtotal * 0.1);
      return true;
    }
    return false;
  };

  // Add a new review
  const handleAddReview = async (newReviewData: Omit<Review, '_id' | 'date'>) => {
    const created = await apiClient.submitReview(newReviewData);
    setReviews((prev) => [created, ...prev]);
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

        {/* 6. Curated Menu Catalog (Expanded 110-product catalog across 5 categories) */}
        <MenuCatalog
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* 7. Abouts / Philosophy Section */}
        <AboutSection />

        {/* 8. Patron Dispatches & Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* 9. Dark Green Service Feature Bar (Free Delivery, Secure Payment, Premium Quality, 24/7 Support) */}
        <ServiceFeaturesBar />
      </main>

      {/* 10. Main Footer (Copyright, We Accept payment cards, Real Social links, Newsletter) */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onSelectSection={handleSelectSection}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        allProducts={products}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p, qty, notes) => handleAddToCart(p, qty, notes)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
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
          handleClearCart();
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
        onRefreshProducts={loadInitialData}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
