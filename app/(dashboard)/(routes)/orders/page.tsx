
// app/(dashboard)/(routes)/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import RazorpayScriptLoader from "@/components/RazorpayScriptLoader";
import Image from "next/image";

interface OrderItem {
  slug: string;
  model: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  razorpayOrderId?: string;
  paymentMethod: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    (async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(
          data.map(o => ({
            ...o,
            items:
              typeof (o as any).items === "string"
                ? JSON.parse((o as any).items)
                : (o as any).items,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
        toast.error("Could not fetch your orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [isLoaded, isSignedIn, getToken, router]);

  if (!isLoaded || loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 max-w-7xl mx-auto min-h-screen flex justify-center items-center"
      >
        <p style={{ color: colors.text.secondary }}>Loading orders…</p>
      </motion.div>
    );
  }

  return (
    <>
      {/* 1) Load Razorpay checkout.js on the page */}
      <RazorpayScriptLoader />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen"
      >
        <div
          className="rounded-xl sm:rounded-3xl p-4 sm:p-6 shadow-lg"
          style={{ background: colors.gradients.primary }}
        >
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-2xl sm:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent"
            style={{ backgroundImage: colors.gradients.secondary }}
          >
            Order History
          </motion.h1>

          {error ? (
            <div className="text-center" style={{ color: colors.state.error }}>
              {error}
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p style={{ color: colors.text.secondary }}>No orders found</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  className="rounded-lg sm:rounded-xl p-4 sm:p-6 border transition-colors"
                  style={{
                    backgroundColor: `${colors.background.light}30`,
                    borderColor: `${colors.background.light}80`,
                  }}
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <div>
                      <h3
                        className="text-base sm:text-lg font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: colors.text.secondary }}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className="text-xs sm:text-sm"
                      style={{
                        backgroundColor:
                          order.status === "COMPLETED"
                            ? `${colors.state.success}20`
                            : order.status === "PENDING"
                            ? `${colors.state.active}20`
                            : `${colors.state.error}20`,
                        color:
                          order.status === "COMPLETED"
                            ? colors.state.success
                            : order.status === "PENDING"
                            ? colors.state.active
                            : colors.state.error,
                      }}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div
                        key={item.slug}
                        className="flex justify-between items-center py-2 border-b"
                        style={{ borderColor: colors.state.hover }}
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.model}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md"
                              width={800}
                               height={800}
                            />
                          )}
                          <div>
                            <p
                              className="text-sm sm:text-base"
                              style={{ color: colors.text.primary }}
                            >
                              {item.model}
                            </p>
                            <p
                              className="text-xs sm:text-sm"
                              style={{ color: colors.text.secondary }}
                            >
                              {item.quantity} × Rs{item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p
                          className="text-sm sm:text-base"
                          style={{ color: colors.text.primary }}
                        >
                          Rs{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Payment Method: {order.paymentMethod}
                    </p>
                    <p
                      className="text-lg sm:text-xl font-bold"
                      style={{ color: colors.secondary.main }}
                    >
                      Total: Rs{order.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Actions for pending orders */}
                  {order.status === "PENDING" && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      <Button
                        onClick={() => {
                          if (!(window as any).Razorpay) {
                            toast.error("Payment SDK not loaded. Please refresh.");
                            return;
                          }
                          const rzp = new (window as any).Razorpay({
                            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                            order_id: order.razorpayOrderId,
                            handler: async (res: any) => {
                              try {
                                await axios.post("/api/payment/verify", {
                                  razorpay_order_id: res.razorpay_order_id,
                                  razorpay_payment_id: res.razorpay_payment_id,
                                  razorpay_signature: res.razorpay_signature,
                                  orderId: order.id,
                                });
                                // refresh to update status
                                setOrders(current =>
                                  current.map(o =>
                                    o.id === order.id
                                      ? { ...o, status: "COMPLETED" }
                                      : o
                                  )
                                );
                                toast.success("Payment successful!");
                              } catch {
                                toast.error("Verification failed");
                              }
                            },
                          });
                          rzp.open();
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Continue Payment
                      </Button>

                      <Button
                        onClick={async () => {
                          try {
                            await axios.post(`/api/orders/cancel`,{
                              orderId: order.id 
                            });
                            setOrders(current =>
                              current.map(o =>
                                o.id === order.id ? { ...o, status: "FAILED" } : o
                              )
                            );
                            toast.success("Order cancelled");
                          } catch {
                            toast.error("Could not cancel order");
                          }
                        }}
                        variant="destructive"
                        className="text-white"
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

