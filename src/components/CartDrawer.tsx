import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { CartItem } from '../types/index.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  discount: number;
  onApplyPromo: (code: string) => boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discount,
  onApplyPromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 29.0;
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.5;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyPromo(promoInput.trim());
    if (ok) {
      setPromoMessage({ text: 'Promo code applied: 10% off!', success: true });
    } else {
      setPromoMessage({ text: 'Invalid code. Try "SWEET10"', success: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F4EC] border-l border-[#E2D5C5] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#E8DFD3] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-[#163325]" />
              <h3 className="font-serif text-2xl font-semibold text-[#163325]">
                Your Order Bag
              </h3>
              <span className="text-xs bg-[#E7DDD0] text-[#163325] px-2 py-0.5 rounded-full font-mono font-medium">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="w-8 h-8 rounded-full hover:bg-[#EBE2D4] text-[#163325] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#EFE7DC] px-6 py-3 border-b border-[#E3D6C6]">
            <div className="flex items-center justify-between text-xs text-[#4E5C53] mb-1.5 font-medium">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Congratulations! Free Delivery unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="font-mono text-[#163325]">${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>Free Delivery</strong>
                </span>
              )}
              <span className="font-mono text-[11px] text-[#78877E]">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#DACDBD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#163325] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-[#EADFD2]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <div className="w-16 h-16 rounded-full bg-[#EFE7DC] flex items-center justify-center text-[#9FAEA4]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-serif text-xl font-medium text-[#163325]">
                  Your bag is empty
                </h4>
                <p className="text-xs text-[#6F7E75] max-w-xs">
                  Treat yourself to our signature Müil Coffee or a slice of fresh Aatis Pistachio cake.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-semibold text-[#BA8657] hover:underline cursor-pointer"
                >
                  Browse Creations →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product._id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl bg-[#EDE3D6] overflow-hidden shrink-0 flex items-center justify-center border border-[#E0D3C3]">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-serif text-base font-semibold text-[#163325] truncate">
                        {item.product.name}
                      </h5>
                      <span className="font-mono text-xs font-bold text-[#163325]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#718077] truncate">
                      {item.product.subtitle}
                    </p>
                    {item.notes && (
                      <p className="text-[10px] text-[#A67848] italic truncate">
                        Note: {item.notes}
                      </p>
                    )}

                    {/* Stepper & Remove */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1.5 bg-[#FAF6F0] border border-[#D8CABE] rounded-full p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full hover:bg-[#EBE1D4] flex items-center justify-center text-[#163325] cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-mono font-semibold text-[#163325]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full hover:bg-[#EBE1D4] flex items-center justify-center text-[#163325] cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product._id)}
                        className="text-[#9CA8A0] hover:text-rose-700 transition-colors p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E8DFD3] bg-[#F4EDE2]/80 space-y-4">
              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#88978E] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. SWEET10)"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white/90 border border-[#D5C5B5] rounded-xl uppercase tracking-wider placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-[#163325]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E2D5C5] hover:bg-[#D5C4B0] text-[#163325] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    promoMessage.success ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Subtotal breakdowns */}
              <div className="space-y-1.5 text-xs text-[#5C6B61]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#163325]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-mono text-[#163325]">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-[#163325] pt-2 border-t border-[#DECFC0]">
                  <span>Estimated Total</span>
                  <span className="font-mono">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-full bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
