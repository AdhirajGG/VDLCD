// app/(dashboard)/(routes)/products/category/[category]/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMachines } from "@/components/machine";
import { useCart } from "@/components/cart-context";

export default function CategoryProductsPage() {
  const router = useRouter();
   const { category } = useParams<{ category: string }>();
  const { machines, loading, error, refresh } = useMachines();
  const { addToCart } = useCart();

 useEffect(() => {
  if (category) {
    // Convert URL slug to proper category name format
    const formattedCategory = decodeURIComponent(category)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .trim(); // Add trim to remove any whitespace

    refresh(formattedCategory);
  }
}, [category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{category} Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((machine, index) => (
          <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full mb-4">
              <Image
                src={machine.image}
                alt={machine.model}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{machine.model}</h2>
            <p className="text-2xl font-bold text-primary mb-4">{machine.price}</p>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push(`/products/category/${category}/${machine.slug}`)} //test api
                variant="outline"
                className="w-full"
              >
                View Details
              </Button>
              <Button
                onClick={() => addToCart({
                  slug: machine.slug,
                  model: machine.model,
                  price: parseFloat(machine.price.replace(/[^0-9.]/g, '')),
                  image: machine.image
                })}
              >
                Add to Cart
              </Button>
              <Button
                onClick={() => router.push(`/checkout/${encodeURIComponent(machine.slug)}`)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Buy Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}