// app/dashboard/(routes)/products/category/[category]/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMachines } from "@/components/machine";
import { useCart } from "@/components/cart-context";
import { motion } from "framer-motion";
import { colors } from "@/lib/colors";

export default function CategoryProductsPage() {
  const router = useRouter();
  const { category } = useParams<{ category: string }>();
  const { machines, loading, error, refresh } = useMachines();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => { refresh(); }, []);

  const normalizedCategory = useMemo(() => {
    if (!category) return "";
    return decodeURIComponent(category).replace(/-/g, " ").trim().toLowerCase();
  }, [category]);

  const filtered = useMemo(
    () => machines.filter(m => m.category.toLowerCase() === normalizedCategory),
    [machines, normalizedCategory]
  );

  const handleQuantityChange = (
    product: { slug: string; model: string; price: string; image: string },
    delta: number
  ) => {
    const existing = cartItems.find(i => i.slug === product.slug);
    if (delta > 0) {
      if (existing) updateQuantity(product.slug, existing.quantity + 1);
      else addToCart({
        slug: product.slug,
        model: product.model,
        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
        image: product.image,
      });
    } else {
      if (!existing) return;
      const nextQty = existing.quantity - 1;
      if (nextQty > 0) updateQuantity(product.slug, nextQty);
      else removeFromCart(product.slug);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: colors.background.light }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-center" style={{ color: colors.state.error }}>{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-screen mx-auto min-h-screen"
    >
    <div className="rounded-3xl p-8 shadow-2xl"
     style={{ background: colors.background.main }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
        style={{
          color: colors.text.primary,

        }}
      >
        {normalizedCategory.charAt(0).toUpperCase() + normalizedCategory.slice(1)} Equipment
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <motion.div key={product.slug}>
            <Card
              className="rounded-xl p-6 border transition-colors "
                  style={{
                    backgroundColor: `${colors.secondary.dark}`,
                    borderColor: `${colors.background.light}80`
                  }}
            >
              <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden"
                style={{
                  background: `${colors.secondary.main}30`,
                  borderColor: `${colors.background.light}80`
                }}
              >
                <Image
                  src={product.image}
                  alt={product.model}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1"
              >
                <h2 className="text-xl font-semibold mb-2" style={{ color: colors.text.primary }}>
                  {product.model}
                </h2>
                <p className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>
                  Rs{parseFloat(product.price.replace(/[^0-9.]/g, "")).toFixed(2)}
                </p>

                <div className="flex items-center justify-between mb-4"
                  style={{
                    backgroundColor: `${colors.background.light}0`,
                    borderColor: `${colors.background.light}`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product, -1)}
                      disabled={
                        !cartItems.find((i) => i.slug === product.slug)
                          ?.quantity
                      }
                    >
                      –
                    </Button>
                    <span className="min-w-[2rem] text-center rounded-4xl" style={{ backgroundImage: colors.gradients.primary,
                        backgroundColor: colors.background.light,
                        color: colors.text.primary
                       }}>
                      {
                        cartItems.find((i) => i.slug === product.slug)
                          ?.quantity || 0
                      }
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product, 1)}
                      style={{ background: colors.text.primary,
                        
                       }}
                    >
                      +
                    </Button>
                  </div>
                </div>

              </div>
              <div className="flex flex-col space-y-2 mt-auto">
                <Button
                  variant="outline"
                  className="w-full"
                  style={{
                    backgroundColor: colors.background.light,
                    borderColor: colors.primary.dark,
                    color: colors.text.primary
                  }}
                  onClick={() =>
                    router.push(`/products/item/${product.slug}`)
                  }
                >
                  View Details
                </Button>
                <Button
                  className="w-full"
                  size="lg"
                  style={{
                    backgroundColor: colors.primary.main,
                    color: colors.text.primary
                  }}
                  onClick={() =>
                    router.push(`/checkout/${encodeURIComponent(product.slug)}`)
                  }
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
    </motion.div>
  );
}

