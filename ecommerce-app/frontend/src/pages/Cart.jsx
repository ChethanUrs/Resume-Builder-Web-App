import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, RefreshCw, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    updateQty, 
    removeFromCart, 
    itemsPrice, 
    shippingPrice, 
    taxPrice, 
    totalPrice 
  } = useCart();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Shopping Cart</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Review selected catalog items before checking out.</p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart state */
          <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/10 max-w-md mx-auto mt-6 space-y-4">
            <div className="p-5 bg-primary-50 dark:bg-primary-950/30 text-primary-500 rounded-full animate-pulse-slow">
              <ShoppingCart className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Shopping Cart is Empty</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[280px] leading-relaxed mx-auto">
                Your basket is empty. Head back to the store catalog to select product goods!
              </p>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md"
            >
              <ShoppingBag className="h-4 w-4" /> Browse Catalog
            </Link>
          </div>
        ) : (
          /* Cart items and checkout summary split grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart items table (col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div 
                  key={item.product} 
                  className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-left justify-between"
                >
                  {/* Info: image and title */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-16 w-16 rounded-xl object-cover border border-slate-200/30 dark:border-slate-800/30 bg-white shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <Link 
                        to={`/product/${item.product}`} 
                        className="block font-bold text-slate-800 dark:text-white hover:text-primary-500 transition-colors truncate text-sm"
                      >
                        {item.name}
                      </Link>
                      <span className="block text-[10px] text-slate-400 font-bold mt-1">
                        ${item.price.toFixed(2)} per unit
                      </span>
                    </div>
                  </div>

                  {/* Qty & Delete controls */}
                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200/20 dark:border-slate-800/20">
                    {/* Qty dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                      <select
                        value={item.qty}
                        onChange={(e) => updateQty(item.product, Number(e.target.value))}
                        className="glass-input py-1 px-2 text-xs font-bold"
                      >
                        {[...Array(item.stock).keys()].slice(0, 10).map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subtotal */}
                    <span className="text-sm font-extrabold font-display min-w-[60px] text-right">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.product)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Billing summary (col-span-4) */}
            <div className="lg:col-span-4">
              <div className="glass-card p-6 rounded-3xl space-y-6">
                <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                  Billing Summary
                </h3>

                {/* Subtotals breakdown */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Total ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping fee</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {shippingPrice === 0 ? (
                        <span className="text-emerald-500 font-extrabold uppercase text-[9px] bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                          Free Shipping
                        </span>
                      ) : (
                        `$${shippingPrice.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${taxPrice.toFixed(2)}</span>
                  </div>
                  
                  {shippingPrice > 0 && (
                    <p className="text-[10px] text-amber-500 italic bg-amber-50 dark:bg-amber-950/20 p-2 rounded-lg leading-normal">
                      Spend over $100.00 to qualify for Free Shipping!
                    </p>
                  )}

                  {/* Grand total */}
                  <div className="flex justify-between items-baseline border-t border-slate-200/40 dark:border-slate-800/40 pt-4 text-sm font-extrabold">
                    <span>Order Total</span>
                    <span className="text-lg font-extrabold text-primary-500 font-display">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full flex items-center justify-center gap-1.5 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default Cart;
