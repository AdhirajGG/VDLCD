
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
  const { machines, categories, addMachine, refreshCategories } = useMachines();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState<NewProductType>({
    slug: "",
    model: "",
    price: "",
    image: "",
    description: "",
    category: categories[0]?.name || "",
    specs: [],
  });

  useEffect(() => {
    // Check admin role from Clerk metadata
    setIsAdmin(user?.publicMetadata?.role === "admin");
  }, [user]);

  useEffect(() => {
    if (categories.length && !newProduct.category) {
      setNewProduct((prev) => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

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

  const handleAddProduct = async () => {
    if (!validateProduct()) return;

    try {
      const specsObject: Record<string, string> = Object.fromEntries(newProduct.specs);
      await addMachine({
        ...newProduct,
        specs: specsObject,
      });
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
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("Product with this slug already exists!");
      } else {
        toast.error("Failed to add product.");
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      await axios.post("/api/categories", { name: newCategory });
      toast.success("Category added!");
      setNewCategory("");
      setShowCategoryModal(false);
      refreshCategories();
    } catch (error: any) {
      if (error?.response?.status === 409) {
        toast.error("Category already exists!");
      } else {
        toast.error("Failed to add category");
      }
    }
  };

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <Toaster />
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {isAdmin && (
          <Button
            onClick={() => setShowAddProductModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Add Product
          </Button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Recent Activity</h2>
          <p className="text-gray-600">No recent activity</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Statistics</h2>
          <p className="text-gray-600">
            Total products: <span className="font-bold">{machines?.length ?? 0}</span>
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {isAdmin && (
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
                onClick={() => setShowCategoryModal(true)}
              >
                Add Category
              </Button>
            )}
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
                  {categories.map(category => (
                    <option key={category.name} value={category.name}>
                      {category.name}
                    </option>
                  ))}
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
                  placeholder="e.g., /products/vd-580-pd.jpg"
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
                  <Plus className="h-4 w-4" /> Add Specification
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

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;