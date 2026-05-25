import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const categories = ['All', 'Electronics', 'Clothing', 'Home', 'Books'];

const Catalog = () => {
  // Query parameters state
  const [productList, setProductList] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(1000); // Max Price threshold
  const [minRating, setMinRating] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch product listings on changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const catQuery = category !== 'All' ? `&category=${category}` : '';
        const searchQuery = search.trim() ? `&search=${search.trim()}` : '';
        const ratingQuery = minRating > 0 ? `&rating=${minRating}` : '';
        
        const res = await axios.get(
          `/api/products?maxPrice=${priceRange}${catQuery}${searchQuery}${ratingQuery}`
        );
        setProductList(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to sync products catalog.');
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(delayTimer);
  }, [category, search, priceRange, minRating]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Visual glowing decors */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-primary-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Banner branding */}
        <div className="text-left space-y-2 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
          <h1 className="text-3xl font-extrabold tracking-tight font-display">Discover Catalog</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Explore premium materials and ATS-friendly e-commerce catalogs with instant stock synchronizations.
          </p>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. Collapsible / Sidebar Filters Column (col-span-3) */}
          <div className="col-span-12 lg:col-span-3 glass-card p-6 rounded-3xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
              <SlidersHorizontal className="h-4.5 w-4.5 text-primary-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider">Search Filters</h3>
            </div>

            {/* Price Slider filter */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-500">Max Price</label>
                <span className="text-xs font-extrabold text-primary-500">${priceRange}</span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            {/* Star Rating select */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-500 block">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="glass-input w-full py-2 px-3 text-xs dark:bg-slate-950/40"
              >
                <option value="0">All Ratings</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Category selection tags list */}
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-500 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => {
                  const isActive = category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* B. Product Listings Column (col-span-9) */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Search Input bar */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by title, descriptors, tags..."
                className="glass-input pl-12 py-3.5 w-full dark:bg-slate-900/30 font-semibold"
              />
            </div>

            {/* Global Errors */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-red-600 dark:text-red-400 flex items-start gap-2.5 text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loader / Product grids */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
                <span className="text-xs text-slate-400 font-semibold">Updating catalog directory...</span>
              </div>
            ) : productList.length === 0 ? (
              /* Catalog Empty state */
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 max-w-md mx-auto mt-6 space-y-4">
                <div className="p-4 rounded-full bg-primary-50 dark:bg-primary-950/30 text-primary-500">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">Catalog is Empty</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed mx-auto">
                    Try adjusting your search criteria, price range sliders, or selecting another category filters list!
                  </p>
                </div>
              </div>
            ) : (
              /* Grid view */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Catalog;
