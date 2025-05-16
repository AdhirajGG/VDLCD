// // app/(dashboard)/(routes)/products/item/[slug]/page.tsx
// "use client"
// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Card, CardContent } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import axios from "axios"
// import { toast } from "sonner"
// import { useCart } from "@/components/cart-context"

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
//   const { slug } = useParams<{ slug: string }>()
//   const router = useRouter()
//   const [product, setProduct] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const { addToCart } = useCart()
//   const [machine, setMachine] = useState<Machine | null>(null);

//   // useEffect(() => {
//   //   const fetchProduct = async () => {
//   //     try {
//   //       const { data } = await axios.get(`/api/machines/${slug}`)
//   //       setProduct(data)
//   //     } catch (error) {
//   //       toast.error("Product not found")
//   //       router.push("/products")
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   //   fetchProduct()
//   // }, [slug])
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
//     return <div className="container p-6">Loading...</div>
//   }

//   if (!product) {
//     return null
//   }

//   return (
//     <div className="container p-6">
//       <Card className="p-4">
//         <CardContent className="grid md:grid-cols-2 gap-6">
//           <div className="relative aspect-square">
//             <img
//               src={product.image}
//               alt={product.model}
//               className="rounded-lg object-contain w-full h-full"
//             />
//           </div>

//           <div className="space-y-4">
//             <h1 className="text-3xl font-bold">{product.model}</h1>
//             <p className="text-2xl font-semibold text-primary">
//               ${parseFloat(product.price.replace(/[^0-9.]/g, '')).toFixed(2)}
//             </p>
//             <p className="text-muted-foreground">{product.description}</p>

//             {product.specs && Object.keys(product.specs).length > 0 && (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Specification</TableHead>
//                     <TableHead>Details</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {Object.entries(product.specs).map(([key, value]) => (
//                     <TableRow key={key}>
//                       <TableCell className="font-medium">{key}</TableCell>
//                       <TableCell>{value as string}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             )}

//             <Button
//               className="w-full"
//               size="lg"
//               onClick={() => {
//                 addToCart({
//                   slug: product.slug,
//                   model: product.model,
//                   price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
//                   image: product.image
//                 })
//                 toast.success("Added to cart!")
//               }}
//             >
//               Add to Cart
//             </Button>
//                    <Button
//               className="w-full"
//               size="lg"
//                onClick={() => router.push(`/checkout/${encodeURIComponent(product.slug)}`)}
//             >
//               Buy Now
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// app/(dashboard)/(routes)/products/item/[slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "@/components/cart-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
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
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<EditFormData>({
    model: "",
    price: "",
    image: "",
    description: "",
    category: "",
    specs: [],
  });

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    if (!slug) return;
    const fetchMachine = async () => {
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
      } catch (error) {
        console.error("Failed to fetch machine:", error);
        toast.error("Product not found");
        router.replace("/products"); // navigate away
      } finally {
        setLoading(false);
      }
    };
    fetchMachine();
  }, [slug, router]);

  const handleEditSpecChange = (index: number, field: number, value: string) => {
    const updatedSpecs = [...editData.specs];
    updatedSpecs[index][field] = value;
    setEditData(prev => ({ ...prev, specs: updatedSpecs }));
  };

  const handleAddSpec = () => {
    setEditData(prev => ({
      ...prev,
      specs: [...prev.specs, ["", ""]],
    }));
  };

  const handleDeleteSpec = (index: number) => {
    setEditData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const specsObject = Object.fromEntries(
        editData.specs.filter(([key, value]) => key && value)
      );

      await axios.put(`/api/machines/${slug}`, {
        ...editData,
        specs: specsObject,
      });
      toast.success("Product updated!");
      setEditOpen(false);
      // Optionally refetch machine data


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
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return <div className="container p-6"><Loading /></div>;
  }

  if (!machine) {
    // you could also show a 404 UI here
    return null;
  }

  return (
    <div className="container p-6">
      <Card className="p-4">
        <CardContent className="grid md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative aspect-square">
            <img
              src={machine.image}
              alt={machine.model}
              className="rounded-lg object-contain w-full h-full"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{machine.model}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${parseFloat(machine.price.replace(/[^0-9.]/g, "")).toFixed(2)}
            </p>
            <p className="text-muted-foreground">{machine.description}</p>

            {/* Specs Table */}
            {machine.specs && Object.keys(machine.specs).length > 0 && (
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
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{val}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(true)}
                >
                  Update Details
                </Button>
              )}
              <Button
                className="w-full"
                onClick={() => {
                  addToCart({
                    slug: machine.slug,
                    model: machine.model,
                    price: parseFloat(machine.price.replace(/[^0-9.]/g, "")),
                    image: machine.image,
                  });
                  toast.success("Added to cart!");
                }}
              >
                Add to Cart
              </Button>
              <Button
                className="w-full"
                size="lg"
                onClick={() =>
                  router.push(`/checkout/${encodeURIComponent(machine.slug)}`)
                }
              >
                Buy Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
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
                onChange={(e) => setEditData(prev => ({ ...prev, model: e.target.value }))}
              />
            </div>

            {/* <div>
              <Label>Price</Label>
              <Input
                value={editData.price}
                onChange={(e) => setEditData(prev => ({ ...prev, price: e.target.value }))}
              />
            </div> */}

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                min="0"
                step="1"
                value={editData.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  const sanitizedValue = value.replace(/(\..*)\./g, '$1');
                  setEditData(prev => ({ ...prev, price: sanitizedValue }));
                }}
                onKeyDown={(e) => {
                  if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div>
              <Label>Image URL</Label>
              <Input
                value={editData.image}
                onChange={(e) => setEditData(prev => ({ ...prev, image: e.target.value }))}
              />
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border rounded-md p-2 min-h-[100px]"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={editData.category}
                onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>

            {/* <div className="space-y-4">
              <Label>Specifications</Label>
              {editData.specs.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec[0]}
                    onChange={(e) => handleEditSpecChange(index, 0, e.target.value)}
                    placeholder="Spec name"
                  />
                  <Input
                    value={spec[1]}
                    onChange={(e) => handleEditSpecChange(index, 1, e.target.value)}
                    placeholder="Spec value"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteSpec(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button
                onClick={handleAddSpec}
                className="w-full"
                variant="secondary"
              >
                Add Specification
              </Button>
            </div> */}

            <div className="space-y-4">
              <Label>Specifications</Label>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                {editData.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={spec[0]}
                      onChange={(e) => handleEditSpecChange(index, 0, e.target.value)}
                      placeholder="Spec name"
                    />
                    <Input
                      value={spec[1]}
                      onChange={(e) => handleEditSpecChange(index, 1, e.target.value)}
                      placeholder="Spec value"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSpec(index)}
                      className="shrink-0"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleAddSpec}
                className="w-full"
                variant="secondary"
              >
                Add Specification
              </Button>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
