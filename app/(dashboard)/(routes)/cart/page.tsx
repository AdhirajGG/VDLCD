// // app/(dashboard)/(routes)/cart/page.tsx
// "use client";

// import { motion } from "framer-motion";
// import { useCart } from "@/components/cart-context";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useMachines } from "@/components/machine";
// import { Badge } from "@/components/ui/badge";
// import Loading from "../products/item/[slug]/loading";
// import { colors } from "@/lib/colors";

// export default function CartPage() {
//   const { cartItems, removeFromCart, clearCart } = useCart();
//   const router = useRouter();
//   const [isClient, setIsClient] = useState(false);
//   const { categories } = useMachines();

//   useEffect(() => setIsClient(true), []);

//   const total = cartItems.reduce(
//     (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
//     0
//   );

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
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="p-8 max-w-screen mx-auto min-h-screen"
//     >
//       <div
//         className="rounded-3xl p-8 shadow-2xl"
//         style={{ background: colors.gradients.primary }}
//       >
//         <motion.h1
//           initial={{ y: -20 }}
//           animate={{ y: 0 }}
//           className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent"
//           style={{ color: colors.background.light }}
//         >
//           Your Cart
//         </motion.h1>


//         {!isClient ? (
//           <div className="flex justify-center">
//             <Loading />
//           </div>
//         ) : cartItems.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center space-y-4 py-16"
//           >
//             <p style={{ color: colors.text.secondary }}>Your cart is empty</p>
//             <Button
//               onClick={() =>
//                 router.push(firstCategory ? `/products/category/${firstCategory}` : "/products")
//               }
//               variant="outline"
//               style={{
//                 borderColor: colors.primary.main,
//                 color: colors.primary.main,
//               }}
//               className="hover:bg-opacity-10"
//             >
//               Continue Shopping
//             </Button>
//           </motion.div>
//         ) : (
//           <>
//             <div className="space-y-6">
//               {cartItems.map((item, index) => (
//                 <motion.div
//                   key={item.slug}
//                   className="rounded-xl p-6 border transition-colors"
//                   style={{
//                     backgroundColor: `${colors.background.light}30`,
//                     borderColor: `${colors.background.light}80`
//                   }}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={item.image}
//                         alt={item.model}
//                         className="w-20 h-20 object-contain rounded-lg"
//                       />
//                       <div>
//                         <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
//                           {item.model}
//                         </h3>
//                         <div className="flex items-center gap-4 mt-2">
//                           <Badge
//                             className="bg-opacity-20"
//                             style={{
//                               backgroundColor: `${colors.secondary.main}20`,
//                               color: colors.secondary.light
//                             }}
//                           >
//                             Qty: {item.quantity}
//                           </Badge>
//                           <span style={{ color: colors.text.secondary }}>
//                             ${(Number(item.price) * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       onClick={() => handleRemoveItem(item.slug)}
//                       style={{
//                         color: colors.state.error,
//                         backgroundColor: `${colors.state.error}20`
//                       }}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             <motion.div
//               className="mt-8 rounded-xl p-6 border flex flex-col sm:flex-row justify-between items-center gap-4"
//               style={{
//                 backgroundColor: `${colors.background.light}30`,
//                 borderColor: `${colors.background.light}80`
//               }}
//             >
//               <div>
//                 <h3 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
//                   Order Total
//                 </h3>
//                 <p className="text-2xl font-bold" style={{ color: colors.primary.light }}>
//                   ${total.toFixed(2)}
//                 </p>
//               </div>
//               <div className="flex gap-4">
//                 <Button
//                   onClick={handleClearCart}
//                   variant="outline"
//                   style={{
//                     borderColor: colors.primary.dark,
//                     color: colors.text.secondary
//                   }}
//                 >
//                   Clear Cart
//                 </Button>
//                 <Button
//                   onClick={() => router.push("/checkout/cart")}
//                   style={{
//                     backgroundColor: colors.primary.main,
//                     color: colors.text.primary
//                   }}
//                 >
//                   Proceed to Checkout
//                 </Button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// }

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
import { colors } from "@/lib/colors";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { categories } = useMachines();

  useEffect(() => setIsClient(true), []);

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

  const firstCategory = categories[0]?.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 max-w-screen mx-auto min-h-screen"
    >
      <div
        className="rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
        style={{ background: colors.gradients.primary }}
      >
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center bg-clip-text text-transparent"
          style={{ color: colors.background.light }}
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
            className="text-center space-y-4 py-8 sm:py-12"
          >
            <p className="text-sm sm:text-base" style={{ color: colors.text.secondary }}>
              Your cart is empty
            </p>
            <Button
              onClick={() =>
                router.push(firstCategory ? `/products/category/${firstCategory}` : "/products")
              }
              variant="outline"
              style={{
                borderColor: colors.primary.main,
                color: colors.primary.main,
              }}
              className="hover:bg-opacity-10 text-sm sm:text-base px-4 py-2"
            >
              Continue Shopping
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 sm:space-y-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.slug}
                  className="rounded-lg sm:rounded-xl p-4 sm:p-6 border transition-colors"
                  style={{
                    backgroundColor: `${colors.background.light}30`,
                    borderColor: `${colors.background.light}80`
                  }}
                >
                  <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 w-full">
                      <img
                        src={item.image}
                        alt={item.model}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-base sm:text-lg font-semibold truncate" 
                          style={{ color: colors.text.primary }}
                        >
                          {item.model}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                          <Badge
                            className="text-xs sm:text-sm bg-opacity-20 px-2 py-1"
                            style={{
                              backgroundColor: `${colors.secondary.main}20`,
                              color: colors.secondary.light
                            }}
                          >
                            Qty: {item.quantity}
                          </Badge>
                          <span 
                            className="text-sm sm:text-base" 
                            style={{ color: colors.text.secondary }}
                          >
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.slug)}
                      style={{
                        color: colors.state.error,
                        backgroundColor: `${colors.state.error}20`
                      }}
                      className="text-xs sm:text-sm px-3 py-1.5 self-end xs:self-auto"
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 sm:mt-8 rounded-lg sm:rounded-xl p-4 sm:p-6 border flex flex-col sm:flex-row justify-between items-center gap-4"
              style={{
                backgroundColor: `${colors.background.light}30`,
                borderColor: `${colors.background.light}80`
              }}
            >
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold" style={{ color: colors.text.primary }}>
                  Order Total
                </h3>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.primary.light }}>
                  ${total.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  style={{
                    borderColor: colors.primary.dark,
                    color: colors.text.secondary
                  }}
                  className="w-full sm:w-auto text-sm px-4 py-2"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={() => router.push("/checkout/cart")}
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.primary
                  }}
                  className="w-full sm:w-auto text-sm px-4 py-2"
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