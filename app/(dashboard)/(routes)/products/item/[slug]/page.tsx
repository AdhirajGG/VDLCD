// // app/(dashboard)/(routes)/products/item/[slug]/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import axios from "axios";
// import { toast } from "sonner";
// import { useCart } from "@/components/cart-context";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useUser } from "@clerk/nextjs";
// import Loading from "./loading";

// type Machine = {
//   slug: string;
//   model: string;
//   price: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: Record<string, string>;
// };

// type EditFormData = {
//   model: string;
//   price: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: [string, string][];
// };

// export default function ProductDetailPage() {
//   const { slug } = useParams<{ slug: string }>();
//   const router = useRouter();
//   const [machine, setMachine] = useState<Machine | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();

//   const { user } = useUser();
//   const [editOpen, setEditOpen] = useState(false);
//   const [editData, setEditData] = useState<EditFormData>({
//     model: "",
//     price: "",
//     image: "",
//     description: "",
//     category: "",
//     specs: [],
//   });

//   const isAdmin = user?.publicMetadata?.role === "admin";

//   useEffect(() => {
//     if (!slug) return;
//     const fetchMachine = async () => {
//       try {
//         const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
//         setMachine(data);
//         setEditData({
//           model: data.model,
//           price: data.price,
//           image: data.image,
//           description: data.description,
//           category: data.category,
//           specs: Object.entries(data.specs),
//         });
//       } catch (error) {
//         console.error("Failed to fetch machine:", error);
//         toast.error("Product not found");
//         router.replace("/products"); // navigate away
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMachine();
//   }, [slug, router]);

//   const handleEditSpecChange = (index: number, field: number, value: string) => {
//     const updatedSpecs = [...editData.specs];
//     updatedSpecs[index][field] = value;
//     setEditData(prev => ({ ...prev, specs: updatedSpecs }));
//   };

//   const handleAddSpec = () => {
//     setEditData(prev => ({
//       ...prev,
//       specs: [...prev.specs, ["", ""]],
//     }));
//   };

//   const handleDeleteSpec = (index: number) => {
//     setEditData(prev => ({
//       ...prev,
//       specs: prev.specs.filter((_, i) => i !== index),
//     }));
//   };

//   const handleUpdateProduct = async () => {
//     try {
//       const specsObject = Object.fromEntries(
//         editData.specs.filter(([key, value]) => key && value)
//       );

//       await axios.put(`/api/machines/${slug}`, {
//         ...editData,
//         specs: specsObject,
//       });
//       toast.success("Product updated!");
//       setEditOpen(false);
//       // Optionally refetch machine data


//       const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
//       setMachine(data);
//       setEditData({
//         model: data.model,
//         price: data.price,
//         image: data.image,
//         description: data.description,
//         category: data.category,
//         specs: Object.entries(data.specs),
//       });
//        router.refresh();
//     } catch (error) {
//       toast.error("Failed to update product");
//     }
//   };

//   if (loading) {
//     return <div className="container p-6"><Loading /></div>;
//   }

//   if (!machine) {
//     // you could also show a 404 UI here
//     return null;
//   }

//   return (
//     <div className="container p-6">
//       <Card className="p-4">
//         <CardContent className="grid md:grid-cols-2 gap-6">
//           {/* Image */}
//           <div className="relative aspect-square">
//             <img
//               src={machine.image}
//               alt={machine.model}
//               className="rounded-lg object-contain w-full h-full"
//             />
//           </div>

//           {/* Details */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{machine.model}</h1>
//             <p className="text-2xl font-semibold text-primary">
//               ${parseFloat(machine.price.replace(/[^0-9.]/g, "")).toFixed(2)}
//             </p>
//             <p className="text-muted-foreground">{machine.description}</p>

//             {/* Specs Table */}
//             {machine.specs && Object.keys(machine.specs).length > 0 && (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Specification</TableHead>
//                     <TableHead>Details</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {Object.entries(machine.specs).map(([key, val]) => (
//                     <TableRow key={key}>
//                       <TableCell className="font-medium">{key}</TableCell>
//                       <TableCell>{val}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}

//             {/* Actions */}
//             <div className="flex flex-col space-y-2">
//               {isAdmin && (
//                 <Button
//                   variant="outline"
//                   onClick={() => setEditOpen(true)}
//                 >
//                   Update Details
//                 </Button>
//               )}
//               <Button
//                 className="w-full"
//                 onClick={() => {
//                   addToCart({
//                     slug: machine.slug,
//                     model: machine.model,
//                     price: parseFloat(machine.price.replace(/[^0-9.]/g, "")),
//                     image: machine.image,
//                   });
//                   toast.success("Added to cart!");
//                 }}
//               >
//                 Add to Cart
//               </Button>
//               <Button
//                 className="w-full"
//                 size="lg"
//                 onClick={() =>
//                   router.push(`/checkout/${encodeURIComponent(machine.slug)}`)
//                 }
//               >
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Edit Dialog */}
//       <Dialog open={editOpen} onOpenChange={setEditOpen}>
//         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Edit Product Details</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <Label>Model Name</Label>
//               <Input
//                 value={editData.model}
//                 onChange={(e) => setEditData(prev => ({ ...prev, model: e.target.value }))}
//               />
//             </div>

//             {/* <div>
//               <Label>Price</Label>
//               <Input
//                 value={editData.price}
//                 onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
//               />
//             </div> */}

//             <div>
//               <Label>Price</Label>
//               <Input
//                 type="number"
//                 min="0"
//                 step="1"
//                 value={editData.price}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/[^0-9.]/g, '');
//                   const sanitizedValue = value.replace(/(\..*)\./g, '$1');
//                   setEditData(prev => ({ ...prev, price: sanitizedValue }));
//                 }}
//                 onKeyDown={(e) => {
//                   if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
//                     e.preventDefault();
//                   }
//                 }}
//               />
//             </div>

//             <div>
//               <Label>Image URL</Label>
//               <Input
//                 value={editData.image}
//                 onChange={(e) => setEditData(prev => ({ ...prev, image: e.target.value }))}
//               />
//             </div>

//             <div>
//               <Label>Description</Label>
//               <textarea
//                 value={editData.description}
//                 onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
//                 className="w-full border rounded-md p-2 min-h-[100px]"
//               />
//             </div>

//             <div>
//               <Label>Category</Label>
//               <Input
//                 value={editData.category}
//                 onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
//               />
//             </div>

//             <div className="space-y-4">
//               <Label>Specifications</Label>
//               <div className="max-h-[300px] overflow-y-auto pr-2">
//                 {editData.specs.map((spec, index) => (
//                   <div key={index} className="flex gap-2 mb-2">
//                     <Input
//                       value={spec[0]}
//                       onChange={(e) => handleEditSpecChange(index, 0, e.target.value)}
//                       placeholder="Spec name"
//                     />
//                     <Input
//                       value={spec[1]}
//                       onChange={(e) => handleEditSpecChange(index, 1, e.target.value)}
//                       placeholder="Spec value"
//                     />
//                     <Button
//                       variant="destructive"
//                       onClick={() => handleDeleteSpec(index)}
//                       className="shrink-0"
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//               <Button
//                 onClick={handleAddSpec}
//                 className="w-full"
//                 variant="secondary"
//               >
//                 Add Specification
//               </Button>
//             </div>

//             <div className="flex justify-end gap-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={() => setEditOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button onClick={handleUpdateProduct}>
//                 Save Changes
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// app/(dashboard)/(routes)/products/item/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "@/components/cart-context";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "./loading";

type Machine = {
  slug: string;
  model: string;
  price: string;
  image: string;
  description: string;
  category: string;
  specs: Record<string, string>;
};

type EditFormData = {
  model: string;
  price: string;
  image: string;
  description: string;
  category: string;
  specs: [string, string][];
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({
    model: "",
    price: "",
    image: "",
    description: "",
    category: "",
    specs: [],
  });

  // Fetch machine
  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
        setMachine(data);
        setEditData({
          model: data.model,
          price: data.price,
          image: data.image,
          description: data.description,
          category: data.category,
          specs: Object.entries(data.specs),
        });
      } catch {
        toast.error("Product not found");
        router.replace("/products");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, router]);

  // Handlers for spec edits
  const handleEditSpecChange = (i: number, f: 0 | 1, v: string) => {
    const s = [...editData.specs];
    s[i][f] = v;
    setEditData(d => ({ ...d, specs: s }));
  };
  const handleAddSpec = () =>
    setEditData(d => ({ ...d, specs: [...d.specs, ["", ""]] }));
  const handleDeleteSpec = (i: number) =>
    setEditData(d => ({ ...d, specs: d.specs.filter((_, idx) => idx !== i) }));

  // Save updates
  const handleUpdateProduct = async () => {
    try {
      const specsObj = Object.fromEntries(
        editData.specs.filter(([k, v]) => k && v)
      );
      await axios.put(`/api/machines/${slug}`, { ...editData, specs: specsObj });
      toast.success("Product updated!");
      setEditOpen(false);
      // Re-fetch
      const { data } = await axios.get<Machine>(`/api/machines/${slug}`);
      setMachine(data);
      setEditData({
        model: data.model,
        price: data.price,
        image: data.image,
        description: data.description,
        category: data.category,
        specs: Object.entries(data.specs),
      });
      router.refresh();
    } catch {
      toast.error("Failed to update product");
    }
  };

  // Loading / null
  if (loading) {
    return (
      <div className="container p-6">
        <Loading />
      </div>
    );
  }
  if (!machine) return null;

  // Add to cart
  const addToCartHandler = () => {
    addToCart({
      slug: machine.slug,
      model: machine.model,
      price: parseFloat(machine.price.replace(/[^0-9.]/g, "")),
      image: machine.image,
    });
    toast.success("Added to cart!");
  };
  // Buy now
  const buyNowHandler = () => {
    router.push(`/checkout/${encodeURIComponent(machine.slug)}`);
  };

  return (
    <div className="container p-6 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-indigo-800/50 bg-indigo-900/30">
            <img
              src={machine.image}
              alt={machine.model}
              className="object-contain w-full h-full p-8"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="pb-6 border-b border-indigo-800/50">
              <h1 className="text-4xl font-bold text-indigo-100">{machine.model}</h1>
              <p className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mt-2">
                ${parseFloat(machine.price).toFixed(2)}
              </p>
            </div>

            <p className="text-indigo-300 text-lg leading-relaxed">
              {machine.description}
            </p>

            {/* Specifications */}
            <div className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/50">
              <h2 className="text-xl font-semibold text-indigo-100 mb-4">Technical Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(machine.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-indigo-800/50">
                    <span className="text-indigo-300">{key}</span>
                    <span className="text-indigo-100 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 h-14 text-lg"
                onClick={addToCartHandler}
              >
                Add to Cart
              </Button>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-14 text-lg"
                onClick={buyNowHandler}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Edit Dialog */}
      {isAdmin && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Product Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Model Name</Label>
                <Input
                  value={editData.model}
                  onChange={e => setEditData(d => ({ ...d, model: e.target.value }))}
                />
              </div>

              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={editData.price}
                  onChange={e => {
                    const v = e.target.value.replace(/[^0-9.]/g, "");
                    setEditData(d => ({ ...d, price: v }));
                  }}
                />
              </div>

              <div>
                <Label>Image URL</Label>
                <Input
                  value={editData.image}
                  onChange={e => setEditData(d => ({ ...d, image: e.target.value }))}
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={editData.description}
                  onChange={e => setEditData(d => ({ ...d, description: e.target.value }))}
                  className="w-full border rounded-md p-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label>Category</Label>
                <Input
                  value={editData.category}
                  onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <Label>Specifications</Label>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {editData.specs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        value={spec[0]}
                        placeholder="Spec name"
                        onChange={e => handleEditSpecChange(idx, 0, e.target.value)}
                      />
                      <Input
                        value={spec[1]}
                        placeholder="Spec value"
                        onChange={e => handleEditSpecChange(idx, 1, e.target.value)}
                      />
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteSpec(idx)}
                        className="shrink-0"
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={handleAddSpec} variant="secondary" className="w-full">
                  Add Specification
                </Button>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
