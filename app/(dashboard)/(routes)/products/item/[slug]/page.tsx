
// // app/(dashboard)/(routes)/products/item/[slug]/page.tsx
// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "sonner";


// type Machine = {
//   slug: string;
//   model: string;
//   price: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: Record<string, string>;
// };

// export default function ProductDetailPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const router = useRouter();
//   const [machine, setMachine] = useState<Machine | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchMachine = async () => {
//       try {
//         const { data } = await axios.get(`/api/machines/${slug}`);
//         setMachine(data);
//       } catch (error) {
//         console.error("Failed to fetch machine:", error);
//         toast.error("Product not found");
//         router.push("/dashboard");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMachine();
//   }, [slug, router]);

//   if (loading) {
//     return <div className="container p-6">Loading...</div>;
//   }

//   if (!machine) {
//     return null;
//   }

//   const specs =
//     machine.specs && typeof machine.specs === "object"
//       ? machine.specs
//       : {};

//   return (
//     <div className="container p-6">
//       <Card className="p-4">
//         <CardContent className="grid md:grid-cols-2 gap-6">
//           <div className="relative aspect-square">
//             <img
//               src={machine.image}
//               alt={machine.model}
//               className="rounded-lg object-contain w-full h-full"
//             />
//           </div>
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{machine.model}</h1>
//             <p className="text-2xl font-semibold text-primary">
//               {machine.price}
//             </p>
//             <p className="text-muted-foreground">{machine.description}</p>
//             {Object.keys(specs).length > 0 && (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Specification</TableHead>
//                     <TableHead>Details</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {Object.entries(specs).map(([key, value]) => (
//                     <TableRow key={key}>
//                       <TableCell className="font-medium">{key}</TableCell>
//                       <TableCell>{value}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}
//             <Button
//               className="w-full"
//               size="lg"
//                onClick={() => router.push(`/checkout/${encodeURIComponent(machine.slug)}`)}
//             >
//               Buy Now
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// app/(dashboard)/(routes)/products/item/[slug]/page.tsx
"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { toast } from "sonner"
import { useCart } from "@/components/cart-context"

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/machines/${slug}`)
        setProduct(data)
      } catch (error) {
        toast.error("Product not found")
        router.push("/products")
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [slug])

  if (loading) {
    return <div className="container p-6">Loading...</div>
  }

  if (!product) {
    return null
  }

  return (
    <div className="container p-6">
      <Card className="p-4">
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.model}
              className="rounded-lg object-contain w-full h-full"
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product.model}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
            </p>
            <p className="text-muted-foreground">{product.description}</p>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                addToCart({
                  slug: product.slug,
                  model: product.model,
                  price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
                  image: product.image
                })
                toast.success("Added to cart!")
              }}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}