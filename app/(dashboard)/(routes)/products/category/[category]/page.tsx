// // app/(dashboard)/(routes)/products/category/[category]/page.tsx
// "use client";
// import { useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import { useMachines } from "@/components/machine";
// import { useCart } from "@/components/cart-context";

// export default function CategoryProductsPage() {
//   const router = useRouter();
//    const { category } = useParams<{ category: string }>();
//   const { machines, loading, error, refresh } = useMachines();
//   const { addToCart } = useCart();

//  useEffect(() => {
//   if (category) {
//     // Convert URL slug to proper category name format
//     const formattedCategory = decodeURIComponent(category)
//       .replace(/-/g, ' ')
//       .replace(/\b\w/g, c => c.toUpperCase())
//       .trim(); // Add trim to remove any whitespace

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
//         {machines.map((machine, index) => (
//           <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
//             <div className="relative h-48 w-full mb-4">
//               <Image
//                 src={machine.image}
//                 alt={machine.model}
//                 fill
//                 className="object-cover rounded-lg"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//             </div>
//             <h2 className="text-xl font-semibold mb-2">{machine.model}</h2>
//             <p className="text-2xl font-bold text-primary mb-4">{machine.price}</p>
//             <div className="flex flex-col space-y-2">
//               <Button
//                 onClick={() => router.push(`/products/category/${category}/${machine.slug}`)} //test api
//                 variant="outline"
//                 className="w-full"
//               >
//                 View Details
//               </Button>
//               <Button
//                 onClick={() => addToCart({
//                   slug: machine.slug,
//                   model: machine.model,
//                   price: parseFloat(machine.price.replace(/[^0-9.]/g, '')),
//                   image: machine.image
//                 })}
//               >
//                 Add to Cart
//               </Button>
//               <Button
//                 onClick={() => router.push(`/checkout/${encodeURIComponent(machine.slug)}`)}
//                 className="w-full bg-green-600 hover:bg-green-700"
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/products/category/[category]/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMachines } from "@/components/machine";
import { useCart } from "@/components/cart-context";
import { toast } from "sonner";

export default function CategoryProductsPage() {
  const router = useRouter();
   const { category } = useParams<{ category: string }>();
  const { machines, loading, error, refresh } = useMachines();
  const { addToCart } = useCart();
const { cartItems, updateQuantity } = useCart();

const handleQuantityChange = (slug: string, delta: number) => {
  const item = cartItems.find(item => item.slug === slug);
  if (item) {
    const newQuantity = (item.quantity || 0) + delta;
    updateQuantity(slug, Math.max(newQuantity, 0));
  }
};
useEffect(() => {
  if (category) {
    const formattedCategory = decodeURIComponent(category)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    refresh(formattedCategory);
  }
}, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{category} Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((product) => (
  <Card key={product.slug} className="p-4 hover:shadow-lg transition-shadow">
    {/* Product image */}
    <div className="relative h-48 w-full mb-4">
      <Image
        src={product.image}
        alt={product.model}
        fill  
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    
    {/* Product info */}
    <h2 className="text-xl font-semibold mb-2">{product.model}</h2>
    <p className="text-2xl font-bold text-primary mb-4">
      ${parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
    </p>

    {/* Quantity controls */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(product.slug, -1)}
        >
          -
        </Button>
        <span>{cartItems.find(item => item.slug === product.slug)?.quantity || 0}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuantityChange(product.slug, 1)}
        >
          +
        </Button>
      </div>
    </div>

    {/* Action buttons */}
    <div className="flex flex-col space-y-2">
      <Button
        onClick={() => router.push(`/products/${product.slug}`)}
        variant="outline"
        className="w-full"
      >
        View Details
      </Button>
      <Button
        onClick={() => {
          addToCart({
            slug: product.slug,
            model: product.model,
            price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
            image: product.image
          })
          toast.success("Added to cart!")
        }}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Add to Cart
      </Button>
    </div>
  </Card>
))}
      </div>
    </div>
  );
}