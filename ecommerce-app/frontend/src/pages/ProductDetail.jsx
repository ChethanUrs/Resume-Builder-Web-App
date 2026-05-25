import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Star, ShoppingBag, Loader2, 
  AlertCircle, ShieldCheck, Heart, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cart quantity state
  const [qty, setQty] = useState(1);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch product detail on mount
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Product not found or catalog error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    if (!comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    setReviewLoading(true);
    try {
      const res = await axios.post(`/api/products/${id}/reviews`, {
        rating,
        comment: comment.trim()
      });
      // The server returns the updated product object
      setProduct(res.data.product);
      setComment('');
      setRating(5);
      alert('Review posted successfully!');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  // Helper: Renders rating star layouts
  const renderStars = (ratingVal) => {
    const stars = [];
    const floor = Math.floor(ratingVal);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 stroke-none" />);
      } else if (i - 0.5 <= ratingVal) {
        stars.push(
          <span key={i} className="relative inline-block">
            <Star className="h-4 w-4 text-slate-200 dark:text-slate-700" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-4 w-4 fill-amber-400 stroke-none" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-slate-200 dark:text-slate-700" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="h-10 w-10 text-primary-500 animate-spin" />
        <span className="text-xs text-slate-400 font-semibold">Loading product metrics...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 rounded-3xl glass text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Listing Error</h2>
        <p className="text-xs text-slate-400">{error || 'Could not find product.'}</p>
        <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const isLiked = user?.wishlist?.some((item) => (item._id || item) === product._id);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-6xl mx-auto space-y-8 text-left">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to store directory
        </Link>

        {/* Product Workspace Split grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Image Area (col-span-5) */}
          <div className="md:col-span-5 relative rounded-3xl overflow-hidden glass-card aspect-square">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            {/* Wishlist Toggler overlay */}
            <button
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-4 right-4 z-10 p-3 rounded-full glass hover:bg-slate-100 dark:hover:bg-slate-900 shadow-lg"
            >
              <Heart 
                className={`h-5 w-5 ${isLiked ? 'fill-red-500 stroke-red-500' : 'text-slate-500'}`} 
              />
            </button>
          </div>

          {/* Right Column: Buying parameters (col-span-7) */}
          <div className="md:col-span-7 glass-card p-6 sm:p-8 rounded-3xl space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{product.name}</h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(product.averageRating)}</div>
                <span className="text-xs font-semibold text-slate-400">
                  {product.averageRating.toFixed(1)} / 5.0 ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="py-4 border-y border-slate-200/40 dark:border-slate-800/40 flex justify-between items-center">
              <span className="text-3xl font-extrabold font-display">${product.price.toFixed(2)}</span>
              
              {/* Stock */}
              {product.stock === 0 ? (
                <span className="text-xs bg-red-50 dark:bg-red-950/20 text-red-500 px-3 py-1 rounded-lg font-bold uppercase">
                  Out of stock
                </span>
              ) : (
                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 px-3 py-1 rounded-lg font-bold uppercase">
                  {product.stock} items left in stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed">{product.description}</p>

            {/* Buying control */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 py-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity</label>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="glass-input py-2 px-3 pr-8 text-xs font-bold"
                  >
                    {[...Array(product.stock).keys()].slice(0, 10).map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => addToCart(product, qty)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 mt-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-lg shadow-primary-500/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  <span>Add {qty} to Shopping Cart</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Product Reviews & Ratings Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          
          {/* Reviews List column (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-base font-extrabold tracking-tight font-display flex items-center gap-1.5 mb-4">
              <Sparkles className="h-4.5 w-4.5 text-primary-500" /> Customer Reviews ({product.reviews.length})
            </h2>

            {product.reviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 rounded-2xl bg-white/20 dark:bg-slate-900/10 border border-slate-250 dark:border-slate-800">
                No reviews yet for this product. Be the first to purchase and review!
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-2xl glass-card text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-white leading-normal">{rev.username}</span>
                      <div className="flex">{renderStars(rev.rating)}</div>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{rev.comment}</p>
                    <span className="block text-[8px] text-slate-500 uppercase font-semibold">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Posting Form column (col-span-5) */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-extrabold tracking-tight font-display text-slate-800 dark:text-white">Submit a Review</h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
                  {/* Rating Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Star Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="glass-input w-full py-2 px-3 text-xs"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Poor)</option>
                      <option value="1">1 Star (Very Bad)</option>
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Review comment</label>
                    <textarea
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience using this product..."
                      className="glass-input resize-none"
                      required
                    />
                  </div>

                  {reviewError && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-xl text-red-500 text-xs flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {/* Submit review */}
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-primary-500/50 text-white font-bold text-xs"
                  >
                    {reviewLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4.5 w-4.5" />}
                    <span>Submit Review</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-900/10">
                  Please{' '}
                  <Link to="/login" className="font-bold text-primary-500 hover:underline">
                    Sign In
                  </Link>{' '}
                  to post a product review.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;
