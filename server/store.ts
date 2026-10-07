import { ProductModel, IProduct } from './models/Product.ts';
import { OrderModel, IOrder } from './models/Order.ts';
import { ContactModel, IContact } from './models/Contact.ts';
import { NewsletterModel, INewsletter } from './models/Newsletter.ts';
import { INITIAL_PRODUCTS } from './seedData.ts';
import { isDbConnected } from './db/connection.ts';

// In-memory collections as dependable fallbacks
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
        image: '/src/assets/images/cake_pistachio_aatis_1791337225871.jpg',
      },
      {
        productId: 'prod-muil-special',
        name: 'Müil Coffee',
        price: 6.50,
        quantity: 1,
        image: '/src/assets/images/special_muil_coffee_1791337256434.jpg',
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
        image: '/src/assets/images/cake_chocolate_lermi_1791337236872.jpg',
      },
      {
        productId: 'prod-flitre-berry',
        name: 'Flitre - Berry Delight',
        price: 8.75,
        quantity: 2,
        image: '/src/assets/images/cake_berry_flitre_1791337246458.jpg',
      },
      {
        productId: 'prod-muil-special',
        name: 'Müil Coffee',
        price: 6.50,
        quantity: 2,
        image: '/src/assets/images/special_muil_coffee_1791337256434.jpg',
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
];
let memoryNewsletters: any[] = [
  {
    _id: 'sub-1',
    email: 'clara.m@editorial-coffee.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: 'sub-2',
    email: 'marcus.w@specialtybeans.org',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

// Product operations
export async function getProducts(filter?: { category?: string; featured?: boolean }) {
  if (isDbConnected()) {
    try {
      const query: any = {};
      if (filter?.category && filter.category !== 'all') query.category = filter.category;
      if (filter?.featured !== undefined) query.featured = filter.featured;
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
    rating: data.rating || 5.0,
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
    status: 'pending',
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
  if (isDbConnected()) {
    try {
      const doc = await NewsletterModel.create({ email });
      return doc;
    } catch (e) {
      // fallback
    }
  }

  const existing = memoryNewsletters.find((n) => n.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;

  const newSub = {
    _id: `sub-${Date.now()}`,
    email,
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
  };
}
