// // app/(dashboard)/(routes)/products/category/[category]/page.tsx
// "use client";
// import { useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useMachines } from "@/components/machine";
// import { useCart } from "@/components/cart-context";
// import { toast } from "sonner";

// export default function CategoryProductsPage() {
//   const router = useRouter();
//    const { category } = useParams<{ category: string }>();
//   const { machines, loading, error, refresh } = useMachines();
//   const { addToCart } = useCart();
// const { cartItems, updateQuantity } = useCart();

// const handleQuantityChange = (slug: string, delta: number) => {
//   const item = cartItems.find(item => item.slug === slug);
//   if (item) {
//     const newQuantity = (item.quantity || 0) + delta;
//     updateQuantity(slug, Math.max(newQuantity, 0));
//   }
// };
// useEffect(() => {
//   if (category) {
//     const formattedCategory = decodeURIComponent(category)
//       .replace(/-/g, ' ')
//       .replace(/\b\w/g, c => c.toUpperCase());
//     refresh(formattedCategory);
//   }
// }, [category]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-8">{category} Equipment</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {machines.map((product) => (
//   <Card key={product.slug} className="p-4 hover:shadow-lg transition-shadow">
//     {/* Product image */}
//     <div className="relative h-48 w-full mb-4">
//       <Image
//         src={product.image}
//         alt={product.model}
//         fill  
//         className="object-cover rounded-lg"
//         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//       />
//     </div>
    
//     {/* Product info */}
//     <h2 className="text-xl font-semibold mb-2">{product.model}</h2>
//     <p className="text-2xl font-bold text-primary mb-4">
//       ${parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
//     </p>

//     {/* Quantity controls */}
//     <div className="flex items-center justify-between mb-4">
//       <div className="flex items-center gap-2">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleQuantityChange(product.slug, -1)}
//         >
//           -
//         </Button>
//         <span>{cartItems.find(item => item.slug === product.slug)?.quantity || 0}</span>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => handleQuantityChange(product.slug, 1)}
//         >
//           +
//         </Button>
//       </div>
//     </div>

//     {/* Action buttons */}
//     <div className="flex flex-col space-y-2">
//       <Button
//         onClick={() => router.push(`/products/${product.slug}`)}
//         variant="outline"
//         className="w-full"
//       >
//         View Details
//       </Button>
//       <Button
//         onClick={() => {
//           addToCart({
//             slug: product.slug,
//             model: product.model,
//             price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
//             image: product.image
//           })
//           toast.success("Added to cart!")
//         }}
//         className="w-full bg-green-600 hover:bg-green-700"
//       >
//         Add to Cart
//       </Button>
            //  <Button
            //   className="w-full"
            //   size="lg"
            //    onClick={() =>  router.push(`/checkout/${encodeURIComponent(product.slug)}`)}
            // >
            //   Buy Now
            // </Button>
//     </div>
//   </Card>
// ))}
//       </div>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/products/category/[category]/page.tsx
// "use client";
// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useMachines } from "@/components/machine";
// import { useCart } from "@/components/cart-context";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { useRouter } from "next/navigation";

// export default function CategoryProductsPage() {
//   const router = useRouter();
//   const { category } = useParams<{ category: string }>();
//   const { machines, loading, error, refresh } = useMachines();
//   const { cartItems, updateQuantity } = useCart();

//   useEffect(() => {
//     if (category) {
//       const formattedCategory = decodeURIComponent(category)
//         .replace(/-/g, ' ')
//         .trim()
//         .toLowerCase();
//       refresh(formattedCategory);
//     }
//   }, [category]);

//   const handleQuantityChange = (product: any, delta: number) => {
//     const currentItem = cartItems.find(item => item.slug === product.slug);
//     const currentQuantity = currentItem?.quantity || 0;
//     const newQuantity = Math.max(currentQuantity + delta, 0);

//     if (newQuantity === 0) {
//       updateQuantity(product.slug, 0);
//     } else {
//       updateQuantity(product.slug, newQuantity);
      
//       if (!currentItem) {
//         updateQuantity(product.slug, 1);
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity }}
//           className="rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
//         />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   return (
//     <div className="p-8 max-w-7xl mx-auto">
//       <motion.h1 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-3xl font-bold mb-8 text-center"
//       >
//         {decodeURIComponent(category).replace(/-/g, ' ')} Equipment
//       </motion.h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {machines.map((product) => (
//           <motion.div
//             key={product.slug}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Card className="p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
//               <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
//                 <Image
//                   src={product.image}
//                   alt={product.model}
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                 />
//               </div>
              
//               <div className="flex-1">
//                 <h2 className="text-xl font-semibold mb-2">{product.model}</h2>
//                 <p className="text-2xl font-bold text-primary mb-4">
//                   ${parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
//                 </p>

//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleQuantityChange(product, -1)}
//                       disabled={!cartItems.find(item => item.slug === product.slug)?.quantity}
//                     >
//                       -
//                     </Button>
//                     <span className="min-w-[2rem] text-center">
//                       {cartItems.find(item => item.slug === product.slug)?.quantity || 0}
//                     </span>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => handleQuantityChange(product, 1)}
//                     >
//                       +
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col space-y-2 mt-auto">
//                 <Button
//                   onClick={() => router.push(`/products/${product.slug}`)}
//                   variant="outline"
//                   className="w-full"
//                 >
//                   View Details
//                 </Button>
//                         <Button
//               className="w-full"
//               size="lg"
//                onClick={() =>  router.push(`/checkout/${encodeURIComponent(product.slug)}`)}
//             >
//               Buy Now
//             </Button>
//               </div>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMachines } from "@/components/machine";
import { useCart } from "@/components/cart-context";
import { motion } from "framer-motion";

export default function CategoryProductsPage() {
  const router = useRouter();
  const { category } = useParams<{ category: string }>();
  const { machines, loading, error, refresh } = useMachines();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  // 1) Fetch once on mount
  useEffect(() => {
    refresh();
  }, []); // <-- empty deps

  // 2) Normalize the category slug
  const normalizedCategory = useMemo(() => {
    if (!category) return "";
    return decodeURIComponent(category)
      .replace(/-/g, " ")
      .trim()
      .toLowerCase();
  }, [category]);

  // 3) Filter locally
  const filtered = useMemo(
    () =>
      machines.filter(
        (m) => m.category.toLowerCase() === normalizedCategory
      ),
    [machines, normalizedCategory]
  );

  const handleQuantityChange = (
    product: { slug: string; model: string; price: string; image: string },
    delta: number
  ) => {
    const existing = cartItems.find((i) => i.slug === product.slug);

    if (delta > 0) {
      // + button: either increment existing or add new
      if (existing) {
        updateQuantity(product.slug, existing.quantity + 1);
      } else {
        addToCart({
          slug: product.slug,
          model: product.model,
          price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
          image: product.image,
        });
      }
    } else {
      // – button: decrement or remove
      if (!existing) return;
      const nextQty = existing.quantity - 1;
      if (nextQty > 0) {
        updateQuantity(product.slug, nextQty);
      } else {
        removeFromCart(product.slug);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        {normalizedCategory.charAt(0).toUpperCase() +
          normalizedCategory.slice(1)}{" "}
        Equipment
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.model}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  {product.model}
                </h2>
                <p className="text-2xl font-bold text-primary mb-4">
                  $
                  {parseFloat(
                    product.price.replace(/[^0-9.]/g, "")
                  ).toFixed(2)}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product, -1)}
                      disabled={
                        !cartItems.find((i) => i.slug === product.slug)
                          ?.quantity
                      }
                    >
                      –
                    </Button>
                    <span className="min-w-[2rem] text-center">
                      {
                        cartItems.find((i) => i.slug === product.slug)
                          ?.quantity || 0
                      }
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product, 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-auto">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/products/item/${product.slug}`)
                  }
                >
                  View Details
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() =>
                    router.push(
                      `/checkout/${encodeURIComponent(product.slug)}`
                    )
                  }
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
