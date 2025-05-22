// // app/api/checkout/[id]/route.ts
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useCart } from "@/components/cart-context";
// import { toast } from "sonner";
// import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";

// type CheckoutType = 'order' | 'product' | 'cart';

// interface PaymentItem {
//   slug: string;
//   model: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// interface OrderDetails {
//   id: string;
//   total: number;
//   items: PaymentItem[];
//   status: string;
//   razorpayOrderId?: string;
// }


// export default function UnifiedCheckoutPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { cartItems, clearCart } = useCart();
//   const [checkoutType, setCheckoutType] = useState<CheckoutType>();
//   const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
//   const [productDetails, setProductDetails] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [totalAmount, setTotalAmount] = useState(0);

//   useEffect(() => {
//     const determineIdType = () => {
//       if (id === 'cart') return 'cart';
//       if (typeof id === 'string' && id.startsWith('ord_')) return 'order';
//       return 'product';
//     };

//     const type = determineIdType();
//     setCheckoutType(type);

//     const fetchData = async () => {
//       try {
//         switch (type) {
//           case 'order':
//             const orderRes = await axios.get(`/api/orders/${id}`);
//             setOrderDetails(orderRes.data);
//             setTotalAmount(orderRes.data.total);
//             break;

//           case 'product':
//             const productRes = await axios.get(`/api/machines/${id}`);
//             setProductDetails(productRes.data);
//             setTotalAmount(Number(productRes.data.price));
//             break;

//           case 'cart':
//             const cartTotal = cartItems.reduce(
//               (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
//               0
//             );
//             setTotalAmount(cartTotal);
//             break;
//         }
//       } catch (error) {
//         toast.error("Failed to load checkout details");
//         console.error("Fetch error:", error);
//         router.push(type === 'order' ? '/orders' : '/products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, cartItems, router]);

//   const handlePayment = async () => {
//     if (!checkoutType) return;

//     try {
//       let razorpayOrder;

//       if (checkoutType === 'order') {
//         // Existing order payment
//         razorpayOrder = await axios.post("/api/checkout", {
//           amount: Math.round(orderDetails!.total * 100),
//           orderId: orderDetails!.id
//         });
//       } else {
//         // New payment (product or cart)
//         const items = checkoutType === 'cart' 
//           ? cartItems 
//           : [{
//               ...productDetails,
//               price: Number(productDetails.price),
//               quantity: 1
//             }];

//         razorpayOrder = await axios.post("/api/checkout", {
//           amount: Math.round(totalAmount * 100),
//           items
//         });
//       }

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: razorpayOrder.data.amount,
//         currency: "INR",
//         name: "VDLCD Automation",
//         description: checkoutType === 'order' 
//           ? `Order #${orderDetails!.id}` 
//           : checkoutType === 'cart' 
//             ? "Cart Checkout" 
//             : productDetails.model,
//         order_id: razorpayOrder.data.id,
//         handler: async (response: any) => {
//           try {
//             await axios.post("/api/payment/verify", {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature
//             });

//             if (checkoutType === 'cart') clearCart();
//             toast.success("Payment successful!");
//             router.push("/orders");
//           } catch (error) {
//             toast.error("Payment verification failed");
//             console.error("Payment error:", error);
//           }
//         },
//         prefill: {
//           name: "Customer Name",
//           email: "customer@example.com",
//           contact: "9999999999"
//         },
//         theme: { color: "#3B82F6" }
//       };

//       // Add a type definition for Razorpay to avoid TypeScript error
//       interface RazorpayInstance {
//         open: () => void;
//         // Add other methods if needed
//       }
//       // @ts-ignore: Ignore if Razorpay is not typed globally
//       const rzp: RazorpayInstance = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       toast.error("Payment initiation failed");
//       console.error("Payment error:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
//       </div>
//     );
//   }

//   const items = checkoutType === 'order' 
//     ? orderDetails?.items 
//     : checkoutType === 'cart' 
//       ? cartItems 
//       : productDetails ? [productDetails] : [];

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8">
//         {checkoutType === 'order' ? 'Order Payment' : 'Checkout'}
//       </h1>

//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="space-y-4">
//           {items?.map((item: any) => (
//             <div key={item.slug} className="flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 {item.image && (
//                   <img 
//                     src={item.image} 
//                     alt={item.model} 
//                     className="w-16 h-16 object-contain"
//                   />
//                 )}
//                 <span>{item.model}</span>
//               </div>
//               <span>
//                 ₹{Number(item.price).toFixed(2)} × {item.quantity || 1}
//               </span>
//             </div>
//           ))}

//           <div className="border-t pt-4 mt-4">
//             <div className="flex justify-between items-center font-bold">
//               <span>Total</span>
//               <span>₹{totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         <button
//           onClick={handlePayment}
//           className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg"
//         >
//           Pay Now
//         </button>

//         <button
//           onClick={() => router.push(checkoutType === 'order' ? '/orders' : '/products')}
//           className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           {checkoutType === 'order' ? 'Back to Orders' : 'Continue Shopping'}
//         </button>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import { Toaster, toast } from "sonner";
// import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
// import { useCart } from "@/components/cart-context";

// interface PaymentItem {
//   slug: string;
//   model: string;
//   price: number;
//   quantity: number;
//   image?: string;
// }

// interface OrderDetails {
//   id: string;
//   total: number;
//   items: string; // Store as JSON string
//   status: string;
//   razorpayOrderId: string;
//   user?: {
//     name?: string;
//     email?: string;
//   };
// }

// export default function CheckoutPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { cartItems, clearCart } = useCart();
//   const [order, setOrder] = useState<OrderDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [checkoutType, setCheckoutType] = useState<'order' | 'product' | 'cart'>();

//   useEffect(() => {
//     const determineCheckoutType = () => {
//       if (id === 'cart') return 'cart';
//       if (typeof id === 'string' && id.startsWith('ord_')) return 'order';
//       return 'product';
//     };

//     const type = determineCheckoutType();
//     setCheckoutType(type);

//     const fetchData = async () => {
//       try {
//         switch (type) {
//           case 'order':
//             const orderRes = await axios.get(`/api/orders/${id}`);
//             setOrder(orderRes.data);
//             break;

//           case 'product':
//             const productRes = await axios.get(`/api/machines/${id}`);
//             await handleNewOrder([{
//               slug: productRes.data.slug,
//               model: productRes.data.model,
//               price: Number(productRes.data.price),
//               quantity: 1,
//               image: productRes.data.image
//             }]);
//             break;

//           case 'cart':
//             await handleNewOrder(cartItems.map(item => ({
//               slug: item.slug,
//               model: item.model,
//               price: Number(item.price),
//               quantity: item.quantity,
//               image: item.image
//             })));
//             break;
//         }
//       } catch (error) {
//         toast.error("Failed to load checkout details");
//         console.error("Fetch error:", error);
//         router.push('/products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, cartItems, router]);

//   const handleNewOrder = async (items: PaymentItem[]) => {
//     try {
//       const total = items.reduce(
//         (sum, item) => sum + item.price * item.quantity,
//         0
//       );

//       const { data: newOrder } = await axios.post("/api/orders", {
//         items: items.map(item => ({
//           ...item,
//           price: Number(item.price.toFixed(2))
//         })),
//         total: Number(total.toFixed(2))
//       });

//       // Redirect to order-specific checkout
//       router.replace(`/checkout/${newOrder.id}`);
//       setOrder(newOrder);
//     } catch (error) {
//       toast.error("Failed to create order");
//       console.error("Order creation error:", error);
//     }
//   };

//   const handlePayment = async () => {
//     if (!order) return;

//     try {
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: order.total * 100,
//         currency: "INR",
//         name: "VDLCD Automation",
//         order_id: order.razorpayOrderId,
//         handler: async (response: any) => {
//           try {
//             await axios.post("/api/payment/verify", {
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpayOrderId: response.razorpay_order_id,
//               razorpaySignature: response.razorpay_signature,
//               orderId: order.id
//             });

//             if (checkoutType === 'cart') clearCart();
//             toast.success("Payment successful!");
//             router.push("/orders");
//           } catch (error) {
//             toast.error("Payment verification failed");
//           }
//         },
//         prefill: {
//           name: order.user?.name || "Customer",
//           email: order.user?.email || "customer@example.com",
//           contact: "9999999999"
//         },
//         theme: { color: "#3B82F6" }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       toast.error("Payment initiation failed");
//       console.error("Payment error:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
//       </div>
//     );
//   }

//   if (!order) { 
//     return <div className="text-center p-8">Order not found</div>;
//   }

//   return (
//     <div className="p-8 max-w-2xl mx-auto">
//       <RazorpayScriptLoader />
//       <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
//         {JSON.parse(order.items).map((item: PaymentItem) => (
//           <div key={item.slug} className="flex justify-between items-center mb-4">
//             <div className="flex items-center gap-4">
//               {item.image && (
//                 <img
//                   src={item.image}
//                   alt={item.model}
//                   className="w-16 h-16 object-contain"
//                 />
//               )}
//               <div>
//                 <p className="font-medium">{item.model}</p>
//                 <p className="text-sm text-gray-500">
//                   Qty: {item.quantity}
//                 </p>
//               </div>
//             </div>
//             <span className="font-medium">
//               ₹{(item.price * item.quantity).toFixed(2)}
//             </span>
//           </div>
//         ))}

//         <div className="border-t pt-4 mt-4">
//           <div className="flex justify-between items-center font-bold">
//             <span>Total</span>
//             <span className="text-lg">₹{order.total.toFixed(2)}</span>
//           </div>
//         </div>

//         <button
//           onClick={handlePayment}
//           className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg"
//         >
//           Pay Now
//         </button>

//         <button
//           onClick={() => router.push(checkoutType === 'order' ? '/orders' : '/products')}
//           className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
//         >
//           {checkoutType === 'order' ? 'Back to Orders' : 'Continue Shopping'}
//         </button>
//       </div>
//       <Toaster />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Toaster, toast } from "sonner";
import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
import { useCart } from "@/components/cart-context";

interface OrderItem {
  slug: string;
  model: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  total: number;
  items: string; // JSON string of OrderItem[]
  razorpayOrderId: string;
  status: string;
}

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`/api/orders/${id}`);
        setOrder(data);
      } catch (error) {
        toast.error("Order not found");
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, router]);

  const handlePayment = async () => {
    if (!order) return;

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.total * 100, // Convert to paise
        currency: "INR",
        name: "Your Store Name",
        order_id: order.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await axios.post("/api/payment/verify", {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id
            });

            clearCart();
            toast.success("Payment successful!");
            router.push("/orders");
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#3B82F6" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment initiation failed");
      console.error("Payment error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" />
      </div>
    );
  }

  if (!order) {
    return <div className="text-center p-8">Order not found</div>;
  }

  const items: OrderItem[] = JSON.parse(order.items);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <RazorpayScriptLoader />
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        
        {items.map((item) => (
          <div key={item.slug} className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.model}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <p className="font-medium">{item.model}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
            <span className="font-medium">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center font-bold">
            <span>Total</span>
            <span className="text-lg">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg"
        >
          Pay Now
        </button>
      </div>
      <Toaster />
    </div>
  );
}