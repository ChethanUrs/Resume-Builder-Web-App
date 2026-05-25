import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DollarSign, ShoppingBag, Users, Calendar, 
  Loader2, AlertCircle, Sparkles, Clipboard, 
  CheckCircle2, Plus, ArrowRight, Truck 
} from 'lucide-react';
import SVGAnalytics from '../components/SVGAnalytics';

const AdminDashboard = () => {
  // Analytical stats
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Product Creation Form states (Inventory Management)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Fetch admin directory data
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      // Parallel fetches for stats and all orders
      const [statsRes, ordersRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/orders')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch admin metrics or order histories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Place logistics updates
  const handleDeliver = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/deliver`);
      // Update local state list
      setOrders((prev) => 
        prev.map((o) => o._id === orderId ? { ...o, status: 'Delivered' } : o)
      );
      // Reload stats to reflect updates
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update delivery status.');
    }
  };

  // Add Product (Inventory Catalog Creator)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setCreateSuccess(false);

    if (!name || !price || !category || !stock || !description) {
      alert('Please enter all required product fields');
      return;
    }

    setCreateLoading(true);
    try {
      const res = await axios.post('/api/products', {
        name,
        price: Number(price),
        category,
        stock: Number(stock),
        description,
        image
      });

      setCreateSuccess(true);
      // Clear forms
      setName('');
      setPrice('');
      setStock('');
      setDescription('');
      setImage('');

      // Reload admin stats and charts to include the new catalog item
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add product to catalog.');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Loading admin credentials & stats...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Visual glow spotlights */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-left space-y-2 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-red-500 to-primary-500 bg-clip-text text-transparent w-fit">
            Control Center
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Real-time e-commerce analytics, product inventories, and customer shipments tracking.
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Analytics Summary Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left select-none">
            {/* Total Revenue */}
            <div className="glass-card p-6 rounded-3xl space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Sales</span>
                <DollarSign className="h-4.5 w-4.5 text-red-500" />
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-none text-slate-800 dark:text-white">
                ${stats.summary.totalSales.toFixed(2)}
              </h3>
            </div>

            {/* Total Orders */}
            <div className="glass-card p-6 rounded-3xl space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
                <Clipboard className="h-4.5 w-4.5 text-primary-500" />
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-none text-slate-800 dark:text-white">
                {stats.summary.ordersCount}
              </h3>
            </div>

            {/* Total Products */}
            <div className="glass-card p-6 rounded-3xl space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Items</span>
                <ShoppingBag className="h-4.5 w-4.5 text-amber-500" />
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-none text-slate-800 dark:text-white">
                {stats.summary.productsCount}
              </h3>
            </div>

            {/* Total Users */}
            <div className="glass-card p-6 rounded-3xl space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Customers</span>
                <Users className="h-4.5 w-4.5 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-extrabold font-display leading-none text-slate-800 dark:text-white">
                {stats.summary.usersCount}
              </h3>
            </div>
          </div>
        )}

        {/* 2. Visual line and bar charts */}
        {stats && (
          <SVGAnalytics salesData={stats.salesGraphData} categoryData={stats.categoryStats} />
        )}

        {/* 3. Product Seeder & Order Logistics split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Creator (col-span-4) */}
          <div className="lg:col-span-4 glass-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3 text-slate-800 dark:text-white">
              <Plus className="h-5 w-5 text-primary-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider font-display">Add Catalog Item</h3>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-left text-xs font-semibold">
              <div className="flex flex-col gap-1">
                <label className="text-slate-500">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leather Satchel, Wireless Mouse"
                  className="glass-input dark:bg-slate-950/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Price ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="29.99"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-500">Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="100"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-500">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home">Home & Kitchen</option>
                  <option value="Books">Books</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-500">Image URL (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="glass-input dark:bg-slate-950/40"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-500">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Compelling product details description..."
                  className="glass-input resize-none"
                  required
                />
              </div>

              {createSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-xl text-emerald-500 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Product added successfully!
                </div>
              )}

              <button
                type="submit"
                disabled={createLoading}
                className="w-full flex items-center justify-center gap-1 py-3 mt-2 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-xs"
              >
                {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4.5 w-4.5" />}
                <span>Add Product</span>
              </button>
            </form>
          </div>

          {/* Right Column: Active orders directory (col-span-8) */}
          <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3 text-slate-800 dark:text-white">
              <Truck className="h-5 w-5 text-primary-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider font-display">System Orders Logistics</h3>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 text-center text-xs text-slate-400">No customer purchases ordered yet.</div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div 
                    key={ord._id} 
                    className="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/20 border border-slate-200/30 dark:border-slate-800/30 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                  >
                    <div className="space-y-1">
                      <span className="block font-bold text-slate-800 dark:text-white leading-normal">
                        Order #{ord._id.substring(0, 10)}...
                      </span>
                      <span className="block text-slate-400 font-bold">
                        User: <span className="text-primary-500">{ord.user?.username || 'Guest'}</span> | Value: <span className="text-slate-800 dark:text-slate-200 font-extrabold">${ord.totalPrice.toFixed(2)}</span>
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        Date: {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {ord.status === 'Delivered' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/30 px-3 py-1 rounded-xl">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Shipped & Delivered
                        </span>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/30 px-3 py-1 rounded-xl animate-pulse">
                            Processing
                          </span>
                          <button
                            onClick={() => handleDeliver(ord._id)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary-600 to-indigo-500 text-white font-bold rounded-lg hover:-translate-y-0.5 transition-transform"
                          >
                            Ship Now <ArrowRight className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
