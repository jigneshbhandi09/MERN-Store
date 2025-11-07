import React, { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  _id?: string;
  id?: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity?: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  // ✅ Add item to cart
  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.id === product.id || item._id === product._id
      );

      if (existing) {
        // If product already exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id || item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        // Add new product
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Remove item
  const removeFromCart = (id: string | number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id && item._id !== id)
    );
  };

  // ✅ Clear entire cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Custom hook for easy usage
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used within a CartProvider");
  return context;
};
