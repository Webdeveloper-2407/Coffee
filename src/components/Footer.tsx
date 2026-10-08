import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Pin, Send, Check } from 'lucide-react';
import { apiClient } from '../lib/api.ts';

interface FooterProps {
  onOpenContact: () => void;
  onSelectSection: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onSelectSection }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes('@') || !trimmed.includes('.')) {
      setStatus('error');
      setMessage("We couldn't complete your subscription. Please enter a valid email address.");
      return;
    }

    try {
      setStatus('loading');
      const res = await apiClient.subscribeNewsletter(trimmed);
      setStatus('success');
      setMessage(res.message || 'Thanks for subscribing to the Coffeë Gazette.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage("We couldn't complete your subscription. Please try again.");
    }
  };

  return (
    <footer className="w-full bg-[#F8F4EC] text-[#334237] pt-12 pb-10 border-t border-[#E8DFCFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Upper Footer Row: Newsletter & Café Hours */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-[#E8DFCFC] items-center">
          <div className="md:col-span-6 space-y-2">
            <span className="font-serif text-2xl font-medium text-[#163325]">
              Join the Coffeë Gazette
            </span>
            <p className="text-xs md:text-sm text-[#66756C] max-w-md">
              Receive secret seasonal recipes, barista origin dispatches, and invitation-only tasting events.
            </p>
          </div>

          <div className="md:col-span-6">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 max-w-md ml-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for newsletter"
                className="flex-1 bg-[#FAF6F0] border border-[#D8CABE] px-4 py-2.5 rounded-full text-xs md:text-sm text-[#163325] placeholder:text-[#9EA8A1] focus:outline-none focus:ring-1 focus:ring-[#163325]"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                aria-label="Subscribe to newsletter"
                className="bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-colors shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <span>Subscribing...</span>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined!</span>
                  </>
                ) : (
                  <>
                    <span>SUBSCRIBE</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
            {message && (
              <p
                role="alert"
                className={`text-xs mt-2 text-right ${
                  status === 'success' ? 'text-emerald-800 font-medium' : 'text-rose-800'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Essential Row (Matching reference image) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#5C6B62]">
          {/* Left: Menu symbol + Copyright */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onSelectSection('abouts')}
              className="p-1 hover:text-[#163325] transition-colors cursor-pointer"
              aria-label="View about our atelier"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span>© 2026 Coffeë. All rights reserved.</span>
            <button
              onClick={onOpenContact}
              className="text-[#BA8657] hover:underline font-medium ml-2 cursor-pointer"
            >
              Contact Atelier
            </button>
          </div>

          {/* Center: "We Accept" with Payment Logos */}
          <div className="flex items-center space-x-3">
            <span className="text-[#78887E] font-medium">We Accept</span>
            <div className="flex items-center space-x-2">
              {/* Visa Badge */}
              <span className="font-sans font-extrabold text-blue-800 text-[11px] tracking-tight border border-[#D5C7B7] px-1.5 py-0.5 rounded bg-white shadow-2xs">
                VISA
              </span>
              {/* Mastercard Symbol */}
              <div className="flex items-center border border-[#D5C7B7] px-1.5 py-0.5 rounded bg-white shadow-2xs" title="Mastercard">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block -mr-1 opacity-90" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block opacity-90" />
              </div>
              {/* PayPal Badge */}
              <span className="font-sans font-bold text-blue-600 text-[10px] italic border border-[#D5C7B7] px-1.5 py-0.5 rounded bg-white shadow-2xs">
                PayPal
              </span>
              {/* Apple Pay Badge */}
              <span className="font-sans font-medium text-black text-[10px] border border-[#D5C7B7] px-1.5 py-0.5 rounded bg-white shadow-2xs flex items-center gap-0.5">
                Pay
              </span>
            </div>
          </div>

          {/* Right: "Follow Us" with Real Working Social Links */}
          <div className="flex items-center space-x-3">
            <span className="text-[#78887E] font-medium">Follow Us</span>
            <div className="flex items-center space-x-2.5 text-[#37453C]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Coffeë on Instagram"
                className="w-7 h-7 rounded-full bg-[#EFE6DC] hover:bg-[#163325] hover:text-[#F8F4EC] flex items-center justify-center transition-colors shadow-2xs"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Coffeë on Facebook"
                className="w-7 h-7 rounded-full bg-[#EFE6DC] hover:bg-[#163325] hover:text-[#F8F4EC] flex items-center justify-center transition-colors shadow-2xs"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Coffeë on Twitter / X"
                className="w-7 h-7 rounded-full bg-[#EFE6DC] hover:bg-[#163325] hover:text-[#F8F4EC] flex items-center justify-center transition-colors shadow-2xs"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Coffeë on Pinterest"
                className="w-7 h-7 rounded-full bg-[#EFE6DC] hover:bg-[#163325] hover:text-[#F8F4EC] flex items-center justify-center transition-colors shadow-2xs"
              >
                <Pin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
