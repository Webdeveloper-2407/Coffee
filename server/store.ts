import { ProductModel } from './models/Product.ts';
import { OrderModel } from './models/Order.ts';
import { ContactModel } from './models/Contact.ts';
import { NewsletterModel } from './models/Newsletter.ts';
import { ReviewModel } from './models/Review.ts';
import { INITIAL_PRODUCTS } from './seedData.ts';
import { isDbConnected } from './db/connection.ts';

// In-memory collections as dependable fallbacks with synchronized initialization
let memoryProducts: any[] = [...INITIAL_PRODUCTS];

let memoryOrders: any[] = [
  {
    _id: 'ord-1041',
    orderNumber: 'COF-1041',
    customer: {
      name: 'Elena Rostova',
      email: 'elena@example.com',
      phone: '+1 (555) 234-8971',
      address: '742 Evergreen Terrace, Apt 4B',
      city: 'Portland, OR',
      postalCode: '97201',
      specialInstructions: 'Please leave at the door with a smile.',
    },
    items: [
      {
        productId: 'prod-aatis-pistachio',
        name: 'Aatis - Pistachio Bliss',
        price: 8.50,
        quantity: 2,
        image: '/images/aatis-pistachio.jpg',
      },
      {
        productId: 'prod-muil-special',
        name: 'Müil Coffee',
        price: 6.50,
        quantity: 1,
        image: '/images/special-muil.jpg',
      },
    ],
    subtotal: 23.50,
    deliveryFee: 4.50,
    discount: 0,
    total: 28.00,
    paymentMethod: 'credit_card',
    status: 'brewing',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    _id: 'ord-1042',
    orderNumber: 'COF-1042',
    customer: {
      name: 'Julian Vance',
      email: 'julian.v@example.com',
      phone: '+1 (555) 981-4320',
      address: '1204 Pine Street, Suite 200',
      city: 'Seattle, WA',
      postalCode: '98101',
      specialInstructions: 'Ring bell on arrival.',
    },
    items: [
      {
        productId: 'prod-lermi-chocolate',
        name: 'Lermi - Chocolate Dream',
        price: 9.00,
        quantity: 1,
        image: '/images/lermi-chocolate.jpg',
      },
      {
        productId: 'prod-flitre-berry',
        name: 'Flitre - Berry Delight',
        price: 8.75,
        quantity: 2,
        image: '/images/flitre-berry.jpg',
      },
      {
        productId: 'prod-muil-special',
        name: 'Müil Coffee',
        price: 6.50,
        quantity: 2,
        image: '/images/special-muil.jpg',
      },
    ],
    subtotal: 39.50,
    deliveryFee: 0,
    discount: 0,
    total: 39.50,
    paymentMethod: 'apple_pay',
    status: 'out_for_delivery',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

let memoryContacts: any[] = [
  {
    _id: 'msg-101',
    name: 'Sophia Laurent',
    email: 'sophia.l@artisanbakes.com',
    subject: 'Catering for private exhibition',
    message: 'We loved your Aatis Pistachio cake at the salon yesterday. Would it be possible to pre-order 40 individual servings for a gallery opening next Friday?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    _id: 'msg-102',
    name: 'Liam Sterling',
    email: 'liam.s@nordicstudio.co',
    subject: 'Specialty bean subscription inquiry',
    message: 'Do you offer monthly 1kg bags of the Yirgacheffe G1 Reserve for our design team? Looking forward to your reply.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

let memoryNewsletters: any[] = [
  {
    _id: 'sub-1',
    email: 'clara.m@editorial-coffee.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    _id: 'sub-2',
    email: 'marcus.w@specialtybeans.org',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'sub-3',
    email: 'hannah.k@pastrydigest.fr',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

let memoryReviews: any[] = [
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

// Product operations
export async function getProducts(filter?: { category?: string; featured?: boolean; search?: string }) {
  if (isDbConnected()) {
    try {
      const query: any = {};
      if (filter?.category && filter.category !== 'all') query.category = filter.category;
      if (filter?.featured !== undefined) query.featured = filter.featured;
      if (filter?.search) {
        query.$or = [
          { name: { $regex: filter.search, $options: 'i' } },
          { subtitle: { $regex: filter.search, $options: 'i' } },
          { description: { $regex: filter.search, $options: 'i' } },
          { tags: { $in: [new RegExp(filter.search, 'i')] } },
        ];
      }
      const docs = await ProductModel.find(query).sort({ createdAt: -1 });
      if (docs.length > 0) return docs;
    } catch (e) {
      console.warn('[Store] DB query failed, using memory store fallback');
    }
  }

  let results = [...memoryProducts];
  if (filter?.category && filter.category !== 'all') {
    results = results.filter((p) => p.category === filter.category);
  }
  if (filter?.featured !== undefined) {
    results = results.filter((p) => p.featured === filter.featured);
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(q))
    );
  }
  return results;
}

export async function getProductById(id: string) {
  if (isDbConnected()) {
    try {
      const doc = await ProductModel.findById(id);
      if (doc) return doc;
    } catch (e) {
      // ignore
    }
  }
  return memoryProducts.find((p) => p._id === id || p.id === id);
}

export async function createProduct(data: any) {
  if (isDbConnected()) {
    try {
      const doc = await ProductModel.create(data);
      return doc;
    } catch (e) {
      console.warn('[Store] DB creation failed, saving to memory');
    }
  }

  const newProduct = {
    _id: `prod-${Date.now()}`,
    ...data,
    available: data.available ?? true,
    rating: data.rating || 4.9,
    reviewCount: data.reviewCount || 1,
    tags: data.tags || ['New'],
    createdAt: new Date().toISOString(),
  };
  memoryProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: any) {
  if (isDbConnected()) {
    try {
      const doc = await ProductModel.findByIdAndUpdate(id, data, { new: true });
      if (doc) return doc;
    } catch (e) {
      // fallback
    }
  }

  const index = memoryProducts.findIndex((p) => p._id === id);
  if (index !== -1) {
    memoryProducts[index] = { ...memoryProducts[index], ...data };
    return memoryProducts[index];
  }
  return null;
}

export async function deleteProduct(id: string) {
  if (isDbConnected()) {
    try {
      await ProductModel.findByIdAndDelete(id);
      return true;
    } catch (e) {
      // fallback
    }
  }

  const prevLen = memoryProducts.length;
  memoryProducts = memoryProducts.filter((p) => p._id !== id);
  return memoryProducts.length < prevLen;
}

// Order operations
export async function getOrders() {
  if (isDbConnected()) {
    try {
      const docs = await OrderModel.find().sort({ createdAt: -1 });
      if (docs.length > 0) return docs;
    } catch (e) {
      // fallback
    }
  }
  return memoryOrders;
}

export async function getOrderById(id: string) {
  if (isDbConnected()) {
    try {
      const doc = await OrderModel.findById(id);
      if (doc) return doc;
    } catch (e) {
      // fallback
    }
  }
  return memoryOrders.find((o) => o._id === id || o.orderNumber === id);
}

export async function createOrder(data: any) {
  const count = memoryOrders.length + 1043;
  const orderNumber = `COF-${count}`;
  const orderPayload = {
    ...data,
    orderNumber,
    status: data.status || 'pending',
    createdAt: new Date().toISOString(),
  };

  if (isDbConnected()) {
    try {
      const doc = await OrderModel.create(orderPayload);
      return doc;
    } catch (e) {
      console.warn('[Store] DB createOrder failed, fallback to memory');
    }
  }

  const newOrder = {
    _id: `ord-${Date.now()}`,
    ...orderPayload,
  };
  memoryOrders.unshift(newOrder);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: string) {
  if (isDbConnected()) {
    try {
      const doc = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
      if (doc) return doc;
    } catch (e) {
      // fallback
    }
  }

  const order = memoryOrders.find((o) => o._id === id || o.orderNumber === id);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
}

// Reviews operations
export async function getReviews() {
  if (isDbConnected()) {
    try {
      const docs = await ReviewModel.find().sort({ createdAt: -1 });
      if (docs.length > 0) return docs;
    } catch (e) {
      // fallback
    }
  }
  return memoryReviews;
}

export async function createReview(data: any) {
  const reviewPayload = {
    ...data,
    date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    verified: data.verified ?? true,
    createdAt: new Date().toISOString(),
  };

  if (isDbConnected()) {
    try {
      const doc = await ReviewModel.create(reviewPayload);
      return doc;
    } catch (e) {
      console.warn('[Store] DB createReview failed, fallback to memory');
    }
  }

  const newReview = {
    _id: `rev-${Date.now()}`,
    ...reviewPayload,
  };
  memoryReviews.unshift(newReview);
  return newReview;
}

// Contact messages
export async function createContact(data: any) {
  if (isDbConnected()) {
    try {
      const doc = await ContactModel.create(data);
      return doc;
    } catch (e) {
      // fallback
    }
  }

  const newContact = {
    _id: `msg-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  memoryContacts.unshift(newContact);
  return newContact;
}

export async function getContacts() {
  if (isDbConnected()) {
    try {
      const docs = await ContactModel.find().sort({ createdAt: -1 });
      if (docs.length > 0) return docs;
    } catch (e) {
      // fallback
    }
  }
  return memoryContacts;
}

// Newsletter subscribers
export async function subscribeNewsletter(email: string) {
  const normalized = email.trim().toLowerCase();

  if (isDbConnected()) {
    try {
      const existing = await NewsletterModel.findOne({ email: normalized });
      if (existing) return existing;
      const doc = await NewsletterModel.create({ email: normalized });
      return doc;
    } catch (e) {
      // fallback
    }
  }

  const existing = memoryNewsletters.find((n) => n.email.toLowerCase() === normalized);
  if (existing) return existing;

  const newSub = {
    _id: `sub-${Date.now()}`,
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  memoryNewsletters.unshift(newSub);
  return newSub;
}

export async function getNewsletters() {
  if (isDbConnected()) {
    try {
      const docs = await NewsletterModel.find().sort({ createdAt: -1 });
      if (docs.length > 0) return docs;
    } catch (e) {
      // fallback
    }
  }
  return memoryNewsletters;
}

// Analytics and summary
export async function getDashboardStats() {
  const orders = await getOrders();
  const products = await getProducts();
  const contacts = await getContacts();
  const newsletters = await getNewsletters();
  const reviews = await getReviews();

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'brewing').length;
  const activeProducts = products.filter((p: any) => p.available).length;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    ordersCount: orders.length,
    pendingOrders,
    productsCount: products.length,
    activeProducts,
    contactsCount: contacts.length,
    newslettersCount: newsletters.length,
    reviewsCount: reviews.length,
  };
}
