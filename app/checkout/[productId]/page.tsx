"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMachines } from "@/components/machine";
import { Toaster, toast } from "sonner"; // Import toast from the correct library

export default function CheckoutPage() {
  const { productId } = useParams() || {};
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { machines } = useMachines();
console.log("Fetched productId:", productId);
  // Fetch product details based on productId
  useEffect(() => {
    const foundProduct = machines.find(
      (machine) => machine.slug.toLowerCase() === (Array.isArray(productId) ? productId[0].toLowerCase() : productId?.toLowerCase())
    );

    if (!foundProduct) {
      // Show toast notification if product does not exist
      toast.error("The product you are looking for does not exist.", {
        description: "Product Not Found",
      });

      // Redirect back to the products page after showing the toast
      setTimeout(() => {
        router.push("/products");
      }, 3000);
    } else {
      setProduct(foundProduct);
    }
  }, [productId, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Checkout data for", productId, data);

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast(
        `Order Placed: Your order for ${product?.model} has been placed successfully.`
      );
    }, 1000);
  };

  if (!product) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Info */}
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" required placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <Label htmlFor="address">Shipping Address</Label>
              <Input
                id="address"
                name="address"
                required
                placeholder="123 Main St, Apt 4B"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required placeholder="New York" />
              </div>
              <div>
                <Label htmlFor="postal">Postal Code</Label>
                <Input id="postal" name="postal" required placeholder="10001" />
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                type="text"
                required
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" name="expiry" required placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" name="cvv" required placeholder="123" maxLength={4} />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting
                ? "Placing Order…"
                : `Pay ${product?.price || "–"}`}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster /> {/* Render the Toaster component */}
    </div>
  );
}