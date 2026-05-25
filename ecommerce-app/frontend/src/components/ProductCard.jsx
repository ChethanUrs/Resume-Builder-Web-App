import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { user, toggleWishlist } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const { _id, name, price, category, image, stock, averageRating = 0 } = product;

  const isLiked = user?.wishlist?.some((item) => (item._id || item) === _id);

  // Helper: Renders rating star layouts
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<Star key={i} className="h-3.5 w-3.5 fill-amber-400 stroke-none" />);
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="relative inline-block">
            <Star className="h-3.5 w-3.5 text-slate-200 dark:text-slate-700" />
            <span className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
            </span>
          </span>
        );
      } else {
        stars.push(<Star key={i} className="h-3.5 w-3.5 text-slate-200 dark:text-slate-700" />);
      }
    }
    return stars;
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden relative flex flex-col justify-between group h-full">
      
      {/* 1. Wishlist heart badge */}
      <button
        onClick={() => toggleWishlist(_id)}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full glass hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors shadow-sm"
        aria-label="Toggle Wishlist"
      >
        <Heart 
          className={`h-4.5 w-4.5 transition-colors ${
            isLiked ? 'fill-red-500 stroke-red-500' : 'text-slate-500 hover:text-red-500'
          }`} 
        />
      </button>

      {/* 2. Product Image Workspace */}
      <div 
        onClick={() => navigate(`/product/${_id}`)}
        className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950 relative cursor-pointer group/img"
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Quick View hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
          <Eye className="h-4.5 w-4.5" /> Quick View
        </div>
      </div>

      {/* 3. Product Info Block */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit block">
            {category}
          </span>
          <h3 
            onClick={() => navigate(`/product/${_id}`)}
            className="text-sm font-bold text-slate-800 dark:text-white hover:text-primary-500 transition-colors line-clamp-1 cursor-pointer text-left"
          >
            {name}
          </h3>
          
          {/* Stars Reviews */}
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(averageRating)}</div>
            <span className="text-[10px] font-semibold text-slate-400 ml-1">
              ({averageRating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Pricing, inventory and buy triggers */}
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
              ${price.toFixed(2)}
            </span>
            
            {/* Inventory indicator badges */}
            {stock === 0 ? (
              <span className="text-[9px] bg-red-50 dark:bg-red-950/20 text-red-500 px-2 py-0.5 rounded font-bold uppercase">
                Out of stock
              </span>
            ) : stock <= 3 ? (
              <span className="text-[9px] bg-amber-50 dark:bg-amber-950/20 text-amber-500 px-2 py-0.5 rounded font-bold uppercase animate-pulse">
                Only {stock} left!
              </span>
            ) : (
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 px-2 py-0.5 rounded font-bold uppercase">
                In Stock
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <button
            onClick={() => addToCart(product, 1)}
            disabled={stock === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:bg-slate-100 dark:disabled:bg-slate-900 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-bold text-xs shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
