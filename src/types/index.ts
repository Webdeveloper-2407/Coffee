export interface Product {
  _id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  category: 'cosset' | 'confect' | 'special' | 'coffee' | 'cold-brew';
  image: string;
  tagline?: string;
  featured: boolean;
  available: boolean;
  cardBgColor?: string;
  buttonBgColor?: string;
  rating?: number;
  calories?: string;
  allergens?: string[];
  ingredients?: string[];
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: 'Regular' | 'Large';
  notes?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  postalCode?: string;
  specialInstructions?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  customer: CustomerInfo;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    selectedSize?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery';
  status: 'pending' | 'brewing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
}
