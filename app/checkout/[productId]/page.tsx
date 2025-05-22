

// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { Toaster, toast } from "sonner";
// import axios from "axios";
// import { useCart } from "@/components/cart-context";
// import { useUser } from "@clerk/nextjs";
// import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
// import { Machine } from "@/components/machine";
// import { createRazorpayOrder } from "@/lib/razorpay";

// export default function CheckoutPage() {
//   const { productId } = useParams<{ productId: string }>();
//   const router = useRouter();
//   const { cartItems, clearCart } = useCart();
//   const { user } = useUser();
//   const [product, setProduct] = useState<Machine | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   const total = productId === "cart"
//     ? cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0)
//     : product
//       ? Number(product.price)
//       : 0;


//   // Fetch single product when not checking out cart
//   useEffect(() => {
//     if (productId && productId !== "cart") {
//       axios.get(`/api/machines/${productId}`)
//         .then(res => setProduct(res.data))
//         .catch(() => {
//           toast.error("Product not found");
//           router.push("/products");
//         });
//     }
//   }, [productId, router]);

//   // const handlePayment = async () => {
//   //     setSubmitting(true);
//   //     try {
//   //         const { data: order } = await axios.post("/api/orders", {
//   //             items: productId === "cart" ? cartItems : [],
//   //             total: Number(total.toFixed(2)),
//   //             userId: user?.id
//   //         });

//   //         const options = {
//   //             key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//   //             amount: order.amount,
//   //             currency: "INR",
//   //             name: "VDLCD Automation",
//   //             order_id: order.razorpayOrderId,
//   //             handler: async (response: any) => {
//   //                 try {
//   //                     await axios.post("/api/payment/verify", {
//   //                         razorpayPaymentId: response.razorpay_payment_id,
//   //                         razorpayOrderId: response.razorpay_order_id,
//   //                         razorpaySignature: response.razorpay_signature,
//   //                         orderId: order.id
//   //                     });

//   //                     if (productId === "cart") clearCart();
//   //                     router.push("/orders");
//   //                     toast.success("Payment successful!");
//   //                 } catch (error) {
//   //                     toast.error("Payment verification failed");
//   //                 }
//   //             },
//   //             prefill: {
//   //                 name: user?.fullName || "Customer",
//   //                 email: user?.primaryEmailAddress?.emailAddress || ""
//   //             },
//   //             theme: { color: "#3B82F6" }
//   //         };

//   //         // @ts-ignore
//   //                     const rzp = new (window as any).Razorpay(options);
//   //                     rzp.open();
//   //     } catch (error) {
//   //         toast.error("Failed to initiate payment");
//   //         console.error("Payment error:", error);
//   //     } finally {
//   //         setSubmitting(false);
//   //     }
//   // };

//   const handlePayment = async () => {
//     setSubmitting(true);
//     try {
//       const { data: order } = await axios.post("/api/orders", {
//         items: productId === "cart"
//           ? cartItems.map(item => ({
//             slug: item.slug,
//             model: item.model,
//             price: Number(item.price),
//             quantity: item.quantity,
//             image: item.image
//           }))
//           : [{
//             slug: product!.slug,
//             model: product!.model,
//             price: Number(product!.price),
//             quantity: 1,
//             image: product!.image
//           }],
//         total: Number(total.toFixed(2))
//       });

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         name: "VDLCD Automation",
//         order_id: order.razorpayOrderId,
//         // handler: async (response: any) => {
//         //     try {
//         //         await axios.post("/api/payment/verify", {
//         //             razorpayPaymentId: response.razorpay_payment_id,
//         //             razorpayOrderId: response.razorpay_order_id,
//         //             razorpaySignature: response.razorpay_signature,
//         //             orderId: order.id
//         //         });

//         //         if (productId === "cart") clearCart();
//         //         router.push("/orders");
//         //         toast.success("Payment successful!");
//         //     } catch (error) {
//         //         toast.error("Payment verification failed");
//         //     }
//         // }
//         handler: async (response: any) => {
//           try {
//             await axios.post("/api/payment/verify", {
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpayOrderId: response.razorpay_order_id,
//               razorpaySignature: response.razorpay_signature,
//               orderId: order.id
//             });

//             if (productId === "cart") clearCart();
//             router.push("/orders");
//             toast.success("Payment successful!");
//           } catch (error) {
//             toast.error("Payment verification failed");
//           }
//         },

//         prefill: {
//           name: user?.fullName || "Customer",
//           email: user?.primaryEmailAddress?.emailAddress || ""
//         },
//         theme: { color: "#3B82F6" }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       toast.error("Failed to initiate payment");
//       console.error("Payment error:", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };
//   return (
//     <div className="p-8 max-w-lg mx-auto">
//       <RazorpayScriptLoader />
//       <h1 className="text-2xl font-bold mb-4">
//         {productId === "cart" ? "Cart Checkout" : "Product Checkout"}
//       </h1>

//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-4">
//           {/* Single Product Checkout */}
//           {productId !== "cart" && product && (
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={product.image}
//                   alt={product.model}
//                   className="w-16 h-16 object-contain"
//                 />
//                 <div>
//                   <p className="font-medium">{product.model}</p>
//                   <p className="text-sm text-gray-500">
//                     {product.category}
//                   </p>
//                 </div>
//               </div>
//               <span className="font-medium">
//                 ₹{Number(product.price).toFixed(2)}
//               </span>
//             </div>
//           )}

//           {/* Cart Items */}
//           {productId === "cart" && cartItems.map((item) => (
//             <div key={item.slug} className="flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <img
//                   src={item.image}
//                   alt={item.model}
//                   className="w-16 h-16 object-contain"
//                 />
//                 <div>
//                   <p className="font-medium">{item.model}</p>
//                   <p className="text-sm text-gray-500">
//                     Qty: {item.quantity}
//                   </p>
//                 </div>
//               </div>
//               <span className="font-medium">
//                 ₹{(Number(item.price) * item.quantity).toFixed(2)}
//               </span>
//             </div>
//           ))}

//           {/* Total Section */}
//           <div className="border-t pt-4 mt-4">
//             <div className="flex justify-between items-center font-bold">
//               <span>Total</span>
//               <span className="text-lg">
//                 ₹{total.toFixed(2)}
//               </span>
//             </div>
//             {productId !== "cart" && (
//               <p className="text-sm text-gray-500 mt-1 text-right">
//                 (Including all applicable taxes)
//               </p>
//             )}
//           </div>
//         </div>

//         <Button
//           onClick={handlePayment}
//           className="w-full mt-6 text-lg py-6 bg-blue-600 hover:bg-blue-700"
//           disabled={submitting}
//         >
//           {submitting ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
//         </Button>
//       </div>

//       <Toaster />
//     </div>
//   );
// }

// page.tsx
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

  // Fetch the single product if not checking out the cart
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

  const handlePayment = async () => {
    setSubmitting(true);

    // Build payload
    const itemsPayload = productId === "cart"
      ? cartItems.map(item => ({
          slug: item.slug,
          model: item.model,
          price: Number(item.price),
          quantity: item.quantity,
          image: item.image
        }))
      : product
        ? [{
            slug: product.slug,
            model: product.model,
            price: Number(product.price),
            quantity: 1,
            image: product.image
          }]
        : [];
console.log("→ Posting order:", {
  items: itemsPayload,
  total: Number(total.toFixed(2)),
});
    try {
      // 1) Create our own order in the backend
      const { data: order } = await axios.post("/api/orders", {
        items: itemsPayload,
        total: Number(total.toFixed(2))
      });

      // 2) Kick off Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: "INR",
        name: "VDLCD Automation",
        order_id: order.razorpayOrderId,
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
          } catch (verifyError) {
            console.error("Verification error:", verifyError);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullName || "Customer",
          email: user?.primaryEmailAddress?.emailAddress || ""
        },
        theme: { color: "#3B82F6" }
      };

      // open checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      // If the server returned an error JSON, log & display it
      const serverMessage = err.response?.data?.error || err.message;
      console.error("Payment error:", err.response || err);
      toast.error(serverMessage);
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
        {/* Single product */}
        {productId !== "cart" && product && (
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <img src={product.image} alt={product.model} className="w-16 h-16 object-contain" />
              <div>
                <p className="font-medium">{product.model}</p>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
            <span className="font-medium">₹{Number(product.price).toFixed(2)}</span>
          </div>
        )}

        {/* Cart items */}
        {productId === "cart" && cartItems.map(item => (
          <div key={item.slug} className="flex justify-between items-center py-2 border-b">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.model} className="w-16 h-16 object-contain" />
              <div>
                <p className="font-medium">{item.model}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        {/* Total */}
        <div className="border-t pt-4 mt-4 flex justify-between items-center font-bold">
          <span>Total</span>
          <span className="text-lg">₹{total.toFixed(2)}</span>
        </div>

        <Button
          onClick={handlePayment}
          className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={submitting}
        >
          {submitting ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
        </Button>
      </div>

      <Toaster />
    </div>
  );
}
