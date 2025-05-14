
// "use client";

// import { use } from 'react';
// import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { machines } from "@/components/machine";

// async function fetchMachine(model: string) {
//   const decodedModel = decodeURIComponent(model);
//   const machine = machines.find(m => m.slug.toLowerCase() === decodedModel.toLowerCase());

//   if (!machine) {
//     throw new Error('Product not found');
//   }

//   return {
//     ...machine,
//     specs: machine.specs.map((spec) => [spec[0], spec[1]] as [string, string])
//   };
// }

// export default function ProductDetailPage({ params }: { params: { model: string } }) {
//   const router = useRouter();
//   const machinePromise = fetchMachine(params.model);
//   const machine = use(machinePromise);

//   const handleBuyNow = () => {
//     router.push(`/checkout/${encodeURIComponent(machine.slug)}`);
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <Card className="p-4 hover:shadow-lg transition-shadow">
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
//           {/* Product Image */}
//           <div>
//             <img
//               src={machine.image}
//               alt={machine.model}
//               className="rounded-2xl shadow-md w-full object-contain"
//             />
//           </div>

//           {/* Product Description and Buy Button */}
//           <div>
//             <h1 className="text-3xl font-bold mb-4">{machine.model}</h1>
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
//                 {machine.specs.map(([key, val]) => (
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

"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Machine } from "@/components/machine";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
// app/(dashboard)/(routes)/products/[slug]/page.tsx
useEffect(() => {
  const fetchMachine = async () => {
    try {
      const response = await axios.get<Machine>(`/api/machines/${params.slug}`);
      setMachine(response.data);
    } catch (err) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  fetchMachine();
}, [params.slug]);

  const handleBuyNow = () => {
    if (machine) {
      router.push(`/checkout/${encodeURIComponent(machine.slug)}`);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!machine) {
    return <div className="container mx-auto p-6">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Product Image */}
          <div>
            <img
              src={machine.image}
              alt={machine.slug}
              className="rounded-2xl shadow-md w-full object-contain"
            />
          </div>

          {/* Product Description and Buy Button */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{machine.slug}</h1>
            <p className="text-base leading-relaxed mb-6">{machine.description}</p>
            <Button
              onClick={handleBuyNow}
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
            >
              Buy Now - {machine.price}
            </Button>
          </div>

          {/* Product Specifications Table */}
          <div className="col-span-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Specification</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(machine.specs).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell className="font-semibold">{key}</TableCell>
                    <TableCell>{val}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}