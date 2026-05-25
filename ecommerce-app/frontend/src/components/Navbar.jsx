import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Sun, Moon, LogOut, ShieldAlert, Store, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemsCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-tr from-primary-600 to-indigo-500 rounded-xl shadow-md text-white shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <Store className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Elevate<span className="text-primary-500">Shop</span>
            </span>
          </Link>

          {/* User actions / Settings */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Shopping Cart button with live count badge */}
            <Link
              to="/cart"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors relative shadow-sm"
              title="View Shopping Cart"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1.5 rounded-full bg-primary-600 border-2 border-white dark:border-slate-950 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {itemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Wishlist Link */}
                <Link
                  to="/dashboard?tab=wishlist"
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                  title="View Wishlist"
                >
                  <Heart className="h-4.5 w-4.5" />
                </Link>

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 py-1.5 px-3 border border-slate-200/50 dark:border-slate-800/50 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  <User className="h-3.5 w-3.5 text-primary-500 mr-1" />
                  <span className="hidden sm:inline">{user?.username}</span>
                </Link>

                {/* Admin dashboard gate portal */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 py-2 px-3.5 bg-gradient-to-r from-red-600/10 to-primary-600/10 hover:from-red-600/20 hover:to-primary-600/20 border border-red-500/25 rounded-xl text-xs font-extrabold text-red-600 dark:text-red-400 shadow-sm"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-red-100 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
