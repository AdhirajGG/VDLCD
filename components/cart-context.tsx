// components/cart-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

type CartItem = {
  slug: string;
  model: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
   loading: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: userLoaded } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync cart with backend
  // const syncCart = async (items: CartItem[]) => {
  //   if (user) {
  //     await axios.post("/api/cart", { items });
  //   }
  // };

  const syncCart = useCallback(async (items: CartItem[]) => {
  if (user) {
    try {
      await axios.post("/api/cart", { items });
    } catch (error) {
      console.error("Cart sync failed:", error);
      // Optionally store locally if sync fails
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }
}, [user]);


  // Load cart on mount
  // useEffect(() => {
  //   const loadCart = async () => {
  //     if (user) {
  //       const { data } = await axios.get("/api/cart");
  //       setCartItems(data.items);
        
  //     } else {
  //       const localCart = localStorage.getItem("cart");
  //       if (localCart) setCartItems(JSON.parse(localCart));
  //     }
  //     setInitialized(true);
  //   };
  //   loadCart();
  // }, [user]);

  useEffect(() => {
    if (!userLoaded) return;

    const loadAndMergeCarts = async () => {
      let serverCart: CartItem[] = [];
      let localCart: CartItem[] = [];
      
      // Get server cart
      if (user) {
        try {
          const { data } = await axios.get("/api/cart");
          serverCart = data.items || [];
        } catch (error) {
          console.error("Failed to load server cart:", error);
        }
      }

      // Get local cart
      try {
        const localData = localStorage.getItem("cart");
        localCart = localData ? JSON.parse(localData) : [];
      } catch (error) {
        console.error("Failed to load local cart:", error);
      }

      // Merge carts
      if (user && localCart.length > 0) {
        const mergedCart = [...serverCart];
        
        localCart.forEach(item => {
          const existing = mergedCart.find(i => i.slug === item.slug);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            mergedCart.push(item);
          }
        });

        setCartItems(mergedCart);
        await syncCart(mergedCart);
        localStorage.removeItem("cart");
      } else {
        setCartItems(user ? serverCart : localCart);
      }

      setInitialized(true);
    };

    loadAndMergeCarts();
  }, [user, userLoaded, syncCart]);


  // Persist cart changes
  // useEffect(() => {
  //   if (!initialized) return;
    
  //   syncCart(cartItems);
  //   if (!user) {
  //     localStorage.setItem("cart", JSON.stringify(cartItems));
  //   }
  // }, [cartItems,user , initialized]);

  // Persist cart changes
// useEffect(() => {
//   if (!initialized) return;
//   // Only sync if user is logged in and cart is initialized
//   if (user) {
//     syncCart(cartItems);
//   } else {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }
// }, [cartItems, user, initialized]);

// Persist cart changes
useEffect(() => {
    if (!initialized) return;
    
    const timeoutId = setTimeout(() => {
      if (user) {
        syncCart(cartItems);
      } else {
        localStorage.setItem("cart", JSON.stringify(cartItems));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cartItems, user, initialized, syncCart]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.slug === item.slug);
      if (existing) {
        return prev.map(i => 
          i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }; 

  const removeItemsBySlug = (slug: string) => {
  setCartItems(prev => prev.filter(item => item.slug !== slug));
}; 

  const updateQuantity = (slug: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity < 1) {
        return prev.filter(item => item.slug !== slug);
      }
      return prev.map(item => 
        item.slug === slug ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (slug: string) => {
    setCartItems(prev => prev.filter(item => item.slug !== slug));
  };

  const clearCart = () => setCartItems([]);

 return (
    <CartContext.Provider
      value={{ cartItems, loading: !initialized, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}