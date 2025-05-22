// // app/checkout/[productId]/page.tsx
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import { Toaster, toast } from "sonner";
// import axios from "axios";
// import { useCart } from "@/components/cart-context";
// import { useUser } from "@clerk/nextjs";
// import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";

// // Add inside the component before handlePayment
// const { user } = useUser();

// type Machine = {
//     slug: string;
//     model: string;
//     price: number | string;
// };

// // export default function CheckoutPage() {
// //     const { productId } = useParams<{ productId: string }>();
// //     const router = useRouter();
// //     const { cartItems, clearCart } = useCart();

// //     const [product, setProduct] = useState<Machine | null>(null);
// //     const [loading, setLoading] = useState(true);
// //     const [submitting, setSubmitting] = useState(false);

// //     useEffect(() => {
// //         // If this is the cart page (productId === "cart"), we skip fetching here.
// //         if (productId && productId !== "cart") {
// //             axios
// //                 .get<Machine>(`/api/machines/${encodeURIComponent(productId)}`)
// //                 .then((res) => {
// //                     setProduct(res.data);
// //                 })
// //                 .catch(() => {
// //                     toast.error("Product not found");
// //                     router.push("/products");
// //                 })
// //                 .finally(() => setLoading(false));
// //         } else {
// //             setLoading(false);
// //         }
// //     }, [productId, router]);

// //     // While loading data (or if slug = "cart"), show nothing or a spinner
// //     if (loading) {
// //         return (
// //             <div className="flex justify-center items-center h-screen">
// //                 <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
// //             </div>
// //         );
// //     }

// //     // If a productId was provided and we still have no product, bail out
// //     if (productId !== "cart" && !product) {
// //         return null;
// //     }
// //     const total = productId === "cart"
// //         ? cartItems.reduce(
// //             (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
// //             0
// //         )
// //         : Number(product?.price) || 0;

// //     const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
// //         e.preventDefault();
// //         setSubmitting(true);
// //         try {
// //             const formData = new FormData(e.currentTarget);
// //             const customerData = {
// //                 name: formData.get('fullName') || user?.fullName || 'Customer',
// //                 email: formData.get('email') || user?.primaryEmailAddress?.emailAddress || '',
// //                 address: `${formData.get('address')}, ${formData.get('city')} ${formData.get('postal')}`
// //             };

// //             const { data: order } = await axios.post("/api/orders", {
// //                 items: productId === "cart" ? cartItems : [product],
// //                 total: Number(total.toFixed(2)),
// //                 customer: customerData
// //             });

// //             const options = {
// //                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
// //                 amount: order.razorpayOrder.amount,
// //                 currency: "INR",
// //                 name: "VDLCD Automation",
// //                 order_id: order.razorpayOrder.id,
// //                 handler: async (response: any) => {
// //                     try {
// //                         await axios.post("/api/payment/verify", {
// //                             orderId: response.razorpay_order_id,
// //                             paymentId: response.razorpay_payment_id,
// //                             signature: response.razorpay_signature
// //                         });

// //                         if (productId === "cart") clearCart();
// //                         router.push("/orders");
// //                         toast.success("Payment successful!");
// //                     } catch (error) {
// //                         toast.error("Payment verification failed");
// //                         router.push(productId === "cart" ? "/cart" : "/products");
// //                     }
// //                 },
// //                 prefill: {
// //                     name: user?.fullName || "Customer",
// //                     email: user?.primaryEmailAddress?.emailAddress || ""
// //                 },
// //                 theme: { color: "#3B82F6" }
// //             };

// //             const rzp = new window.Razorpay(options);
// //             rzp.open();
// //         } catch (error) {
// //             toast.error("Failed to initiate payment");
// //             console.error("Payment error:", error);
// //         }
// //     };



// //     return (
// //         <div className="p-8 max-w-lg mx-auto">
// //             <h1 className="text-2xl font-bold mb-4">
// //                 {productId === "cart" ? "Checkout Cart" : `Checkout ${product!.model}`}
// //             </h1>

// //             <Card>
// //                 <CardContent>
// //                     <form onSubmit={handlePayment} className="space-y-6">
// //                         {/* Customer Info */}
// //                         <div>
// //                             <Label htmlFor="fullName">Full Name</Label>
// //                             <Input
// //                                 id="fullName"
// //                                 name="fullName"
// //                                 required
// //                                 placeholder="Jane Doe"
// //                             />
// //                         </div>
// //                         <div>
// //                             <Label htmlFor="email">Email Address</Label>
// //                             <Input
// //                                 id="email"
// //                                 name="email"
// //                                 type="email"
// //                                 required
// //                                 placeholder="jane@example.com"
// //                             />
// //                         </div>
// //                         <div>
// //                             <Label htmlFor="address">Shipping Address</Label>
// //                             <Input
// //                                 id="address"
// //                                 name="address"
// //                                 required
// //                                 placeholder="123 Main St, Apt 4B"
// //                             />
// //                         </div>

// //                         {/* Location */}
// //                         <div className="grid grid-cols-2 gap-4">
// //                             <div>
// //                                 <Label htmlFor="city">City</Label>
// //                                 <Input id="city" name="city" required placeholder="New York" />
// //                             </div>
// //                             <div>
// //                                 <Label htmlFor="postal">Postal Code</Label>
// //                                 <Input
// //                                     id="postal"
// //                                     name="postal"
// //                                     required
// //                                     placeholder="10001"
// //                                 />
// //                             </div>
// //                         </div>

// //                         {/* Payment Info */}
// //                         <div>
// //                             <Label htmlFor="cardNumber">Card Number</Label>
// //                             <Input
// //                                 id="cardNumber"
// //                                 name="cardNumber"
// //                                 type="text"
// //                                 required
// //                                 placeholder="4242 4242 4242 4242"
// //                                 maxLength={19}
// //                             />
// //                         </div>
// //                         <div className="grid grid-cols-2 gap-4">
// //                             <div>
// //                                 <Label htmlFor="expiry">Expiry Date</Label>
// //                                 <Input
// //                                     id="expiry"
// //                                     name="expiry"
// //                                     required
// //                                     placeholder="MM/YY"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <Label htmlFor="cvv">CVV</Label>
// //                                 <Input id="cvv" name="cvv" required placeholder="123" />
// //                             </div>
// //                         </div>

// //                         {/* Submit */}
// //                         <Button type="submit" className="w-full" disabled={submitting}>
// //                             {submitting
// //                                 ? "Processing…"
// //                                 : productId === "cart"
// //                                     ? `Pay ₹${total.toFixed(2)}`
// //                                     : `Pay ₹${total.toFixed(2)}`}
// //                         </Button>
// //                     </form>
// //                 </CardContent>
// //             </Card>

// //             <Toaster />
// //         </div>
// //     );
// // }

// export default function CheckoutPage() {
//     const { productId } = useParams<{ productId: string }>();
//     const router = useRouter();
//     const { cartItems, clearCart } = useCart();
//     const { user } = useUser();

//     const [loading, setLoading] = useState(true);
//     const [submitting, setSubmitting] = useState(false);

//     const total = productId === "cart" 
//         ? cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
//         : 0;

//     const handlePayment = async () => {
//         setSubmitting(true);
//         try {
//             const { data: order } = await axios.post("/api/orders", {
//                 items: productId === "cart" ? cartItems : [],
//                 total: Number(total.toFixed(2)),
//                 userId: user?.id
//             });

//             const options = {
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//                 amount: order.amount,
//                 currency: "INR",
//                 name: "VDLCD Automation",
//                 order_id: order.razorpayOrderId,
//                 handler: async (response: any) => {
//                     try {
//                         await axios.post("/api/payment/verify", {
//                             razorpayPaymentId: response.razorpay_payment_id,
//                             razorpayOrderId: response.razorpay_order_id,
//                             razorpaySignature: response.razorpay_signature,
//                             productId: order.id
//                         });

//                         if (productId === "cart") clearCart();
//                         router.push("/orders");
//                         toast.success("Payment successful!");
//                     } catch (error) {
//                         toast.error("Payment verification failed");
//                     }
//                 },
//                 prefill: {
//                     name: user?.fullName || "Customer",
//                     email: user?.primaryEmailAddress?.emailAddress || ""
//                 },
//                 theme: { color: "#3B82F6" }
//             };

//             const rzp = new window.Razorpay(options);
//             rzp.open();
//         } catch (error) {
//             toast.error("Failed to initiate payment");
//             console.error("Payment error:", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import { useCart } from "@/components/cart-context";
import { useUser } from "@clerk/nextjs";
import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
import { Machine } from "@/components/machine";
import { createRazorpayOrder } from "@/lib/razorpay";

export default function CheckoutPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const { user } = useUser();
  const [product, setProduct] = useState<Machine | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = productId === "cart"
    ? cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
    : product
      ? Number(product.price)
      : 0;


  // Fetch single product when not checking out cart
  useEffect(() => {
    if (productId && productId !== "cart") {
      axios.get(`/api/machines/${productId}`)
        .then(res => setProduct(res.data))
        .catch(() => {
          toast.error("Product not found");
          router.push("/products");
        });
    }
  }, [productId, router]);

  // const handlePayment = async () => {
  //     setSubmitting(true);
  //     try {
  //         const { data: order } = await axios.post("/api/orders", {
  //             items: productId === "cart" ? cartItems : [],
  //             total: Number(total.toFixed(2)),
  //             userId: user?.id
  //         });

  //         const options = {
  //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //             amount: order.amount,
  //             currency: "INR",
  //             name: "VDLCD Automation",
  //             order_id: order.razorpayOrderId,
  //             handler: async (response: any) => {
  //                 try {
  //                     await axios.post("/api/payment/verify", {
  //                         razorpayPaymentId: response.razorpay_payment_id,
  //                         razorpayOrderId: response.razorpay_order_id,
  //                         razorpaySignature: response.razorpay_signature,
  //                         orderId: order.id
  //                     });

  //                     if (productId === "cart") clearCart();
  //                     router.push("/orders");
  //                     toast.success("Payment successful!");
  //                 } catch (error) {
  //                     toast.error("Payment verification failed");
  //                 }
  //             },
  //             prefill: {
  //                 name: user?.fullName || "Customer",
  //                 email: user?.primaryEmailAddress?.emailAddress || ""
  //             },
  //             theme: { color: "#3B82F6" }
  //         };

  //         // @ts-ignore
  //                     const rzp = new (window as any).Razorpay(options);
  //                     rzp.open();
  //     } catch (error) {
  //         toast.error("Failed to initiate payment");
  //         console.error("Payment error:", error);
  //     } finally {
  //         setSubmitting(false);
  //     }
  // };

  const handlePayment = async () => {
    setSubmitting(true);
    try {
      const { data: order } = await axios.post("/api/orders", {
        items: productId === "cart"
          ? cartItems.map(item => ({
            slug: item.slug,
            model: item.model,
            price: Number(item.price),
            quantity: item.quantity,
            image: item.image
          }))
          : [{
            slug: product!.slug,
            model: product!.model,
            price: Number(product!.price),
            quantity: 1,
            image: product!.image
          }],
        total: Number(total.toFixed(2))
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "VDLCD Automation",
        order_id: order.razorpayOrderId,
        // handler: async (response: any) => {
        //     try {
        //         await axios.post("/api/payment/verify", {
        //             razorpayPaymentId: response.razorpay_payment_id,
        //             razorpayOrderId: response.razorpay_order_id,
        //             razorpaySignature: response.razorpay_signature,
        //             orderId: order.id
        //         });

        //         if (productId === "cart") clearCart();
        //         router.push("/orders");
        //         toast.success("Payment successful!");
        //     } catch (error) {
        //         toast.error("Payment verification failed");
        //     }
        // }
        handler: async (response: any) => {
          try {
            await axios.post("/api/payment/verify", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id
            });

            if (productId === "cart") clearCart();
            router.push("/orders");
            toast.success("Payment successful!");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },

        prefill: {
          name: user?.fullName || "Customer",
          email: user?.primaryEmailAddress?.emailAddress || ""
        },
        theme: { color: "#3B82F6" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error("Failed to initiate payment");
      console.error("Payment error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="p-8 max-w-lg mx-auto">
      <RazorpayScriptLoader />
      <h1 className="text-2xl font-bold mb-4">
        {productId === "cart" ? "Cart Checkout" : "Product Checkout"}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Single Product Checkout */}
          {productId !== "cart" && product && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.model}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <p className="font-medium">{product.model}</p>
                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>
                </div>
              </div>
              <span className="font-medium">
                ₹{Number(product.price).toFixed(2)}
              </span>
            </div>
          )}

          {/* Cart Items */}
          {productId === "cart" && cartItems.map((item) => (
            <div key={item.slug} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.model}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <p className="font-medium">{item.model}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <span className="font-medium">
                ₹{(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          {/* Total Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span className="text-lg">
                ₹{total.toFixed(2)}
              </span>
            </div>
            {productId !== "cart" && (
              <p className="text-sm text-gray-500 mt-1 text-right">
                (Including all applicable taxes)
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={handlePayment}
          className="w-full mt-6 text-lg py-6 bg-blue-600 hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
        </Button>
      </div>

      <Toaster />
    </div>
  );
}