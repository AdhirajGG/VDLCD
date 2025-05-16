// app/(dashboard)/(routes)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { Plus } from "lucide-react";
import { useMachines } from "@/components/machine";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

const DashboardPage = () => {
  const router = useRouter();
  const { machines, categories, addMachine, refresh, refreshCategories } =
    useMachines();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    slug: "",
    model: "",
    price: "0",
    image: "",
    description: "",
    category: categories[0]?.name || "",
    specs: [] as [string, string][],
  });

  // Only admins get access
  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else {
      setIsAdmin(user.publicMetadata.role === "admin");
    }
  }, [user, router]);

  // Ensure product category default
  useEffect(() => {
    if (categories.length && !newProduct.category) {
      setNewProduct((p) => ({ ...p, category: categories[0].name }));
    }
  }, [categories]);

  // Category creation
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      await axios.post("/api/categories", { name: newCategory.trim() });
      toast.success("Category added!");
      setNewCategory("");
      setShowCategoryModal(false);
      await refreshCategories();
      await refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to add category");
    }
  };

  // Product creation
  const handleAddProduct = async () => {
    // basic validation
    if (
      !newProduct.slug ||
      !newProduct.model ||
      !newProduct.price ||
      !newProduct.image ||
      !newProduct.description
    ) {
      toast.error("Fill all product fields");
      return;
    }
    // try {
    //   const specsObj = Object.fromEntries(newProduct.specs);
    //   await addMachine({ ...newProduct, specs: specsObj });
    //   toast.success("Product added!");
    //   setNewProduct({
    //     slug: "",
    //     model: "",
    //     price: "",
    //     image: "",
    //     description: "",
    //     category: categories[0]?.name || "",
    //     specs: [],
    //   });
    //   setShowAddProductModal(false);
    //   await refresh();
    // } catch (err: any) {
    //   const status = err.response?.status;
    //   toast.error(
    //     status === 409
    //       ? "Product slug already exists"
    //       : "Failed to add product"
    //   );
    // }
    try {
      const specsObj = Object.fromEntries(newProduct.specs);
      await addMachine({ ...newProduct, specs: specsObj });
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
      // Only show error if slug already exists
      if (err.response?.status === 409) {
        toast.error("Product slug already exists");
      }
      // Otherwise, just log it (no generic toast)
      else {
        console.error("Add product error:", err);
      }
    }
  };

  return (
    <div className="p-6 space-y-8">
      <Toaster richColors />

      {/* Header */}
      <header className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {isAdmin ? " (Admin)" : " (User)"} Dashboard
        </motion.h1>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={() => setShowAddProductModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Add Product
            </Button>
          </motion.div>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {machines.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {categories.length}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={machines.slice(0, 5)} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Action: Add Category */}
      {isAdmin && (
        <div>
          <Button
            variant="outline"
            onClick={() => setShowCategoryModal(true)}
          >
            Add Category
          </Button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              {/* Category */}
              <div>
                <Label>Category</Label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded-lg"
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slug / Model / Price / Image / Description */}
              {["slug", "model", "image"].map((field) => (
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
                <Label>Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={newProduct.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    const sanitizedValue = value.replace(/(\..*)\./g, '$1');
                    setNewProduct(p => ({ ...p, price: sanitizedValue }));
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter price"
                />
              </div>


              <div>
                <Label>Description</Label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>

              {/* Specs */}
              {/* <div className="space-y-2">
                {newProduct.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={spec[0]}
                      onChange={(e) => {
                        const sp = [...newProduct.specs];
                        sp[i][0] = e.target.value;
                        setNewProduct((p) => ({ ...p, specs: sp }));
                      }}
                      placeholder="Spec name"
                    />
                    <Input
                      value={spec[1]}
                      onChange={(e) => {
                        const sp = [...newProduct.specs];
                        sp[i][1] = e.target.value;
                        setNewProduct((p) => ({ ...p, specs: sp }));
                      }}
                      placeholder="Spec value"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setNewProduct((p) => ({
                      ...p,
                      specs: [...p.specs, ["", ""]],
                    }))
                  }
                >
                  <Plus className="mr-2" /> Add Spec
                </Button>
              </div> */}
              <div className="space-y-2">
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  {newProduct.specs.map((spec, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        value={spec[0]}
                        onChange={(e) => {
                          const sp = [...newProduct.specs];
                          sp[i][0] = e.target.value;
                          setNewProduct((p) => ({ ...p, specs: sp }));
                        }}
                        placeholder="Spec name"
                      />
                      <Input
                        value={spec[1]}
                        onChange={(e) => {
                          const sp = [...newProduct.specs];
                          sp[i][1] = e.target.value;
                          setNewProduct((p) => ({ ...p, specs: sp }));
                        }}
                        placeholder="Spec value"
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setNewProduct(p => ({
                    ...p,
                    specs: [...p.specs, ["", ""]]
                  }))}
                  className="w-full"
                >
                  <Plus className="mr-2" /> Add Spec
                </Button>
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowAddProductModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
            />
            <div className="mt-4 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
