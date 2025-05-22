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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ListTree, Wallet, Users, Warehouse, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors } from "@/lib/colors";
import {
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

// const StatCard = ({ title, value, icon }: StatCardProps) => (
//   <motion.div
//     whileHover={{ scale: 1.02 }}
//     className="p-6 rounded-xl border bg-background-light"
//     style={{ borderColor: colors.background.light }}
//   >
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm" style={{ color: colors.text.secondary }}>{title}</p>
//         <p className="text-3xl font-bold" style={{ color: colors.text.primary }}>{value}</p>
//       </div>
//       <div className="p-3 rounded-lg" style={{ backgroundColor: colors.background.light }}>
//         {icon}
//       </div>
//     </div>
//   </motion.div>
// );

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-3 sm:p-4 rounded-lg border bg-background-light"
    style={{ borderColor: colors.background.light }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
          {title}
        </p>
        <p className="text-xl sm:text-2xl font-bold" style={{ color: colors.text.primary }}>
          {value}
        </p>
      </div>
      <div className="p-2 sm:p-3 rounded-md" style={{ backgroundColor: colors.background.light }}>
        {icon}
      </div>
    </div>
  </motion.div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const { machines, categories, addMachine, refresh, refreshCategories } = useMachines();

  // Category Management
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  // Product Management
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    slug: "",
    model: "",
    price: "",
    image: "",
    description: "",
    category: categories[0]?.name || "",
    specs: [] as [string, string][],
  });

  // Analytics
  const [totalSales, setTotalSales] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [salesData, setSalesData] = useState<{ model: string; sales: number }[]>([]);

  useEffect(() => {
    if (!user) router.push("/sign-in");
    else setIsAdmin(user.publicMetadata.role === "admin");
  }, [user, router]);

  useEffect(() => {
    refreshCategories();
    refresh();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    // const loadAnalytics = async () => {
    //   try {
    //     // Load sales data
    //     const { data: orders } = await axios.get("/api/orders");
    //     const salesTotal = orders.reduce((acc: number, o: any) => acc + o.total, 0);
    //     setTotalSales(Math.round(salesTotal));

    //     const productSales: Record<string, number> = {};
    //     orders.forEach((o: any) => {
    //       JSON.parse(o.items).forEach((it: any) => {
    //         productSales[it.model] = (productSales[it.model] || 0) + it.price * it.quantity;
    //       });
    //     });
    //     setSalesData(Object.entries(productSales).map(([model, sales]) => ({
    //       model,
    //       sales: Number(sales.toFixed(2)),
    //     })));

    //     // Load active users
    //     const { data: users } = await axios.get("/api/users/active");
    //     setActiveUsers(users.count);
    //   } catch (error) {
    //     toast.error("Failed to load analytics data");
    //   }
    // };

    const loadAnalytics = async () => {
      try {
        // Load sales data
        const { data: orders } = await axios.get("/api/orders");
        const salesTotal = orders.reduce((acc: number, o: any) => acc + o.total, 0);
        setTotalSales(Math.round(salesTotal));

        // Load active users
        try {
          const { data: users } = await axios.get("/api/users/active");
          setActiveUsers(users.count);
        } catch (error) {
          console.error("Failed to load active users:", error);
          setActiveUsers(0);
        }

      } catch (error) {
        toast.error("Failed to load analytics data");
      }
    };

    loadAnalytics();
  }, [isAdmin]);

  const handleCategorySubmit = async () => {
    try {
      if (!newCategory.trim()) throw new Error("Category name required");

      if (editingCategory) {
        await axios.put(`/api/categories/${encodeURIComponent(editingCategory)}`, { name: newCategory.trim() });
        toast.success("Category updated");
      } else {
        await axios.post("/api/categories", { name: newCategory.trim() });
        toast.success("Category added");
      }

      setNewCategory("");
      setEditingCategory(null);
      await refreshCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Category operation failed");
    }
  };

  // const handleDeleteCategory = async (categoryName: string) => {
  //   try {
  //     await axios.delete(`/api/categories/${categoryName}`);
  //     toast.success("Category deleted");
  //     await refreshCategories();
  //   } catch (error) {
  //     toast.error("Failed to delete category");
  //   }
  // };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      await axios.delete(`/api/categories/${categoryName}`);
      await refreshCategories(); // Refresh categories list
      await refresh(); // Refresh products list
      toast.success("Category and related products deleted");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  // const handleAddProduct = async () => {
  //   try {
  //   const { slug, model, price, image, description, category, specs } = newProduct;
  //   if (!slug || !model || !price || !image || !description || !category) {
  //     throw new Error("All fields are required");
  //   }

  //     const specsObj = Object.fromEntries(specs);
  //     await addMachine({ slug, model, price: Number(price), image, description, category, specs: specsObj });

  //     toast.success("Product added");
  //     setProductDialogOpen(false);
  //     setNewProduct({
  //       slug: "",
  //       model: "",
  //       price: "",
  //       image: "",
  //       description: "",
  //       category: categories[0]?.name || "",
  //       specs: [],
  //     });
  //     await refresh();
  //   } catch (error:any) {
  //   toast.error(error.response?.data?.error || "Failed to add product");
  // }
  // };

const handleAddProduct = async () => {
    try {
      const { slug, model, price, image, description, category, specs } = newProduct;
      if (!slug || !model || !price || !image || !description) {
        throw new Error("All fields are required");
      }

      const specsObj = Object.fromEntries(specs);
      await addMachine({ slug, model, price, image, description, category, specs: specsObj });
      
      toast.success("Product added");
      setProductDialogOpen(false);
      setNewProduct({
        slug: "",
        model: "",
        price: "",
        image: "",
        description: "",
        category: categories[0]?.name || "",
        specs: [],
      });
      await refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      <Toaster richColors position="top-center" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
        style={{ background: colors.background.main }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-start sm:items-center mb-6 sm:mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradients.primary }}
          >
            {isAdmin ? "Admin" : "User"} Dashboard
          </h1>

          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setProductDialogOpen(true)}
                style={{ background: colors.gradients.primary }}
                className="text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                <span>Add Product</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setCategoryDialogOpen(true)}
                style={{ borderColor: colors.primary.main, color: colors.primary.main }}
                className="text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                <span>Manage Categories</span>
              </Button>
            </div>
          )}
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            title="Total Products"
            value={machines.length}
            icon={<Warehouse className="h-5 w-5" style={{ color: colors.primary.main }} />}
          />
          <StatCard
            title="Categories"
            value={categories.length}
            icon={<ListTree className="h-5 w-5" style={{ color: colors.secondary.main }} />}
          />
          <StatCard
            title="Total Sales"
            value={totalSales}
            icon={<Wallet className="h-5 w-5" style={{ color: colors.state.success }} />}
          />
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<Users className="h-5 w-5" style={{ color: colors.state.success }} />}
          />
        </div>

        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg p-3 sm:p-4"
          style={{ backgroundColor: colors.background.light }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-3" style={{ color: colors.text.primary }}>
            Product Overview
          </h2>
          <div className="h-64 sm:h-80 w-full overflow-x-auto">
            <div className="min-w-[300px] sm:min-w-[600px] h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart
                  data={salesData.length ? salesData : machines.map(m => ({
                    model: m.model,
                    sales: parseFloat(m.price.replace(/[^0-9.]/g, ""))
                  }))}
                  margin={{ right: 10, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.text.tertiary} />
                  <XAxis
                    dataKey="model"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{
                      fill: colors.text.secondary,
                      fontSize: 10
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: colors.text.secondary,
                      fontSize: 10
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.background.main,
                      borderColor: colors.background.light,
                      borderRadius: "8px",
                      fontSize: 12
                    }}
                  />
                  <Bar
                    dataKey="sales"
                    fill={colors.primary.main}
                    name="Total Sales"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Category Management Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent
          className="max-w-[90vw] rounded-lg sm:rounded-xl"
          style={{ backgroundColor: colors.background.main }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: colors.text.primary }}>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm" style={{ color: colors.text.secondary }}>
                Category Name
              </Label>
              <Input
                className="h-9 text-sm"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                style={{
                  backgroundColor: colors.background.light,
                  borderColor: colors.background.light,
                  color: colors.text.primary
                }}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm" style={{ color: colors.text.secondary }}>
                Existing Categories
              </Label>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="flex justify-between items-center p-2 rounded-md"
                    style={{ backgroundColor: colors.background.light }}
                  >
                    <span
                      className="text-sm truncate max-w-[120px] sm:max-w-none"
                      style={{ color: colors.text.primary }}
                    >
                      {category.name}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        className="text-sm h-8 px-3"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCategory(category.name);
                          setNewCategory(category.name);
                        }}
                        style={{ color: colors.primary.main }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        className="text-sm h-8 px-3"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.name)}
                        style={{ color: colors.state.error }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryDialogOpen(false);
                  setEditingCategory(null);
                  setNewCategory("");
                }}
                style={{
                  background: colors.primary.main,
                  borderColor: colors.background.dark,
                  color: colors.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                className="text-sm h-8 px-3"
                onClick={handleCategorySubmit}
                style={{ background: colors.primary.main }}
              >
                {editingCategory ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent
          className="max-w-[90vw] rounded-lg sm:rounded-xl"
          style={{ backgroundColor: colors.background.main }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg" style={{ color: colors.text.primary }}>
              Add New Product
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid gap-3">
              {/* <div className="space-y-1">
                <Label className="text-sm" style={{ color: colors.text.secondary }}>
                  Category
                </Label>
                <select
                  className="w-full p-2 text-sm rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  style={{
                    backgroundColor: colors.background.light,
                    borderColor: colors.background.light,
                    color: colors.text.primary
                  }}
                >
                  {categories.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div> */}

              <div className="space-y-1">
                <Label className="text-sm" style={{ color: colors.text.secondary }}>
                  Category
                </Label>
                <select
                  className="w-full p-2 text-sm rounded-md"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(p => ({ ...p, category: e.target.value }))}
                  style={{
                    backgroundColor: colors.background.light,
                    borderColor: colors.background.light,
                    color: colors.text.primary
                  }}
                  required
                >
                  {categories.length === 0 ? (
                    <option disabled value="">Create a category first</option>
                  ) : (
                    categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))
                  )}
                </select>
              </div>

              {["slug", "model", "price", "image"].map((field) => (
                <div key={field} className="space-y-1">
                  <Label className="text-sm capitalize" style={{ color: colors.text.secondary }}>
                    {field}
                  </Label>
                  <Input
                    className="h-9 text-sm"
                    value={(newProduct as any)[field]}
                    onChange={(e) => setNewProduct(p => ({ ...p, [field]: e.target.value }))}
                    style={{
                      backgroundColor: colors.background.light,
                      borderColor: colors.background.light,
                      color: colors.text.primary
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <Label className="text-sm" style={{ color: colors.text.secondary }}>
                Description
              </Label>
              <textarea
                className="w-full p-2 text-sm rounded-md min-h-[80px]"
                value={newProduct.description}
                onChange={(e) => setNewProduct(p => ({ ...p, description: e.target.value }))}
                style={{
                  backgroundColor: colors.background.light,
                  borderColor: colors.background.light,
                  color: colors.text.primary
                }}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm" style={{ color: colors.text.secondary }}>
                Specifications
              </Label>
              <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
                {newProduct.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={spec[0]}
                      onChange={(e) => {
                        const s = [...newProduct.specs];
                        s[i][0] = e.target.value;
                        setNewProduct(p => ({ ...p, specs: s }));
                      }}
                      style={{
                        backgroundColor: colors.background.light,
                        borderColor: colors.background.light,
                        color: colors.text.primary
                      }}
                    />
                    <Input
                      value={spec[1]}
                      onChange={(e) => {
                        const s = [...newProduct.specs];
                        s[i][1] = e.target.value;
                        setNewProduct(p => ({ ...p, specs: s }));
                      }}
                      style={{
                        backgroundColor: colors.background.light,
                        borderColor: colors.background.light,
                        color: colors.text.primary
                      }}
                    />
                  </div>
                ))}
              </div>
              <Button
                className="text-sm h-8 w-full"
                variant="outline"
                onClick={() => setNewProduct(p => ({ ...p, specs: [...p.specs, ["", ""]] }))}
                style={{
                  background: colors.primary.main,
                  borderColor: colors.background.light,
                  color: colors.text.primary
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add Specification
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setProductDialogOpen(false)}
                style={{
                  background: colors.primary.main,
                  borderColor: colors.background.light,
                  color: colors.text.primary
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProduct}
                style={{ background: colors.primary.main }}
              >
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}