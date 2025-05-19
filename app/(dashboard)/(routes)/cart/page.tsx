// // app/(dashboard)/(routes)/cart/page.tsx
// "use client";
// import { motion } from "framer-motion";
// import { useCart } from "@/components/cart-context";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useMachines } from "@/components/machine";
// import { Badge } from "@/components/ui/badge";
// import Loading from "../products/item/[slug]/loading";

// export default function CartPage() {
//   const { cartItems, removeFromCart, clearCart } = useCart();
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);
//   const { categories } = useMachines();

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   const total = Array.isArray(cartItems)
//     ? cartItems.reduce(
//       (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
//       0
//     )
//     : 0;

//   const handleRemoveItem = (slug: string) => {
//     removeFromCart(slug);
//     toast.success("Item removed from cart");
//   };

//   const handleClearCart = () => {
//     clearCart();
//     toast.success("Cart cleared successfully");
//   };

//   const firstCategory = categories[0]?.name.toLowerCase().replace(/\s+/g, "-");

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       className="p-8 max-w-4xl mx-auto"
//     >
//       <motion.h1
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
//       >
//         Your Cart
//       </motion.h1>

//       {!isClient ? (
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center text-muted-foreground"
//         >
//           <Loading />
//         </motion.p>
//       ) : cartItems.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="p-8 max-w-4xl mx-auto"
//         >
//           {/* ... other content ... */}

//           {cartItems.length === 0 && isClient && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center space-y-4"
//             >
//               <p className="text-xl text-muted-foreground">Your cart is empty</p>
//               <Button
//                 onClick={() => router.push(
//                   firstCategory
//                     ? `/products/category/${firstCategory}`
//                     : "/products"
//                 )}
//                 variant="outline"
//                 className="hover:bg-primary/10"
//               >
//                 Continue Shopping
//               </Button>
//             </motion.div>
//           )}

//           {/* ... rest of the component ... */}
//         </motion.div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <Table className="border rounded-lg overflow-hidden">
//             <TableHeader className="bg-muted">
//               <TableRow>
//                 {["Product", "Price", "Quantity", "Total", "Actions"].map(
//                   (header, index) => (
//                     <TableHead
//                       key={header}
//                       className={index === 0 ? "pl-6" : ""}
//                     >
//                       {header}
//                     </TableHead>
//                   )
//                 )}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {cartItems.map((item, index) => (
//                 <motion.tr
//                   key={item.slug}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="hover:bg-muted/50 transition-colors"
//                 >
//                   <TableCell className="font-medium pl-6">
//                     {item.model}
//                   </TableCell>
//                   {/* <TableCell>${item.price.toFixed(2)}</TableCell> */}
//                   <TableCell>${Number(item.price || 0).toFixed(2)}</TableCell>
//                   <TableCell>{item.quantity}</TableCell>
//                   {/* <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell> */}
//                   <TableCell>${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
//                   <TableCell>
//                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                       <Button
//                         variant="destructive"
//                         onClick={() => handleRemoveItem(item.slug)}
//                         className="shadow-sm"
//                       >
//                         Remove
//                       </Button>
//                     </motion.div>
//                   </TableCell>
//                 </motion.tr>
//               ))}
//             </TableBody>
//           </Table>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4 }}
//             className="mt-8 p-6 bg-muted/10 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4"
//           >
//             <div className="space-y-2">
//               <h3 className="text-xl font-semibold">Order Summary</h3>
//               {/* <p className="text-2xl font-bold text-primary">
//                 Total: ${total.toFixed(2)}
//               </p> */}
//               <p className="text-2xl font-bold text-primary">
//                 Total: ${Number(total).toFixed(2)}
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   onClick={handleClearCart}
//                   variant="outline"
//                   className="w-full shadow-sm hover:bg-destructive/10 hover:text-destructive"
//                 >
//                   Clear Cart
//                 </Button>
//               </motion.div>
//               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                 <Button
//                   onClick={() => router.push("/checkout/cart")}
//                   className="w-full bg-green-600 hover:bg-green-700 shadow-sm"
//                 >
//                   Proceed to Checkout
//                 </Button>
//               </motion.div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </motion.div>
//   );
// }


// Need To Fix the UI 
// app/(dashboard)/(routes)/cart/page.tsx
"use client";

import { motion } from "framer-motion";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMachines } from "@/components/machine";
import { Badge } from "@/components/ui/badge";
import Loading from "../products/item/[slug]/loading";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { categories } = useMachines();

  // Ensure client‑only rendering for localStorage hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Compute total
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const handleRemoveItem = (slug: string) => {
    removeFromCart(slug);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared successfully");
  };

  const firstCategory = categories[0]?.name
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-4xl mx-auto min-h-screen"
    >
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Your Cart
        </motion.h1>

        {!isClient ? (
          <div className="flex justify-center">
            <Loading />
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 py-16"
          >
            <p className="text-xl text-muted-foreground">Your cart is empty</p>
            <Button
              onClick={() =>
                router.push(
                  firstCategory
                    ? `/products/category/${firstCategory}`
                    : "/products"
                )
              }
              variant="outline"
              className="hover:bg-primary/10"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Items List */}
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/50 hover:border-cyan-400/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.model}
                        className="w-20 h-20 object-contain rounded-lg"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-indigo-100">
                          {item.model}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className="bg-cyan-500/20 text-cyan-400">
                            Qty: {item.quantity}
                          </Badge>
                          <span className="text-indigo-300">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.slug)}
                      className="text-red-400 hover:bg-red-900/20"
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Total & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/50 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <div>
                <h3 className="text-xl font-semibold text-indigo-100">
                  Order Total
                </h3>
                <p className="text-2xl font-bold text-cyan-400">
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="border-indigo-600 text-indigo-300 hover:bg-indigo-900/50"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={() => router.push("/checkout/cart")}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
