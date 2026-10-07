import React, { useState } from 'react';
import { X, Send, CheckCircle2, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setFeedback('Please provide your name, email, and message.');
      return;
    }

    try {
      setStatus('loading');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setFeedback(data.message || 'Thank you! Your message has been received.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to submit inquiry.');
      }
    } catch {
      setStatus('error');
      setFeedback('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#F8F4EC] rounded-3xl shadow-2xl border border-[#E3D6C5] overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#163325] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Atelier Contact Details (Left) */}
          <div className="md:col-span-5 bg-[#163325] text-[#F8F4EC] p-6 md:p-8 space-y-6">
            <div>
              <span className="font-script text-2xl text-[#BA8657]">Bonjour</span>
              <h3 className="font-serif text-2xl font-normal mt-1">
                Atelier Coffeë
              </h3>
              <p className="text-xs text-[#A1B3A7] mt-1 leading-relaxed">
                Visit our espresso bar or coordinate bespoke patisserie catering for private galas.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#BA8657] shrink-0 mt-0.5" />
                <span>142 Rue de l'Ambre, Seattle, WA 98101</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#BA8657] shrink-0" />
                <span>+1 (206) 555-0198</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#BA8657] shrink-0" />
                <span>concierge@coffee-atelier.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-[#BA8657] shrink-0 mt-0.5" />
                <span>Daily 07:00 AM – 07:00 PM</span>
              </div>
            </div>
          </div>

          {/* Form (Right) */}
          <div className="md:col-span-7 p-6 md:p-8">
            <h4 className="font-serif text-2xl font-medium text-[#163325] mb-4">
              Send an Inquiry
            </h4>

            {status === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
                <p className="font-serif text-lg text-[#163325]">{feedback}</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-3 px-5 py-2 bg-[#163325] text-white rounded-full text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {feedback && status === 'error' && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2 rounded-lg">{feedback}</p>
                )}

                <div>
                  <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                    Your Name
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
                    Email
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
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Catering, Dietary, Private Event"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#163325] uppercase tracking-wider block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can delight you..."
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{status === 'loading' ? 'Sending...' : 'TRANSMIT MESSAGE'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
