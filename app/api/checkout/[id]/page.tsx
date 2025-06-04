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
            // await axios.post("/api/payment/verify", {
            //   razorpayPaymentId: response.razorpay_payment_id,
            //   razorpayOrderId: response.razorpay_order_id,
            //   razorpaySignature: response.razorpay_signature,
            //   orderId: order.id
            await axios.post("/api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
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

      interface RazorpayInstance {
        open: () => void;
        // Add other methods if needed
      }      // @ts-ignore: Ignore if Razorpay is not typed globally
      const rzp: RazorpayInstance = new (window as any).Razorpay(options);
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