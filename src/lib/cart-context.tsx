"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types/product";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  model?: string;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "amir_store_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount with strict schema validation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validItems: CartItem[] = parsed.filter(
            (item): item is CartItem =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  typeof item.id === "string" &&
                  item.id.trim() !== "" &&
                  typeof item.name === "string" &&
                  typeof item.price === "number" &&
                  !isNaN(item.price) &&
                  item.price > 0 &&
                  Number.isInteger(item.quantity) &&
                  item.quantity > 0 &&
                  item.quantity <= 50
              )
          );
          setItems(validItems);
        } else {
          // If stored value is not an array, purge corrupt state
          localStorage.removeItem(CART_STORAGE_KEY);
          setItems([]);
        }
      }
    } catch {
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch {
        // Fallback if localStorage access is blocked
      }
      setItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Fallback
      }
    }
  }, [items, isHydrated]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      const productPrice = product.price || 1200;
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: productPrice,
          compareAtPrice: product.compareAtPrice,
          model: product.model,
          image: product.images?.[0] || "/images/logo.png",
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
