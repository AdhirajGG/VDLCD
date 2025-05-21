// app/api/checkout/[id]/route.ts
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/components/cart-context";
import { toast } from "sonner";

type CheckoutType = 'order' | 'product' | 'cart';

interface PaymentItem {
  slug: string;
  model: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderDetails {
  id: string;
  total: number;
  items: PaymentItem[];
  status: string;
  razorpayOrderId?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UnifiedCheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [checkoutType, setCheckoutType] = useState<CheckoutType>();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const determineIdType = () => {
      if (id === 'cart') return 'cart';
      if (typeof id === 'string' && id.startsWith('ord_')) return 'order';
      return 'product';
    };

    const type = determineIdType();
    setCheckoutType(type);

    const fetchData = async () => {
      try {
        switch (type) {
          case 'order':
            const orderRes = await axios.get(`/api/orders/${id}`);
            setOrderDetails(orderRes.data);
            setTotalAmount(orderRes.data.total);
            break;

          case 'product':
            const productRes = await axios.get(`/api/machines/${id}`);
            setProductDetails(productRes.data);
            setTotalAmount(Number(productRes.data.price));
            break;

          case 'cart':
            const cartTotal = cartItems.reduce(
              (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
              0
            );
            setTotalAmount(cartTotal);
            break;
        }
      } catch (error) {
        toast.error("Failed to load checkout details");
        console.error("Fetch error:", error);
        router.push(type === 'order' ? '/orders' : '/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, cartItems, router]);

  const handlePayment = async () => {
    if (!checkoutType) return;

    try {
      let razorpayOrder;

      if (checkoutType === 'order') {
        // Existing order payment
        razorpayOrder = await axios.post("/api/checkout", {
          amount: Math.round(orderDetails!.total * 100),
          orderId: orderDetails!.id
        });
      } else {
        // New payment (product or cart)
        const items = checkoutType === 'cart' 
          ? cartItems 
          : [{
              ...productDetails,
              price: Number(productDetails.price),
              quantity: 1
            }];

        razorpayOrder = await axios.post("/api/checkout", {
          amount: Math.round(totalAmount * 100),
          items
        });
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.data.amount,
        currency: "INR",
        name: "VDLCD Automation",
        description: checkoutType === 'order' 
          ? `Order #${orderDetails!.id}` 
          : checkoutType === 'cart' 
            ? "Cart Checkout" 
            : productDetails.model,
        order_id: razorpayOrder.data.id,
        handler: async (response: any) => {
          try {
            await axios.post("/api/payment/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (checkoutType === 'cart') clearCart();
            toast.success("Payment successful!");
            router.push("/orders");
          } catch (error) {
            toast.error("Payment verification failed");
            console.error("Payment error:", error);
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
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

  const items = checkoutType === 'order' 
    ? orderDetails?.items 
    : checkoutType === 'cart' 
      ? cartItems 
      : productDetails ? [productDetails] : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        {checkoutType === 'order' ? 'Order Payment' : 'Checkout'}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {items?.map((item: any) => (
            <div key={item.slug} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.model} 
                    className="w-16 h-16 object-contain"
                  />
                )}
                <span>{item.model}</span>
              </div>
              <span>
                ₹{Number(item.price).toFixed(2)} × {item.quantity || 1}
              </span>
            </div>
          ))}

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg"
        >
          Pay Now
        </button>

        <button
          onClick={() => router.push(checkoutType === 'order' ? '/orders' : '/products')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          {checkoutType === 'order' ? 'Back to Orders' : 'Continue Shopping'}
        </button>
      </div>
    </div>
  );
}