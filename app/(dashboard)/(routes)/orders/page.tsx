// app/(dashboard)/(routes)/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/colors";

interface OrderItem {
  slug: string;
  model: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: string;
  razorpayPaymentId?: string;
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
    if (!isLoaded) return; // Wait for Clerk to initialize

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get<Order[]>("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
        toast.error("Could not fetch your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isSignedIn, getToken, router, isLoaded]); // Add isLoaded to dependencies

  // In your component
const OrderPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data.map((order: any) => ({
          ...order,
          items: JSON.parse(order.items),
          createdAt: new Date(order.createdAt).toLocaleDateString()
        })));
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };
    
    fetchOrders();
  }, []);}

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p style={{ color: colors.text.secondary }}>Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 max-w-7xl mx-auto min-h-screen flex justify-center items-center"
      >
        <p style={{ color: colors.text.secondary }}>Loading orders...</p>
      </motion.div>
    );
  }

  return (
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
            {orders.map((order) => (
              <motion.div
                key={order.id}
                className="rounded-lg sm:rounded-xl p-4 sm:p-6 border transition-colors"
                style={{
                  backgroundColor: `${colors.background.light}30`,
                  borderColor: `${colors.background.light}80`
                }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold" style={{ color: colors.text.primary }}>
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className="text-xs sm:text-sm"
                    style={{
                      backgroundColor:
                        order.status === "COMPLETED" ? `${colors.state.success}20` :
                          order.status === "PENDING" ? `${colors.state.warning}20` :
                            `${colors.state.error}20`,
                      color:
                        order.status === "COMPLETED" ? colors.state.success :
                          order.status === "PENDING" ? colors.state.warning :
                            colors.state.error
                    }}
                  >
                    {order.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.slug}
                      className="flex justify-between items-center py-2 border-b"
                      style={{ borderColor: colors.state.hover }}
                    >
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.model}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md"
                          />
                        )}
                        <div>
                          <p className="text-sm sm:text-base" style={{ color: colors.text.primary }}>
                            {item.model}
                          </p>
                          <p className="text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
                            {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base" style={{ color: colors.text.primary }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
                  <p className="text-xs sm:text-sm" style={{ color: colors.text.secondary }}>
                    Payment Method: {order.paymentMethod}
                  </p>
                  <p className="text-lg sm:text-xl font-bold" style={{ color: colors.secondary.main }}>
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}