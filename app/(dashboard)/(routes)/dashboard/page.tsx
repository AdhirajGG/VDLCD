// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Toaster } from "sonner";
// import { Plus } from "lucide-react";
// import { useMachines } from "@/components/machine";

// function isValidImageUrl(url: string): boolean {
//   const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

//   // Allow root-relative paths (e.g., /images/photo.jpg)
//   if (url.startsWith('/') && imageExtensions.test(url)) {
//     return true;
//   }

//   try {
//     const parsedUrl = new URL(url);
//     // Ensure it's http or https and ends with a valid image extension
//     return ['http:', 'https:'].includes(parsedUrl.protocol) && imageExtensions.test(parsedUrl.pathname);
//   } catch {
//     // If URL constructor fails, it's not a valid absolute URL
//     return false;
//   }
// }
// type NewProductType = {
//   slug: string;
//   model: string;
//   price: string;
//   image: string;
//   description: string;
//   category: string;
//   specs: [string, string][];
// };

// const handleAddProduct = async (newProduct: NewProductType, addMachine: (product: any) => Promise<void>, setNewProduct: React.Dispatch<React.SetStateAction<NewProductType>>) => {
//   // Validate image URL
//   if (!isValidImageUrl(newProduct.image)) {
//     toast.error("Invalid image URL. Must start with / or http(s):// and end with an image extension.");
//     return;
//   }

//   // Validate specs is an array of arrays
//   let specsObject = {};
//   if (
//     Array.isArray(newProduct.specs) &&
//     newProduct.specs.every(spec => Array.isArray(spec) && spec.length === 2)
//   ) {
//     specsObject = Object.fromEntries(newProduct.specs);
//   }

//   try {
//     await addMachine({ ...newProduct, specs: specsObject });
//     toast.success("Product added!");
//     setNewProduct({
//       slug: "",
//       model: "",
//       price: "",
//       image: "",
//       description: "",
//       category: "LCD Repair",
//       specs: [],
//     });
//   }catch (error) {
//   console.error("Add product error:", error);
//   toast.error("Failed to add product.");
// }
// };

// const DashboardPage = () => {
//   const router = useRouter();
//   const { machines, addMachine, refresh } = useMachines() || { machines: [], addMachine: async () => {}, refresh: () => {} };
//   const [isAdmin, setIsAdmin] = useState(true);
//   const [showAddProductModal, setShowAddProductModal] = useState(false);
//   const [newProduct, setNewProduct] = useState({
//     slug: "",
//     model: "",
//     price: "",
//     image: "",
//     description: "",
//     category: "LCD Repair",
//     specs: [] as [string, string][],
//   });

// // app/(dashboard)/(routes)/dashboard/page.tsx


// useEffect(() => {
//   console.warn("Admin check is temporarily disabled for testing. Remember to implement proper authentication!");
// }, []);
  
//   const handleAddSpec = () => {
//     setNewProduct(prev => ({
//       ...prev,
//       specs: [...prev.specs, ["", ""]],
//     }));
//   };

//   const handleSpecChange = (index: number, field: number, value: string) => {
//     const updatedSpecs = [...newProduct.specs];
//     updatedSpecs[index][field] = value;
//     setNewProduct(prev => ({ ...prev, specs: updatedSpecs }));
//   };

//   const handleAddProduct = async () => {
//     // Validate image URL
//     if (!isValidImageUrl(newProduct.image)) {
//       toast.error("Invalid image URL. Must start with / or http(s):// and end with an image extension.");
//       return;
//     }
//     // (Optional) Validate other fields here...

//     // Convert specs to object if needed
//     const specsObject = Object.fromEntries(newProduct.specs);

//     try {
//       await addMachine({ ...newProduct, specs: specsObject });
//       toast.success("Product added!");
//       // Reset form if needed
//       setNewProduct({
//         slug: "",
//         model: "",
//         price: "",
//         image: "",
//         description: "",
//         category: "LCD Repair",
//         specs: [],
//       });
//     } catch {
//       toast.error("Failed to add product.");
//     }
//   };
//   const validateProduct = () => {
//     const requiredFields = ["slug", "model", "price", "image", "description"];
//     const missing = requiredFields.filter(field => !newProduct[field as keyof typeof newProduct]);
//     if (missing.length > 0) {
//       toast.error("Please fill all required fields");
//       return false;
//     }
//     return true;
//   };

//   const resetForm = () => {
//     setNewProduct({
//       slug: "",
//       model: "",
//       price: "",
//       image: "",
//       description: "",
//       category: "LCD Repair",
//       specs: [],
//     });
//   };

//   if (!isAdmin) {
//     router.push("/auth/signin");
//     return null;
//   }
//   return (
//     <div className="p-6 space-y-8">
//       <Toaster /> {/* Ensure Toaster is rendered */}
//       {/* Page Header */}
//       <header className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
//         <Button
//           onClick={() => setShowAddProductModal(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
//         >
//           Add Product
//         </Button>
//       </header>

//       {/* Dashboard Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Recent Activity Card */}
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h2>
//           <p className="text-gray-600">No recent activity</p>
//         </div>

//         {/* Statistics Card */}
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">Statistics</h2>
//           <p className="text-gray-600">
//             Total products: <span className="font-bold">{machines.length}</span>
//           </p>
//         </div>

//         {/* Quick Actions Card */}
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
//           <div className="space-y-2">
//             <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
//               View Reports
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Add Product Modal */}
//       {showAddProductModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
//             <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="category">Category</Label>
//                 <select
//                   id="category"
//                   value={newProduct.category}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, category: e.target.value })
//                   }
//                   className="w-full border-gray-300 rounded-lg p-2"
//                 >
//                   <option value="LCD Repair">LCD Repair</option>
//                   <option value="COF Bonding">COF Bonding</option>
//                   <option value="Laser Machines">Laser Machines</option>
//                 </select>
//               </div>
//               <div>
//                 <Label htmlFor="slug">Slug</Label>
//                 <Input
//                   id="slug"
//                   value={newProduct.slug}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, slug: e.target.value })
//                   }
//                   placeholder="e.g., vd-580-pd"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="model">Model</Label>
//                 <Input
//                   id="model"
//                   value={newProduct.model}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, model: e.target.value })
//                   }
//                   placeholder="e.g., VD-580-PD"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="price">Price</Label>
//                 <Input
//                   id="price"
//                   value={newProduct.price}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, price: e.target.value })
//                   }
//                   placeholder="e.g., $6,000.00"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="image">Image URL</Label>
//                 <Input
//                   id="image"
//                   value={newProduct.image}
//                   onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
//                   placeholder="e.g., /images/products/vd-580-pd.jpg"
//                   className="border p-2 mb-2 w-full"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <textarea
//                   id="description"
//                   value={newProduct.description}
//                   onChange={(e) =>
//                     setNewProduct({ ...newProduct, description: e.target.value })
//                   }
//                   placeholder="Enter product description"
//                   className="w-full border-gray-300 rounded-lg p-2"
//                 />
//               </div>
//               {/* Add spec fields */}
//               <div className="space-y-4">
//                 {newProduct.specs.map((spec, index) => (
//                   <div key={index} className="flex gap-2">
//                     <Input
//                       value={spec[0]}
//                       onChange={(e) => handleSpecChange(index, 0, e.target.value)}
//                       placeholder="Specification name"
//                     />
//                     <Input
//                       value={spec[1]}
//                       onChange={(e) => handleSpecChange(index, 1, e.target.value)}
//                       placeholder="Specification value"
//                     />
//                   </div>
//                 ))}
//                 <Button onClick={handleAddSpec} className="gap-2">
//                   <Plus className="h-4 w-4" />
//                   Add Specification
//                 </Button>
//               </div>
//             </div>
//             <div className="flex justify-end space-x-4">
//               <Button
//                 onClick={() => setShowAddProductModal(false)}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleAddProduct}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//               >
//                 Add Product
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Plus } from "lucide-react";
import { useMachines } from "@/components/machine";

function isValidImageUrl(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  if (url.startsWith("/") && imageExtensions.test(url)) return true;
  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol) && imageExtensions.test(parsedUrl.pathname);
  } catch {
    return false;
  }
}

type NewProductType = {
  slug: string;
  model: string;
  price: string;
  image: string;
  description: string;
  category: string;
  specs: [string, string][];
};

const DashboardPage = () => {
  const router = useRouter();
  const { machines, addMachine } = useMachines();
  const [isAdmin] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProductType>({
    slug: "",
    model: "",
    price: "",
    image: "",
    description: "",
    category: "LCD Repair",
    specs: [],
  });

  useEffect(() => {
    console.warn("Admin check is temporarily disabled for testing.");
  }, []);

  const handleAddSpec = () => {
    setNewProduct((prev) => ({
      ...prev,
      specs: [...prev.specs, ["", ""]],
    }));
  };

  const handleSpecChange = (index: number, field: number, value: string) => {
    const updatedSpecs = [...newProduct.specs];
    updatedSpecs[index][field] = value;
    setNewProduct((prev) => ({ ...prev, specs: updatedSpecs }));
  };

  const validateProduct = (): boolean => {
    const requiredFields = ["slug", "model", "price", "image", "description"];
    const missing = requiredFields.filter((field) => !newProduct[field as keyof NewProductType]);
    if (missing.length > 0) {
      toast.error("Please fill all required fields.");
      return false;
    }
    if (!isValidImageUrl(newProduct.image)) {
      toast.error("Invalid image URL format.");
      return false;
    }
    return true;
  };

 // In your DashboardPage component
const handleAddProduct = async () => {
  if (!validateProduct()) return;

  try {
    // Convert specs from array to object
    const specsObject: Record<string, string> = Object.fromEntries(newProduct.specs);

    await addMachine({ 
      ...newProduct,
      specs: specsObject // ✅ Now matches expected type
    });

    toast.success("Product added!");
    setNewProduct({
      slug: "",
      model: "",
      price: "",
      image: "",
      description: "",
      category: "LCD Repair",
      specs:[],
    });
    setShowAddProductModal(false);
  } catch (error) {
    console.error("Add product error:", error);
    toast.error("Failed to add product.");
  }
};


  if (!isAdmin) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <Toaster />

      {/* Page Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Button
          onClick={() => setShowAddProductModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Add Product
        </Button>
      </header>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>

        {/* Statistics Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Statistics</h2>
          <p className="text-gray-600">
            Total products: <span className="font-bold">{machines?.length ?? 0}</span>
          </p>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              View Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full border-gray-300 rounded-lg p-2"
                >
                  <option value="LCD Repair">LCD Repair</option>
                  <option value="COF Bonding">COF Bonding</option>
                  <option value="Laser Machines">Laser Machines</option>
                </select>
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  placeholder="e.g., vd-580-pd"
                />
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newProduct.model}
                  onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                  placeholder="e.g., VD-580-PD"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="e.g., $6,000.00"
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="e.g., /images/products/vd-580-pd.jpg"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  className="w-full border-gray-300 rounded-lg p-2"
                />
              </div>

              {/* Dynamic Spec Fields */}
              <div className="space-y-4">
                {newProduct.specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec[0]}
                      onChange={(e) => handleSpecChange(index, 0, e.target.value)}
                      placeholder="Specification name"
                    />
                    <Input
                      value={spec[1]}
                      onChange={(e) => handleSpecChange(index, 1, e.target.value)}
                      placeholder="Specification value"
                    />
                  </div>
                ))}
                <Button onClick={handleAddSpec} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Specification
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                onClick={() => setShowAddProductModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
