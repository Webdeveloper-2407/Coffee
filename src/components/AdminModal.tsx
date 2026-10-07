import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  ShoppingBag,
  Mail,
  Users,
  Plus,
  Trash2,
  Edit2,
  Check,
  TrendingUp,
  Clock,
  RefreshCw,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Order, ContactMessage, NewsletterSubscriber } from '../types/index.ts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshProducts: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onRefreshProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'messages' | 'newsletter'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    subtitle: '',
    description: '',
    price: 7.5,
    category: 'cosset',
    image: '/src/assets/images/cake_pistachio_aatis_1791337225871.jpg',
    tagline: 'Freshly baked artisanal treat',
    available: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordRes, prodRes, msgRes, newsRes, statRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/contact'),
        fetch('/api/newsletter'),
        fetch('/api/admin/stats'),
      ]);

      if (ordRes.ok) setOrders(await ordRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (newsRes.ok) setSubscribers(await newsRes.json());
      if (statRes.ok) setStats(await statRes.json());
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const updated = { ...product, available: !product.available };
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, available: !p.available } : p))
        );
        onRefreshProducts();
      }
    } catch (e) {
      console.error('Failed to toggle product', e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        onRefreshProducts();
      }
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        const created = await res.json();
        setProducts([created, ...products]);
        setShowAddProduct(false);
        setNewProd({
          name: '',
          subtitle: '',
          description: '',
          price: 7.5,
          category: 'cosset',
          image: '/src/assets/images/cake_pistachio_aatis_1791337225871.jpg',
          tagline: 'Freshly baked artisanal treat',
          available: true,
        });
        onRefreshProducts();
      }
    } catch (e) {
      console.error('Create product error', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-[#F8F4EC] rounded-3xl shadow-2xl border border-[#E3D6C5] overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-6 border-b border-[#E3D6C5] flex items-center justify-between bg-[#F2E8DC]/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#163325] text-[#F8F4EC] flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#163325]">
                Barista Atelier Dashboard
              </h3>
              <p className="text-xs text-[#5D6C63]">
                Manage orders, pastry inventory, inquiries & subscribers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              disabled={loading}
              title="Refresh Data"
              className="p-2 rounded-full hover:bg-[#E4D8C8] text-[#163325] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#E4D8C8] text-[#163325] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Metrics Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-[#E3D6C5] bg-[#FAF5ED]">
            <div className="p-4 rounded-2xl bg-white border border-[#E5DACD]">
              <span className="text-[11px] font-semibold text-[#809186] uppercase tracking-wider block">
                Total Revenue
              </span>
              <span className="font-mono text-2xl font-bold text-[#163325] mt-1 block">
                ${stats.totalRevenue.toFixed(2)}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E5DACD]">
              <span className="text-[11px] font-semibold text-[#809186] uppercase tracking-wider block">
                Active Orders
              </span>
              <span className="font-mono text-2xl font-bold text-[#BA8657] mt-1 block">
                {stats.pendingOrders} <span className="text-xs text-[#7B8A80] font-normal">/ {stats.ordersCount}</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E5DACD]">
              <span className="text-[11px] font-semibold text-[#809186] uppercase tracking-wider block">
                Catalog Items
              </span>
              <span className="font-mono text-2xl font-bold text-[#163325] mt-1 block">
                {stats.activeProducts} <span className="text-xs text-[#7B8A80] font-normal">in stock</span>
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#E5DACD]">
              <span className="text-[11px] font-semibold text-[#809186] uppercase tracking-wider block">
                Subscribers
              </span>
              <span className="font-mono text-2xl font-bold text-[#163325] mt-1 block">
                {stats.newslettersCount}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E3D6C5] px-6 bg-[#F5ECE0]/60">
          {[
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length },
            { id: 'products', label: 'Menu Inventory', icon: Package, count: products.length },
            { id: 'messages', label: 'Inquiries', icon: Mail, count: messages.length },
            { id: 'newsletter', label: 'Gazette Subscribers', icon: Users, count: subscribers.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-4 text-xs font-semibold tracking-wide flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#163325] text-[#163325]'
                    : 'border-transparent text-[#6F7E75] hover:text-[#163325]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="bg-[#E7DDCF] text-[#163325] px-1.5 py-0.2 rounded-full font-mono text-[10px]">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-serif text-lg text-[#163325]">Live Order Queue</h4>
                <span className="text-xs text-[#7B8B81]">Showing {orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <p className="text-center py-12 text-sm text-[#7F8F85]">No orders received yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord._id}
                      className="bg-white rounded-2xl p-5 border border-[#E5DACD] shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0E6D8]">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#163325] mr-2">
                            {ord.orderNumber || ord._id}
                          </span>
                          <span className="text-xs text-[#708076]">
                            by <strong>{ord.customer?.name}</strong> ({ord.customer?.phone})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#163325]">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-[#D5C6B6] bg-[#FAF6F0] font-medium text-[#163325] focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="brewing">Brewing & Baking</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-[#163325]">Items Ordered:</p>
                          <ul className="mt-1 space-y-1 text-[#5E6D63]">
                            {ord.items?.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} (${(item.price * item.quantity).toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-[#163325]">Delivery Address:</p>
                          <p className="text-[#5E6D63] mt-0.5">{ord.customer?.address}, {ord.customer?.city}</p>
                          {ord.customer?.specialInstructions && (
                            <p className="text-[#B57E47] italic mt-1">
                              "{ord.customer.specialInstructions}"
                            </p>
                          )}
                          <p className="font-bold text-[#163325] mt-2">
                            Total: ${ord.total?.toFixed(2)} ({ord.paymentMethod?.replace('_', ' ')})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-lg text-[#163325]">Café Offerings Catalog</h4>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 bg-[#163325] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-[#254A37]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddProduct ? 'Cancel New Item' : 'Add New Item'}</span>
                </button>
              </div>

              {/* Add Product Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="bg-[#F3EBE0] p-5 rounded-2xl border border-[#E0D2C0] space-y-4 animate-in fade-in"
                >
                  <h5 className="font-serif text-base font-semibold text-[#163325]">
                    New Atelier Recipe
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        placeholder="e.g. Canelé de Bordeaux"
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={newProd.subtitle}
                        onChange={(e) => setNewProd({ ...newProd, subtitle: e.target.value })}
                        placeholder="e.g. Vanilla Rum Crust"
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.25"
                        required
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                        Category
                      </label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                      >
                        <option value="cosset">Cosset (Cakes & Mousse)</option>
                        <option value="confect">Confect (Pastries & Tarts)</option>
                        <option value="special">Signature Blend</option>
                        <option value="coffee">Espresso Bar</option>
                        <option value="cold-brew">Cold Drip</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={newProd.tagline}
                        onChange={(e) => setNewProd({ ...newProd, tagline: e.target.value })}
                        className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#163325] block mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newProd.description}
                      onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-[#D5C6B6] rounded-xl"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#163325] text-white rounded-full text-xs font-semibold cursor-pointer"
                  >
                    Save to Menu
                  </button>
                </form>
              )}

              {/* Product items table */}
              <div className="bg-white rounded-2xl border border-[#E5DACD] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5ED] border-b border-[#E5DACD] text-[#7B8B81]">
                    <tr>
                      <th className="p-3">Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DC]">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-[#FDFBF7]">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover bg-[#EAE0D3]"
                          />
                          <div>
                            <p className="font-semibold text-[#163325]">{p.name}</p>
                            <p className="text-[11px] text-[#7A8A80]">{p.subtitle}</p>
                          </div>
                        </td>
                        <td className="p-3 uppercase text-[10px] font-semibold text-[#6E7F75]">
                          {p.category}
                        </td>
                        <td className="p-3 font-mono font-bold text-[#163325]">
                          ${p.price.toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleProductAvailability(p)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                              p.available
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.available ? 'In Stock' : 'Sold Out'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg text-[#163325]">Customer Inquiries</h4>
              {messages.length === 0 ? (
                <p className="text-center py-12 text-sm text-[#7F8F85]">No inquiries received yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className="bg-white rounded-2xl p-5 border border-[#E5DACD] space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-serif text-sm font-semibold text-[#163325]">
                            {m.name}
                          </h5>
                          <p className="text-[#78887E]">{m.email}</p>
                        </div>
                        <span className="text-[10px] text-[#9EAFA5]">
                          {new Date(m.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {m.subject && (
                        <p className="font-semibold text-[#163325] pt-1">
                          Subject: {m.subject}
                        </p>
                      )}
                      <p className="text-[#55645A] leading-relaxed bg-[#FAF6F0] p-3 rounded-xl border border-[#ECE0D2]">
                        {m.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Newsletter Subscribers Tab */}
          {activeTab === 'newsletter' && (
            <div className="space-y-4">
              <h4 className="font-serif text-lg text-[#163325]">Gazette Subscribers</h4>
              {subscribers.length === 0 ? (
                <p className="text-center py-12 text-sm text-[#7F8F85]">No subscribers yet.</p>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E5DACD] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5ED] border-b border-[#E5DACD] text-[#7B8B81]">
                      <tr>
                        <th className="p-3">Email Address</th>
                        <th className="p-3">Subscribed On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EFE7DC]">
                      {subscribers.map((s) => (
                        <tr key={s._id} className="hover:bg-[#FDFBF7]">
                          <td className="p-3 font-medium text-[#163325]">{s.email}</td>
                          <td className="p-3 text-[#7B8B81]">
                            {new Date(s.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
