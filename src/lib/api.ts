import { Product, Order, Review, ContactMessage, NewsletterSubscriber } from '../types/index.ts';
import { INITIAL_PRODUCTS } from '../data/products.ts';

// Keys for local persistence fallback
const STORAGE_KEYS = {
  ORDERS: 'coffee_orders_store',
  PRODUCTS: 'coffee_products_store',
  NEWSLETTER: 'coffee_newsletter_store',
  CONTACTS: 'coffee_contacts_store',
  REVIEWS: 'coffee_reviews_store',
};

// Seed fallback data if empty in localStorage
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage quota exceeded or disabled', e);
  }
}

// Initial default reviews
const DEFAULT_REVIEWS: Review[] = [
  {
    _id: 'rev-1',
    author: 'Genevieve Dupré',
    role: 'Food & Wine Columnist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'March 24, 2026',
    comment: 'The Aatis pistachio cake is a masterclass in balance — silky, not overly sugary, with roasted Sicilian pistachios that crunch delicately with every bite. The Müil coffee pairs like velvet.',
    itemOrdered: 'Aatis (Pistachio Bliss) + Müil Coffee',
    verified: true,
  },
  {
    _id: 'rev-2',
    author: 'Marcus Chen',
    role: 'Architect & Coffee Roaster',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'April 2, 2026',
    comment: 'Their Panama Geisha and Kyoto Slow Drip are extracted with clinical precision. It is exceedingly rare to find a café with world-class beans that also bakes laminated viennoiserie on par with Paris.',
    itemOrdered: 'Kyoto Slow Drip & Cardamom Braid',
    verified: true,
  },
  {
    _id: 'rev-3',
    author: 'Camille Beaumont',
    role: 'Verified Patron',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'April 4, 2026',
    comment: 'Ordered through the site for a Sunday brunch delivery. Arrived in under 30 minutes in pristine temperature-controlled pastry boxes. The Lermi chocolate dream was still glossy like a jewel mirror.',
    itemOrdered: 'Lermi (Chocolate Dream) & Flitre',
    verified: true,
  },
  {
    _id: 'rev-4',
    author: 'David Thorne',
    role: 'Sommelier',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'March 18, 2026',
    comment: 'The single-origin Ethiopian espresso here genuinely highlights jasmine blossom and bergamot without the aggressive sharpness you get at ordinary third-wave shops. Flawless roasting profile.',
    itemOrdered: 'Yirgacheffe G1 Reserve & Kouign-Amann',
    verified: true,
  },
  {
    _id: 'rev-5',
    author: 'Elena Rostova',
    role: 'Design Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'February 28, 2026',
    comment: 'Every visit feels restorative. The warm beige decor, the aroma of roasting Arabica, and the flawless honeycomb crumb of the Normandy butter croissant make this our daily creative sanctuary.',
    itemOrdered: 'Sweet Moments Latte & Croissant Au Beurre',
    verified: true,
  },
  {
    _id: 'rev-6',
    author: 'Siddharth Patel',
    role: 'Verified Patron',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80',
    rating: 5,
    date: 'March 30, 2026',
    comment: 'I usually skip dairy so their Minor Figures oat milk lattes and Nitro Cloud Draught are absolute game changers. Plus, the packaging is entirely biodegradable.',
    itemOrdered: 'Nitro Cloud Draught',
    verified: true,
  },
];

export const apiClient = {
  // PRODUCTS
  async getProducts(params?: { category?: string; search?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'all') query.set('category', params.category);
      if (params?.search) query.set('search', params.search);

      const res = await fetch(`/api/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStored(STORAGE_KEYS.PRODUCTS, data);
          return data;
        }
      }
    } catch {
      // fallback
    }

    // Storage or hardcoded catalog
    let list = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!list || list.length === 0) list = INITIAL_PRODUCTS;

    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const created: Product = {
      _id: `prod-${Date.now()}`,
      name: product.name || 'Artisanal Creation',
      subtitle: product.subtitle || 'Pastry Special',
      description: product.description || '',
      price: product.price || 7.5,
      category: product.category || 'cosset',
      image: product.image || '/images/aatis-pistachio.jpg',
      tagline: product.tagline || 'Freshly made',
      featured: false,
      available: true,
      rating: 5.0,
      reviewCount: 1,
      tags: product.tags || ['New'],
      createdAt: new Date().toISOString(),
    };

    const current = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(STORAGE_KEYS.PRODUCTS, [created, ...current]);
    return created;
  },

  async toggleProductStock(product: Product): Promise<Product> {
    const updated = { ...product, available: !product.available };
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: updated.available }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const current = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const next = current.map((p) => (p._id === product._id ? updated : p));
    setStored(STORAGE_KEYS.PRODUCTS, next);
    return updated;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // fallback
    }

    const current = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const next = current.filter((p) => p._id !== productId);
    setStored(STORAGE_KEYS.PRODUCTS, next);
    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setStored(STORAGE_KEYS.ORDERS, data);
          return data;
        }
      }
    } catch {
      // fallback
    }

    return getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async createOrder(orderPayload: any): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const order = await res.json();
        const current = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
        setStored(STORAGE_KEYS.ORDERS, [order, ...current]);
        return order;
      }
    } catch {
      // fallback
    }

    // Local resilient order creation
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const count = getStored<Order[]>(STORAGE_KEYS.ORDERS, []).length + 1043;
    const orderNumber = `COF-${count}`;

    const newOrder: Order = {
      _id: `ord-${Date.now()}-${randomSuffix}`,
      orderNumber,
      customer: orderPayload.customer,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      deliveryFee: orderPayload.deliveryFee,
      discount: orderPayload.discount || 0,
      total: orderPayload.total,
      paymentMethod: orderPayload.paymentMethod || 'credit_card',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const current = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    setStored(STORAGE_KEYS.ORDERS, [newOrder, ...current]);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }

    const current = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    const next = current.map((o) => (o._id === orderId ? { ...o, status: status as any } : o));
    setStored(STORAGE_KEYS.ORDERS, next);
    return true;
  },

  // NEWSLETTER
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message || 'Thanks for subscribing to the Coffeë Gazette.' };
      }
    } catch {
      // fallback
    }

    // Save in storage
    const current = getStored<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
    if (!current.some((s) => s.email.toLowerCase() === trimmed)) {
      setStored(STORAGE_KEYS.NEWSLETTER, [
        { _id: `sub-${Date.now()}`, email: trimmed, createdAt: new Date().toISOString() },
        ...current,
      ]);
    }
    return { success: true, message: 'Thanks for subscribing to the Coffeë Gazette.' };
  },

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const res = await fetch('/api/newsletter');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // fallback
    }
    return getStored<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
  },

  // CONTACT
  async submitContact(data: { name: string; email: string; subject?: string; message: string }): Promise<string> {
    if (!data.name || !data.email || !data.message) {
      throw new Error('Please fill out all required fields.');
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.message || 'Thank you! Your message has been received.';
      }
    } catch {
      // fallback
    }

    const current = getStored<ContactMessage[]>(STORAGE_KEYS.CONTACTS, []);
    const newMsg: ContactMessage = {
      _id: `msg-${Date.now()}`,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      createdAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.CONTACTS, [newMsg, ...current]);
    return 'Thank you! Your message has been received by our atelier concierge.';
  },

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // fallback
    }
    return getStored<ContactMessage[]>(STORAGE_KEYS.CONTACTS, []);
  },

  // REVIEWS
  async getReviews(): Promise<Review[]> {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStored(STORAGE_KEYS.REVIEWS, data);
          return data;
        }
      }
    } catch {
      // fallback
    }

    return getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
  },

  async submitReview(review: Omit<Review, '_id' | 'date'>): Promise<Review> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const newRev: Review = {
      _id: `rev-${Date.now()}`,
      author: review.author,
      role: review.role || 'Verified Patron',
      avatar: review.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      rating: review.rating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: review.comment,
      itemOrdered: review.itemOrdered || 'Specialty Coffee',
      verified: true,
    };

    const current = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    setStored(STORAGE_KEYS.REVIEWS, [newRev, ...current]);
    return newRev;
  },

  // STATS
  async getStats() {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const orders = getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
    const products = getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const contacts = getStored<ContactMessage[]>(STORAGE_KEYS.CONTACTS, []);
    const subs = getStored<NewsletterSubscriber[]>(STORAGE_KEYS.NEWSLETTER, []);
    const revs = getStored<Review[]>(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'brewing').length;
    const activeProducts = products.filter((p) => p.available).length;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      ordersCount: orders.length,
      pendingOrders,
      productsCount: products.length,
      activeProducts,
      contactsCount: contacts.length,
      newslettersCount: subs.length,
      reviewsCount: revs.length,
    };
  },
};
