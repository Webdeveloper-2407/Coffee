import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, Coffee, Truck } from 'lucide-react';
import { CartItem, Order } from '../types/index.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryFee,
  discount,
  total,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 349-2190',
    address: '428 Kensington Crescent, Apt 3A',
    city: 'Seattle, WA',
    postalCode: '98109',
    specialInstructions: 'Ring buzzer #3A. Fragile pastry box handling appreciated.',
    paymentMethod: 'credit_card' as 'credit_card' | 'paypal' | 'apple_pay' | 'cash_on_delivery',
  });

  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      setErrorMessage('Please fill in all mandatory customer fields.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          specialInstructions: formData.specialInstructions,
        },
        items: items.map((i) => ({
          productId: i.product._id,
          name: `${i.product.name} - ${i.product.subtitle}`,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal,
        deliveryFee,
        discount,
        total,
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Order creation failed on server');
      }

      const createdOrder = await res.json();
      setConfirmedOrder(createdOrder);
      onOrderSuccess(createdOrder);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing order. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#F8F4EC] rounded-3xl shadow-2xl overflow-hidden border border-[#E4D7C8] my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#163325] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedOrder ? (
          /* Success Screen Receipt */
          <div className="p-8 md:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#DEE8DC] text-[#1F3C2C] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9 stroke-[2]" />
            </div>

            <div>
              <span className="font-script text-2xl text-[#BA8657]">Order Confirmed</span>
              <h3 className="font-serif text-3xl font-bold text-[#163325] mt-1">
                Sweet Moments on the Way
              </h3>
              <p className="text-xs text-[#5C6A61] mt-1 font-mono">
                Order Reference: <strong>{confirmedOrder.orderNumber || confirmedOrder._id}</strong>
              </p>
            </div>

            <div className="bg-[#F3ECE0] rounded-2xl p-5 text-left text-xs space-y-3 border border-[#E2D5C3]">
              <div className="flex justify-between items-center pb-2 border-b border-[#DECFC0]">
                <span className="font-semibold text-[#163325]">Estimated Arrival:</span>
                <span className="font-mono text-[#BA8657] font-bold">25 - 35 minutes</span>
              </div>
              <div>
                <p className="font-semibold text-[#163325]">Delivering to:</p>
                <p className="text-[#59685F] mt-0.5">{confirmedOrder.customer.name}</p>
                <p className="text-[#59685F]">{confirmedOrder.customer.address}, {confirmedOrder.customer.city}</p>
              </div>
              <div className="pt-2 border-t border-[#DECFC0] flex justify-between font-bold text-[#163325]">
                <span>Total Charged:</span>
                <span className="font-mono">${confirmedOrder.total.toFixed(2)} ({confirmedOrder.paymentMethod.replace('_', ' ').toUpperCase()})</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] rounded-full text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                RETURN TO CAFÉ
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div>
              <span className="font-script text-2xl text-[#BA8657]">Atelier Checkout</span>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-[#163325]">
                Complete Your Order
              </h3>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-100 border border-rose-300 text-rose-800 text-xs rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                  Delivery Gate / Special Instructions
                </label>
                <input
                  type="text"
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="e.g. Leave on bench outside front door"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-2">
                Select Payment Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay', label: 'Apple Pay', icon: ShieldCheck },
                  { id: 'paypal', label: 'PayPal', icon: CreditCard },
                  { id: 'cash_on_delivery', label: 'Pay on Arrival', icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = formData.paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id as any })}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#163325] bg-[#163325] text-white shadow-xs'
                          : 'border-[#DACDBD] bg-white text-[#425046] hover:bg-[#F3ECE2]'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-2" />
                      <span className="text-[11px] font-semibold">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Brief */}
            <div className="bg-[#F0E6D8] p-4 rounded-2xl border border-[#E1D4C3] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6B7970]">{items.length} items in box · </span>
                <strong className="text-[#163325]">{deliveryFee === 0 ? 'Free Delivery' : '$4.50 Delivery'}</strong>
              </div>
              <div className="text-right">
                <span className="text-[#6B7970]">Total to Pay: </span>
                <span className="font-mono text-base font-bold text-[#163325]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-full bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] text-xs font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Transmitting order to barista counter...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>AUTHORIZE & PLACE ORDER (${total.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
