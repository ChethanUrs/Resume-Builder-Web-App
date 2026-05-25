import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Package, Calendar, 
  Loader2, AlertCircle, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrderTracker from '../components/OrderTracker';
import ProductCard from '../components/ProductCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab state: 'orders' or 'wishlist'
  const activeTab = searchParams.get('tab') || 'orders';

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/orders/myorders');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch your orders history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Background glowing lights */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6 text-left">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Customer Center</h1>
            <p className="text-xs text-slate-400 mt-1">
              Welcome back, <span className="font-bold text-primary-500">{user?.username}</span>. Track purchases and manage liked catalogs.
            </p>
          </div>
          
          {/* Tab Slider buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/30 dark:border-slate-850/30 select-none shrink-0 shadow-sm">
            <button
              onClick={() => handleTabChange('orders')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-slate-950 text-primary-600 dark:text-primary-400 shadow'
                  : 'text-slate-500'
              }`}
            >
              <Package className="h-4 w-4" /> My Orders
            </button>
            <button
              onClick={() => handleTabChange('wishlist')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'wishlist'
                  ? 'bg-white dark:bg-slate-950 text-primary-600 dark:text-primary-400 shadow'
                  : 'text-slate-500'
              }`}
            >
              <Heart className="h-4 w-4" /> My Wishlist
            </button>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Contents */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
            <span className="text-xs text-slate-400 font-semibold">Updating customer files...</span>
          </div>
        ) : activeTab === 'orders' ? (
          /* TAB 1: USER ORDERS LIST */
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 max-w-md mx-auto mt-6 space-y-4">
                <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-500">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">No Orders Placed</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed mx-auto">
                    You haven't placed any purchases yet. Explore our storefront directory to get started!
                  </p>
                </div>
                <Link to="/" className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order._id} 
                  className="glass-card p-6 rounded-3xl space-y-6 border border-slate-200/30 dark:border-slate-800/30 text-left"
                >
                  {/* Order Meta details strip */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-200/40 dark:border-slate-800/40 pb-4 text-xs font-semibold text-slate-400">
                    <div className="space-y-1">
                      <span className="block">Order ID: <span className="text-slate-800 dark:text-slate-200 font-extrabold">{order._id}</span></span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> Ordered {new Date(order.createdAt).toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' })}
                      </span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="block">Billing Total: <span className="text-primary-500 font-extrabold font-display text-sm">${order.totalPrice.toFixed(2)}</span></span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md font-bold uppercase mt-1">
                        <CheckCircle2 className="h-3 w-3" /> Paid via Card
                      </span>
                    </div>
                  </div>

                  {/* Purchased items list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover shrink-0 bg-white" />
                          <div className="min-w-0 flex-grow text-left">
                            <span className="block font-bold text-slate-800 dark:text-white truncate">{item.name}</span>
                            <span className="block text-[10px] text-slate-400 font-semibold">{item.qty} x ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order tracking steps panel */}
                    <div className="border-t md:border-t-0 md:border-l border-slate-200/30 dark:border-slate-800/30 pt-4 md:pt-0 md:pl-6">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping Status</h4>
                      <OrderTracker status={order.status} />
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        ) : (
          /* TAB 2: USER WISHLIST PRODUCT CARDS */
          <div className="space-y-6">
            {!user?.wishlist || user.wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 max-w-md mx-auto mt-6 space-y-4">
                <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-500">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Wishlist is Empty</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed mx-auto">
                    You haven't liked any items yet. Toggle the heart icons on the product cards to fill this tab!
                  </p>
                </div>
                <Link to="/" className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md">
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.wishlist.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;
