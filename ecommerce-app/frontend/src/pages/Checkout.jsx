import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  CreditCard, Loader2, ArrowLeft, ShieldCheck, 
  MapPin, CheckCircle2, ShoppingBag 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // Form states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Mock Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!address || !city || !postalCode || !country || !cardName || !cardNumber || !cardExpiry || !cardCVC) {
      setError('Please fill in all shipping address and credit card details.');
      return;
    }

    setLoading(true);

    try {
      // 1. Place order transaction
      const res = await axios.post('/api/orders', {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
          product: item.product
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Card',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      // 2. Successful Checkout completion
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Checkout failed. Stock limit exceeded or server error.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <AlertCircle className="h-10 w-10 text-slate-350 dark:text-slate-700 animate-bounce mb-3" />
        <span className="text-xs">No items to checkout</span>
        <Link to="/" className="inline-block px-4 py-2 mt-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-5xl mx-auto space-y-8 text-left relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Secure Checkout</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">Provide shipping address and secure billing credentials.</p>
          </div>
          <Link 
            to="/cart" 
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>
        </div>

        {/* Checkout Main Form Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping & Payment Cards (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* A. Shipping Address Box */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                <MapPin className="h-4.5 w-4.5 text-primary-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Shipping Address</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main St, Apartment 4B"
                  className="glass-input dark:bg-slate-950/40"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 10001"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
              </div>
            </div>

            {/* B. Billing Card details Box */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                <CreditCard className="h-4.5 w-4.5 text-primary-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider">Secure Payment</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Jane Doe"
                  className="glass-input dark:bg-slate-950/40"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())} // format spacing
                  placeholder="4111 2222 3333 4444"
                  maxLength="19"
                  className="glass-input dark:bg-slate-950/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Expiration Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5))}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">CVC</label>
                  <input
                    type="password"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    placeholder="123"
                    maxLength="3"
                    className="glass-input dark:bg-slate-950/40"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-400 flex items-start gap-1.5 leading-normal">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Your credit card details are fully encrypted and securely authorized via sandboxed Stripe endpoints. We do not store payment details.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Checkout Summary (col-span-5) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl space-y-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider border-b border-slate-200/40 dark:border-slate-800/40 pb-3">
                Order Items
              </h3>

              {/* Items checklist */}
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img src={item.image} alt={item.name} className="h-8 w-8 rounded-lg object-cover shrink-0 bg-white" />
                      <span className="font-bold truncate text-slate-800 dark:text-slate-200">{item.name}</span>
                    </div>
                    <span className="text-slate-400 font-semibold shrink-0">
                      {item.qty} x ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial subtotals */}
              <div className="space-y-3.5 text-xs pt-4 border-t border-slate-200/30 dark:border-slate-800/30">
                <div className="flex justify-between text-slate-400">
                  <span>Items total</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping fee</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {shippingPrice === 0 ? 'Free Shipping' : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">${taxPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-baseline border-t border-slate-200/40 dark:border-slate-800/40 pt-4 text-sm font-extrabold">
                  <span>Order Total</span>
                  <span className="text-lg font-extrabold text-primary-500 font-display">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Validation errors */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-xl text-red-500 text-xs flex items-center gap-1.5">
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Secure pay CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    <span>Processing payment...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Authorize Secure Payment (${totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>

      {/* Checkout Success Popup Modal Dialog */}
      {success && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4 animate-in fade-in zoom-in duration-200 select-none">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full text-emerald-500 w-fit mx-auto animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">Payment Succeeded!</h2>
              <p className="text-xs text-slate-400 leading-normal">
                Your transaction has been authorized successfully and your order has been placed. Inventory stock decremented.
              </p>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Track Your Order Status
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-xl"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
