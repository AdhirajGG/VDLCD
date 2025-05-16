// // component/cart-context.tsx
// "use client";

// import { createContext, useContext, useState, useEffect } from "react";

// type CartItem = {
//   slug: string;
//   model: string;
//   price: number;
//   image: string;
//   quantity: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: Omit<CartItem, "quantity">) => void;
//   removeFromCart: (slug: string) => void;
//   updateQuantity: (slug: string, quantity: number) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cartItems, setCartItems] = useState<CartItem[]>(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("cart");
//       return saved ? JSON.parse(saved) : [];
//     }
//     return [];
//   });

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cartItems));
//   }, [cartItems]);

//   const addToCart = (item: Omit<CartItem, "quantity">) => {
//     setCartItems((prev) => {
//       const existing = prev.find((i) => i.slug === item.slug);
//       if (existing) {
//         return prev.map((i) =>
//           i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (slug: string, quantity: number) => {
//     if (quantity < 1) return;
//     setCartItems((prev) =>
//       prev.map((item) =>
//         item.slug === slug ? { ...item, quantity } : item
//       )
//     );
//   };

//   const removeFromCart = (slug: string) => {
//     setCartItems((prev) => prev.filter((item) => item.slug !== slug));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// }

// components/cart-context.tsx

// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";

// type CartItem = {
//   slug: string;
//   model: string;
//   price: number;
//   image: string;
//   quantity: number;
// };

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (item: Omit<CartItem, "quantity">) => void;
//   removeFromCart: (slug: string) => void;
//   updateQuantity: (slug: string, quantity: number) => void;
//   clearCart: () => void;
// };

// const CartContext = createContext<CartContextType | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const { user } = useUser();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);

//   useEffect(() => {
//     if (typeof window !== "undefined" && user) {
//       const saved = localStorage.getItem(`cart-${user.id}`);
//       setCartItems(saved ? JSON.parse(saved) : []);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(`cart-${user.id}`, JSON.stringify(cartItems));
//     }
//   }, [cartItems, user]);

//   const updateQuantity = (slug: string, quantity: number) => {
//     setCartItems(prev => {
//       const existing = prev.find(item => item.slug === slug);
//       if (existing) {
//         if (quantity <= 0) {
//           return prev.filter(item => item.slug !== slug);
//         }
//         return prev.map(item => 
//           item.slug === slug ? { ...item, quantity } : item
//         );
//       }
//       return prev;
//     });
//   };

//   const addToCart = (item: Omit<CartItem, "quantity">) => {
//     setCartItems(prev => {
//       const existing = prev.find(i => i.slug === item.slug);
//       if (existing) {
//         return prev.map(i =>
//           i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (slug: string) => {
//     setCartItems(prev => prev.filter(item => item.slug !== slug));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   return (
//     <CartContext.Provider
//       value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// }

// components/cart-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
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
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Sync cart with backend
  const syncCart = async (items: CartItem[]) => {
    if (user) {
      await axios.post("/api/cart", { items });
    }
  };

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const { data } = await axios.get("/api/cart");
        setCartItems(data.items);
      } else {
        const localCart = localStorage.getItem("cart");
        if (localCart) setCartItems(JSON.parse(localCart));
      }
      setInitialized(true);
    };
    loadCart();
  }, [user]);

  // Persist cart changes
  useEffect(() => {
    if (!initialized) return;
    
    syncCart(cartItems);
    if (!user) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user, initialized]);

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
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
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