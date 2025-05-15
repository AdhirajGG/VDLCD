
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { Machine } from "@/components/machine";

// export default function ProductDetailPage() {
//   const router = useRouter();
//   const params = useParams<{ slug: string }>();
//   const [machine, setMachine] = useState<Machine | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
// // app/(dashboard)/(routes)/products/[slug]/page.tsx
// useEffect(() => {
//   const fetchMachine = async () => {
//     try {
//       const response = await axios.get<Machine>(`/api/machines/${params.slug}`);
//       setMachine(response.data);
//     } catch (err) {
//       setError("Product not found");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchMachine();
// }, [params.slug]);

//   const handleBuyNow = () => {
//     if (machine) {
//       router.push(`/checkout/${encodeURIComponent(machine.slug)}`);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto p-6">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto p-6">
//         <h1 className="text-2xl font-bold mb-4">Error</h1>
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   if (!machine) {
//     return <div className="container mx-auto p-6">Product not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <Card className="p-4 hover:shadow-lg transition-shadow">
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//           {/* Product Image */}
//           <div>
//             <img
//               src={machine.image}
//               alt={machine.slug}
//               className="rounded-2xl shadow-md w-full object-contain"
//             />
//           </div>

//           {/* Product Description and Buy Button */}
//           <div>
//             <h1 className="text-3xl font-bold mb-4">{machine.slug}</h1>
//             <p className="text-base leading-relaxed mb-6">{machine.description}</p>
//             <Button
//               onClick={handleBuyNow}
//               className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
//             >
//               Buy Now - {machine.price}
//             </Button>
//           </div>

//           {/* Product Specifications Table */}
//           <div className="col-span-2">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Specification</TableHead>
//                   <TableHead>Details</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {Object.entries(machine.specs).map(([key, val]) => (
//                   <TableRow key={key}>
//                     <TableCell className="font-semibold">{key}</TableCell>
//                     <TableCell>{val}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// Below code is working

// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "sonner";

// export default function ProductDetailPage() {
//   const { slug } = useParams();
//   const router = useRouter();
//   const [machine, setMachine] = useState(null);
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
//     return null; // Redirect handled in useEffect
//   }

//   return (
//     <div className="container p-6">
//       <Card className="p-4">
//         <CardContent className="grid md:grid-cols-2 gap-6">
//           {/* Product Image */}
//           <div className="relative aspect-square">
//             <img
//               src={machine.image}
//               alt={machine.model}
//               className="rounded-lg object-contain w-full h-full"
//             />
//           </div>

//           {/* Product Details */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{machine.model}</h1>
//             <p className="text-2xl font-semibold text-primary">
//               {machine.price}
//             </p>
//             <p className="text-muted-foreground">{machine.description}</p>
            
//             {/* Specifications Table */}
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Specification</TableHead>
//                   <TableHead>Details</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {Object.entries(machine.specs).map(([key, value]) => (
//                   <TableRow key={key}>
//                     <TableCell className="font-medium">{key}</TableCell>
//                     <TableCell>{value}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             <Button className="w-full" size="lg">
//               Buy Now
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/products/item/[slug]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

type Machine = {
  slug: string;
  model: string;
  price: string;
  image: string;
  description: string;
  category: string;
  specs: Record<string, string>;
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const { data } = await axios.get(`/api/machines/${slug}`);
        setMachine(data);
      } catch (error) {
        console.error("Failed to fetch machine:", error);
        toast.error("Product not found");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [slug, router]);

  if (loading) {
    return <div className="container p-6">Loading...</div>;
  }

  if (!machine) {
    return null;
  }

  const specs =
    machine.specs && typeof machine.specs === "object"
      ? machine.specs
      : {};

  return (
    <div className="container p-6">
      <Card className="p-4">
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <img
              src={machine.image}
              alt={machine.model}
              className="rounded-lg object-contain w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{machine.model}</h1>
            <p className="text-2xl font-semibold text-primary">
              {machine.price}
            </p>
            <p className="text-muted-foreground">{machine.description}</p>
            {Object.keys(specs).length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Specification</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(specs).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Button
              className="w-full"
              size="lg"
               onClick={() => router.push(`/checkout/${encodeURIComponent(machine.slug)}`)}
            >
              Buy Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}