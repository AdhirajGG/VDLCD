// // app/(dashboard)/(routes)/dashboard/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast, Toaster } from "sonner";
// import { Plus, Edit, Trash } from "lucide-react";
// import { useMachines } from "@/components/machine";
// import axios from "axios";
// import { useUser } from "@clerk/nextjs";
// import { motion } from "framer-motion";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { BarChart } from "@/components/ui/chart";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// const DashboardPage = () => {
//   const router = useRouter();
//   const { machines, categories, addMachine, refresh, refreshCategories } = useMachines();
//   const { user } = useUser();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [showAddProductModal, setShowAddProductModal] = useState(false);
//   const [showCategoryManagement, setShowCategoryManagement] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  
//   const [newProduct, setNewProduct] = useState({
//     slug: "",
//     model: "",
//     price: "0",
//     image: "",
//     description: "",
//     category: categories[0]?.name || "",
//     specs: [] as [string, string][],
//   });

//   useEffect(() => {
//     if (!user) router.push("/sign-in");
//     else setIsAdmin(user.publicMetadata.role === "admin");
//   }, [user, router]);

//   useEffect(() => {
//     if (categories.length && !newProduct.category) {
//       setNewProduct(p => ({ ...p, category: categories[0].name }));
//     }
//   }, [categories]);

//   const handleSaveCategory = async () => {
//     try {
//       if (!newCategory.trim()) {
//         toast.error("Category name cannot be empty");
//         return;
//       }

//       if (editingCategory) {
//         await axios.put(`/api/categories/${editingCategory.id}`, { name: newCategory.trim() });
//         toast.success("Category updated!");
//       } else {
//         await axios.post("/api/categories", { name: newCategory.trim() });
//         toast.success("Category added!");
//       }

//       setNewCategory("");
//       setEditingCategory(null);
//       await refreshCategories();
//       await refresh();
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Failed to save category");
//     }
//   };

//   const handleDeleteCategory = async (categoryId: string) => {
//     try {
//       await axios.delete(`/api/categories/${categoryId}`);
//       toast.success("Category deleted!");
//       await refreshCategories();
//       await refresh();
//     } catch (err: any) {
//       toast.error("Failed to delete category");
//     }
//   };

//   const handleAddProduct = async () => {
//     if (!newProduct.slug || !newProduct.model || !newProduct.price || !newProduct.image || !newProduct.description) {
//       toast.error("Fill all product fields");
//       return;
//     }

//     try {
//       const specsObj = Object.fromEntries(newProduct.specs);
//       await addMachine({ ...newProduct, specs: specsObj });
//       toast.success("Product added!");
//       setNewProduct({
//         slug: "",
//         model: "",
//         price: "0",
//         image: "",
//         description: "",
//         category: categories[0]?.name || "",
//         specs: [],
//       });
//       setShowAddProductModal(false);
//       await refresh();
//     } catch (err: any) {
//       if (err.response?.status === 409) {
//         toast.error("Product slug already exists");
//       } else {
//         console.error("Add product error:", err);
//       }
//     }
//   };

//   return (
//     <div className="p-6 space-y-8">
//       <Toaster richColors />

//       {/* Header */}
//       <motion.header
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex justify-between items-center"
//       >
//         <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           {isAdmin ? "Admin" : "User"} Dashboard
//         </h1>

//         {isAdmin && (
//           <div className="flex gap-4">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 onClick={() => setShowAddProductModal(true)}
//                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
//               >
//                 <Plus className="mr-2 h-4 w-4" /> Add Product
//               </Button>
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button variant="outline" onClick={() => setShowCategoryManagement(true)}>
//                 <Plus className="mr-2 h-4 w-4" /> Manage Categories
//               </Button>
//             </motion.div>
//           </div>
//         )}
//       </motion.header>

//       {/* Stats Cards */}
//       <div className="space-y-6">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6"
//         >
//           <motion.div
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.4 }}
//           >
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <CardTitle className="text-lg">Total Products</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-blue-600">{machines.length}</div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.4, delay: 0.1 }}
//           >
//             <Card className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <CardTitle className="text-lg">Categories</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-purple-600">{categories.length}</div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </motion.div>

//         {/* <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.4, delay: 0.2 }}
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg">Sales Overview</CardTitle>
//             </CardHeader>
//             <CardContent className="h-80">
//               <BarChart data={machines} dataKey="price" nameKey="model" />
//             </CardContent>
//           </Card>
//         </motion.div> */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <Card className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="text-lg">Sales Overview</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <BarChart
//                 data={machines}
//                 dataKey="price"
//                 nameKey="model"
//               />
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>

//       {/* Category Management Modal */}
//       {showCategoryManagement && (
//         <Dialog open={showCategoryManagement} onOpenChange={setShowCategoryManagement}>
//           <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
//             <motion.div
//               initial={{ scale: 0.95 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.2 }}
//             >
//               <DialogHeader>
//                 <DialogTitle>Manage Categories</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <Label>{editingCategory ? "Edit" : "New"} Category</Label>
//                   <div className="flex gap-2">
//                     <Input
//                       value={newCategory}
//                       onChange={(e) => setNewCategory(e.target.value)}
//                       placeholder="Category name"
//                     />
//                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                       <Button onClick={handleSaveCategory}>
//                         {editingCategory ? "Update" : "Add"}
//                       </Button>
//                     </motion.div>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Existing Categories</Label>
//                   {categories.map((category) => (
//                     <motion.div
//                       key={category.name}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center justify-between p-2 border rounded-lg"
//                     >
//                       <span>{category.name}</span>
//                       <div className="flex gap-2">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => {
//                             setEditingCategory({ id: category.name, name: category.name });
//                             setNewCategory(category.name);
//                           }}
//                         >
//                           <Edit className="h-4 w-4 text-muted-foreground" />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteCategory(category.name)}
//                         >
//                           <Trash className="h-4 w-4 text-red-500" />
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </DialogContent>
//         </Dialog>
//       )}

//       {/* Add Product Modal */}
//       {showAddProductModal && (
//         <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
//           <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2 }}
//             >
//               <DialogHeader>
//                 <DialogTitle>Add New Product</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-4">
//                 <div>
//                   <Label>Category</Label>
//                   <select
//                     value={newProduct.category}
//                     onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
//                     className="w-full border p-2 rounded-lg"
//                   >
//                     {categories.map(c => (
//                       <option key={c.name} value={c.name}>{c.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {["slug", "model", "image"].map((field) => (
//                   <div key={field}>
//                     <Label className="capitalize">{field}</Label>
//                     <Input
//                       value={
//                         typeof newProduct[field as keyof typeof newProduct] === "string"
//                           ? (newProduct[field as keyof typeof newProduct] as string)
//                           : ""
//                       }
//                       onChange={(e) => setNewProduct(p => ({ ...p, [field]: e.target.value }))}
//                       placeholder={`Enter ${field}`}
//                     />
//                   </div>
//                 ))}

//                 <div>
//                   <Label>Price</Label>
//                   <Input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={newProduct.price}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/[^0-9.]/g, '');
//                       const sanitizedValue = value.replace(/(\..*)\./g, '$1');
//                       setNewProduct(p => ({ ...p, price: sanitizedValue }));
//                     }}
//                     onKeyDown={(e) => {
//                       if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') e.preventDefault();
//                     }}
//                     placeholder="Enter price"
//                   />
//                 </div>

//                 <div>
//                   <Label>Description</Label>
//                   <textarea
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
//                     className="w-full border p-2 rounded-lg min-h-[100px]"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="max-h-[300px] overflow-y-auto pr-2">
//                     {newProduct.specs.map((spec, i) => (
//                       <motion.div
//                         key={i}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="flex gap-2 mb-2"
//                       >
//                         <Input
//                           value={spec[0]}
//                           onChange={(e) => {
//                             const sp = [...newProduct.specs];
//                             sp[i][0] = e.target.value;
//                             setNewProduct(p => ({ ...p, specs: sp }));
//                           }}
//                           placeholder="Spec name"
//                         />
//                         <Input
//                           value={spec[1]}
//                           onChange={(e) => {
//                             const sp = [...newProduct.specs];
//                             sp[i][1] = e.target.value;
//                             setNewProduct(p => ({ ...p, specs: sp }));
//                           }}
//                           placeholder="Spec value"
//                         />
//                       </motion.div>
//                     ))}
//                   </div>
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button
//                       variant="outline"
//                       onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }))}
//                       className="w-full"
//                     >
//                       <Plus className="mr-2" /> Add Spec
//                     </Button>
//                   </motion.div>
//                 </div>

//                 <div className="flex justify-end gap-4 mt-6">
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button variant="outline" onClick={() => setShowAddProductModal(false)}>
//                       Cancel
//                     </Button>
//                   </motion.div>
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button onClick={handleAddProduct}>Add Product</Button>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;


// app/(dashboard)/(routes)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useMachines } from "@/components/machine";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, ListTree, Wallet, Users, Warehouse } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${color} p-6 rounded-xl border border-indigo-800/50`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-indigo-300">{title}</p>
        <p className="text-3xl font-bold text-indigo-100">{value}</p>
      </div>
      <div className="p-3 bg-indigo-900/30 rounded-lg">{icon}</div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const { machines, categories, addMachine, refresh, refreshCategories } =
    useMachines();

  // Category dialog state
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  // Product dialog state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    slug: "",
    model: "",
    price: "",
    image: "",
    description: "",
    category: categories[0]?.name || "",
    specs: [] as [string, string][],
  });

  // Stats state
  const [totalSales, setTotalSales] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [salesData, setSalesData] = useState<{ model: string; sales: number }[]>(
    []
  );

  // Redirect non-signed-in users and set admin flag
  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      setIsAdmin(user.publicMetadata.role === "admin");
    }
  }, [user, router]);

  // Initial load of machines & categories
  useEffect(() => {
    refreshCategories();
    refresh();
  }, []);

  // Load sales & active users if admin
  useEffect(() => {
    if (!isAdmin) return;

    const loadSales = async () => {
      try {
        const { data: orders } = await axios.get("/api/orders");
        // total sales
        const sum = orders.reduce((acc: number, o: any) => acc + o.total, 0);
        setTotalSales(Math.round(sum));
        // per-product sales
        const per: Record<string, number> = {};
        orders.forEach((o: any) => {
          JSON.parse(o.items).forEach((it: any) => {
            per[it.model] = (per[it.model] || 0) + it.price * it.quantity;
          });
        });
        setSalesData(
          Object.entries(per).map(([model, sales]) => ({
            model,
            sales: Number(sales.toFixed(2)),
          }))
        );
      } catch {
        toast.error("Could not load sales data");
      }
    };

    const loadUsers = async () => {
      try {
        const { data } = await axios.get("/api/users/active");
        setActiveUsers(data.count);
      } catch {
        toast.error("Could not load user data");
      }
    };

    loadSales();
    loadUsers();
  }, [isAdmin]);

  // Fallback chart data
  const fallbackSales = machines.map((m) => ({
    model: m.model,
    sales: parseFloat(m.price.replace(/[^0-9.]/g, "")),
  }));

  // Handlers
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      await axios.post("/api/categories", { name: newCategory.trim() });
      toast.success("Category added!");
      setNewCategory("");
      await refreshCategories();
      await refresh();
      setShowCategoryDialog(false);
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Failed to add category");
    }
  };

  const handleAddProduct = async () => {
    const { slug, model, price, image, description, category, specs } =
      newProduct;
    if (!slug || !model || !price || !image || !description) {
      toast.error("Fill all product fields");
      return;
    }
    try {
      const specsObj = Object.fromEntries(specs);
      await addMachine({ slug, model, price, image, description, category, specs: specsObj });
      toast.success("Product added!");
      setNewProduct({
        slug: "",
        model: "",
        price: "",
        image: "",
        description: "",
        category: categories[0]?.name || "",
        specs: [],
      });
      setShowAddProductModal(false);
      await refresh();
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error("Product slug already exists");
      } else {
        toast.error("Failed to add product");
      }
    }
  };

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <Toaster richColors />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {isAdmin ? "Admin" : "User"} Dashboard
          </h1>

          {isAdmin && (
            <div className="flex gap-4">
              {/* Add Product */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </motion.div>
              {/* Add Category */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </motion.div>
            </div>
          )}
        </motion.header>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={machines.length}
            icon={<Warehouse className="h-6 w-6 text-blue-600" />}
            color="bg-cyan-500/20"
          />
          <StatCard
            title="Categories"
            value={categories.length}
            icon={<ListTree className="h-6 w-6 text-purple-600" />}
            color="bg-purple-500/20"
          />
          <StatCard
            title="Total Sales"
            value={totalSales}
            icon={<Wallet className="h-6 w-6 text-green-600" />}
            color="bg-green-500/20"
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<Users className="h-6 w-6 text-orange-600" />}
            color="bg-orange-500/20"
          />
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-900/30 rounded-xl p-6 border border-indigo-800/50"
        >
          <h2 className="text-xl font-semibold text-indigo-100 mb-4">
            Sales Overview
          </h2>
          <div className="h-80 w-full overflow-x-auto">
            <div className="min-w-[600px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={salesData.length > 0 ? salesData : fallbackSales}
                  margin={{ right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="model"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    tick={{ fill: "#93c5fd" }}
                  />
                  <YAxis tick={{ fill: "#93c5fd" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1b4b",
                      border: "1px solid #4f46e5",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#06b6d4"
                    name="Total Sales"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <input
              className="w-full border p-2 rounded-lg"
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category</Label>
              <select
                className="w-full border p-2 rounded-lg"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, category: e.target.value }))
                }
              >
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {["slug", "model", "price", "image"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  value={(newProduct as any)[field]}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
                      [field]: e.target.value,
                    }))
                  }
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
            <div>
              <Label>Description</Label>
              <textarea
                className="w-full border p-2 rounded-lg"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              {newProduct.specs.map((spec, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={spec[0]}
                    onChange={(e) => {
                      const s = [...newProduct.specs];
                      s[i][0] = e.target.value;
                      setNewProduct((p) => ({ ...p, specs: s }));
                    }}
                    placeholder="Spec name"
                  />
                  <Input
                    value={spec[1]}
                    onChange={(e) => {
                      const s = [...newProduct.specs];
                      s[i][1] = e.target.value;
                      setNewProduct((p) => ({ ...p, specs: s }));
                    }}
                    placeholder="Spec value"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  setNewProduct((p) => ({ ...p, specs: [...p.specs, ["", ""]] }))
                }
              >
                <Plus className="mr-2" /> Add Spec
              </Button>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAddProductModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
