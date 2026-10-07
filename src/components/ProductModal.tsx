import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Check, ShieldAlert, Sparkles, Star } from 'lucide-react';
import { Product } from '../types/index.ts';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, notes?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, notes);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#F8F4EC] rounded-3xl shadow-2xl overflow-hidden border border-[#E8DFD3] max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#163325] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Product Image */}
        <div className="md:w-1/2 bg-[#F1E8DC] p-6 flex items-center justify-center relative overflow-hidden">
          <div className="w-full aspect-square max-w-[280px] relative flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain filter drop-shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.category && (
            <span className="absolute top-4 left-4 bg-[#163325] text-[#F8F4EC] text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-none space-y-5">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl font-medium text-[#163325]">
                  {product.name}
                </h3>
                <span className="font-mono text-xl font-bold text-[#163325]">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <p className="font-script text-xl text-[#BA8657] font-medium">
                {product.subtitle}
              </p>
            </div>

            <p className="text-xs md:text-sm text-[#546258] leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients or Allergens */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="pt-2">
                <h5 className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider mb-1">
                  Key Ingredients:
                </h5>
                <p className="text-xs text-[#637267]">
                  {product.ingredients.join(', ')}
                </p>
              </div>
            )}

            {product.allergens && product.allergens.length > 0 && (
              <div className="p-2.5 rounded-xl bg-[#F0E6D9] border border-[#E4D5C5] text-[11px] text-[#55645A] flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#BA8657] shrink-0" />
                <span>Allergens: {product.allergens.join(', ')}</span>
              </div>
            )}

            {/* Special Instructions */}
            <div className="pt-1">
              <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                Special Barista Note (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Oat milk, extra warm, separate packaging..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white/80 border border-[#D9CABE] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-[#E8DFD3] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#65736A]">Quantity</span>
              <div className="flex items-center space-x-2 bg-white border border-[#D6C7B7] rounded-full p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full hover:bg-[#F2EAE0] flex items-center justify-center text-[#163325] transition-colors cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-mono font-semibold text-[#163325]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full hover:bg-[#F2EAE0] flex items-center justify-center text-[#163325] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={addedNotice}
              className={`w-full py-3.5 px-6 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer ${
                addedNotice
                  ? 'bg-emerald-800 text-white'
                  : 'bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC]'
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO ORDER · ${(product.price * quantity).toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
