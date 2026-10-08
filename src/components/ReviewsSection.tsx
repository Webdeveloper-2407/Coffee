import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X, Send } from 'lucide-react';
import { Review } from '../types/index.ts';

interface ReviewsSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, '_id' | 'date'>) => Promise<void>;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onAddReview,
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    role: 'Verified Patron',
    rating: 5,
    itemOrdered: '',
    comment: '',
  });

  const filtered = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === filterRating;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.comment) return;

    try {
      setSubmitting(true);
      await onAddReview({
        author: formData.author,
        role: formData.role || 'Verified Patron',
        rating: formData.rating,
        itemOrdered: formData.itemOrdered || 'House Blend',
        comment: formData.comment,
        verified: true,
      });
      setIsModalOpen(false);
      setFormData({
        author: '',
        role: 'Verified Patron',
        rating: 5,
        itemOrdered: '',
        comment: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 border-t border-[#E8DFD3]">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <span className="font-script text-2xl md:text-3xl text-[#BA8657]">
            Words From Our Table
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#163325]">
            Patron Dispatches & Notes
          </h2>
          <p className="text-sm md:text-base text-[#5C6B61] max-w-lg">
            Thoughts shared by coffee specialists, pastry lovers, and quiet morning wanderers who linger in our atelier.
          </p>
        </div>

        {/* Global Score & Add Review Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F5EDE1] p-4 rounded-2xl border border-[#E4D7C8]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl font-bold text-[#163325]">4.9</span>
            <div>
              <div className="flex text-[#BA8657]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[11px] text-[#718077]">1,240+ Verified Reviews</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#163325] hover:bg-[#254A37] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8">
        <span className="text-xs text-[#718077] mr-2">Filter:</span>
        <button
          onClick={() => setFilterRating('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            filterRating === 'all'
              ? 'bg-[#163325] text-white'
              : 'bg-[#EDE3D6] text-[#55645A] hover:bg-[#E3D6C5]'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setFilterRating(5)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
            filterRating === 5
              ? 'bg-[#163325] text-white'
              : 'bg-[#EDE3D6] text-[#55645A] hover:bg-[#E3D6C5]'
          }`}
        >
          5 Stars Only
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rev) => (
          <div
            key={rev._id}
            className="bg-[#FAF5ED] rounded-3xl p-6 border border-[#EAE0D3] shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Top Row: Stars + Date */}
              <div className="flex items-center justify-between">
                <div className="flex text-[#BA8657]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-[#89998F]">{rev.date}</span>
              </div>

              {/* Review Text */}
              <p className="text-xs md:text-sm text-[#48564E] leading-relaxed italic">
                "{rev.comment}"
              </p>

              {/* Ordered Item Badge */}
              {rev.itemOrdered && (
                <div className="inline-block bg-[#EFE6DB] px-3 py-1 rounded-full text-[10px] font-semibold text-[#163325]">
                  Tasted: {rev.itemOrdered}
                </div>
              )}
            </div>

            {/* Author Lockup */}
            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#EAE0D3]">
              <div className="w-10 h-10 rounded-full bg-[#E5DACD] overflow-hidden shrink-0 border border-[#D5C6B5] flex items-center justify-center font-serif text-sm font-bold text-[#163325]">
                {rev.avatar ? (
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  rev.author.charAt(0)
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h5 className="font-serif text-sm font-semibold text-[#163325] truncate">
                    {rev.author}
                  </h5>
                  {rev.verified && (
                    <span title="Verified Order">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#78887F] truncate">{rev.role || 'Verified Patron'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#F8F4EC] rounded-3xl shadow-2xl border border-[#E4D7C8] p-6 md:p-8 space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#163325] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="font-script text-2xl text-[#BA8657]">Share Your Impression</span>
              <h3 className="font-serif text-2xl font-normal text-[#163325]">
                Leave an Atelier Review
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Julian Vance"
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                    Your Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                    className="w-full text-xs px-3 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Wonderful)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                    Favorite Item Tasted
                  </label>
                  <input
                    type="text"
                    value={formData.itemOrdered}
                    onChange={(e) => setFormData({ ...formData, itemOrdered: e.target.value })}
                    placeholder="e.g. Aatis Pistachio Cake"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                  Your Review Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Describe your tasting notes, roast aromas, and experience..."
                  className="w-full text-xs px-3.5 py-2.5 bg-white border border-[#D5C6B6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#163325]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#163325] hover:bg-[#254A37] text-[#F8F4EC] rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting Review...' : 'POST PATRON REVIEW'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
