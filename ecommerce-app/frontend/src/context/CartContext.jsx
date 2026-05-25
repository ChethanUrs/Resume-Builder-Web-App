import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load cached cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = localStorage.getItem('cart_items');
    return savedItems ? JSON.parse(savedItems) : [];
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product === product._id);
      
      if (existingItem) {
        // Enforce inventory stock check
        const newQty = existingItem.qty + qty;
        if (newQty > product.stock) {
          alert(`Cannot add more items. Only ${product.stock} available in stock.`);
          return prev;
        }
        return prev.map((item) => 
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        if (qty > product.stock) {
          alert(`Cannot add. Only ${product.stock} available in stock.`);
          return prev;
        }
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            qty
          }
        ];
      }
    });
  };

  // Remove Item from Cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
  };

  // Update item quantity
  const updateQty = (productId, qty) => {
    setCartItems((prev) => 
      prev.map((item) => {
        if (item.product === productId) {
          // Boundaries check
          const targetQty = Math.max(1, Math.min(qty, item.stock));
          if (qty > item.stock) {
            alert(`Stock limit reached. Only ${item.stock} items available.`);
          }
          return { ...item, qty: targetQty };
        }
        return item;
      })
    );
  };

  // Empty cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Financial Computations
  const itemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  
  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Business logic: Free shipping for orders above $100
  const shippingPrice = itemsPrice === 0 ? 0 : (itemsPrice > 100 ? 0 : 10.00);
  
  // Tax logic: 8% sales tax
  const taxPrice = itemsPrice * 0.08;
  
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      itemsCount,
      itemsPrice: Number(itemsPrice.toFixed(2)),
      shippingPrice: Number(shippingPrice.toFixed(2)),
      taxPrice: Number(taxPrice.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2))
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
